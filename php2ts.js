#!/usr/bin/env node

/**
 * php2ts.js — Convert a PHP model (class with properties) into a TypeScript interface.
 *
 * Usage:
 *   node php2ts.js path/to/Model.php [--out model.d.ts] [--name MyInterface]
 *                    [--prefix I] [--suffix DTO] [--date string|Date]
 *                    [--optionalOnNullable]
 *
 * No external dependencies.
 */

const { log } = require("console");
const fs = require("fs");
const path = require("path");

// ---------------- CLI options ----------------
function parseArgs(argv) {
  const opts = {
    inFile: "",
    date: "string",
    optionalOnNullable: false,
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = argv[i + 1];
    const takesValue = (v) => v && !v.startsWith("--");
    if (!opts.inFile && !a.startsWith("--")) {
      opts.inFile = a;
      continue;
    }
    if (a === "--out" && takesValue(next)) {
      opts.outFile = next;
      i++;
      continue;
    }
    if (a === "--name" && takesValue(next)) {
      opts.name = next;
      i++;
      continue;
    }
    if (a === "--prefix" && takesValue(next)) {
      opts.prefix = next;
      i++;
      continue;
    }
    if (a === "--suffix" && takesValue(next)) {
      opts.suffix = next;
      i++;
      continue;
    }
    if (
      a === "--date" &&
      takesValue(next) &&
      (next === "string" || next === "Date")
    ) {
      opts.date = next;
      i++;
      continue;
    }
    if (a === "--optionalOnNullable") {
      opts.optionalOnNullable = true;
      continue;
    }
  }

  if (!opts.inFile) {
    console.error(
      "Error: missing input file.\nExample: node php2ts.js MyModel.php --out MyModel.d.ts"
    );
    process.exit(1);
  }
  return opts;
}

// ---------------- Parsing helpers ----------------

const BUILTIN_TYPE_MAP = {
  int: "number",
  integer: "number",
  float: "number",
  double: "number",
  real: "number",
  string: "string",
  bool: "boolean",
  boolean: "boolean",
  mixed: "any",
  // array: "any[]",
  object: "Record<string, any>",
  callable: "Function",
  resource: "unknown",
  void: "void",
  never: "never",
  null: "null",
};

function cleanIdentifier(id) {
  return id.replace(/[^A-Za-z0-9_]/g, "_");
}

function simpleClassName(fqcn) {
  const trimmed = fqcn.replace(/^\\+/, "");
  return trimmed.split("\\").pop() || trimmed;
}

function mapPhpAtomicToTs(t, datePref) {
  const lower = t.toLowerCase();
  if (BUILTIN_TYPE_MAP[lower]) return BUILTIN_TYPE_MAP[lower];
  const bare = simpleClassName(t);
  if (
    ["datetime", "carbon", "carbonimmutable", "date"].includes(lower) ||
    /date(time)?$/i.test(bare)
  ) {
    return datePref === "Date" ? "Date" : "string";
  }
  return simpleClassName(t);
}

function parseArrayGeneric(s) {
  const m1 = s.match(/^array\s*<\s*([^,>]+)\s*,\s*([^>]+)\s*>$/i);
  if (m1) {
    const key = m1[1].trim();
    const val = m1[2].trim();
    const keyTs = mapPhpTypeToTs(key, "string", false);
    const valTs = mapPhpTypeToTs(val, "string", false);
    return {
      isArray: true,
      ts: `Record<${keyTs === "number" ? "number" : "string"}, ${valTs}>`,
    };
  }
  const m2 = s.match(/^array\s*<\s*([^>]+)\s*>$/i);
  if (m2) {
    const inner = mapPhpTypeToTs(m2[1].trim(), "string", false);
    return { isArray: true, ts: `${inner}[]` };
  }
  const m3 = s.match(/^(.+)\[\]$/);
  if (m3) {
    const inner = mapPhpTypeToTs(m3[1].trim(), "string", false);
    return { isArray: true, ts: `${inner}[]` };
  }
  if (/^array$/i.test(s.trim())) return { isArray: true, ts: "any[]" };
  return { isArray: false, ts: s };
}

function mapPhpTypeToTs(typeSpec, datePref, allowNull = true) {
  let spec = typeSpec.trim();
  let nullable = false;
  if (spec.startsWith("?")) {
    nullable = true;
    spec = spec.slice(1);
  }

  const parts = spec
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean);
  const tsParts = [];
  for (const p of parts) {
    if (p.toLowerCase() === "null") {
      nullable = true;
      continue;
    }
    const arr = parseArrayGeneric(p);
    const atom = mapPhpAtomicToTs(arr.ts, datePref);
    tsParts.push(atom);
  }
  let ts = tsParts.join(" | ") || "any";
  if (allowNull && nullable) ts = ts + " | null";
  return ts;
}

function extractDocVarType(doc) {
  if (!doc) return undefined;
  const m = doc.match(/@var\s+([^\s*]+)/i);
  if (m) return m[1].trim();
  return undefined;
}

function extractDocDescription(doc) {
  if (!doc) return undefined;
  const cleaned = doc
    .replace(/\r/g, "")
    .replace(/\/\*\*|\*\//g, "")
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, "").trim())
    .filter((l) => l && !l.startsWith("@"));
  return cleaned[0];
}

function getPhpClassName(src) {
  const m = src.match(/class\s+([A-Za-z_][A-Za-z0-9_]*)/);
  return m ? m[1] : undefined;
}

function parsePhpProperties(src, datePref, optionalOnNullable) {
  const re =
    /((?:\/\*\*[\s\S]*?\*\/))?\s*(public|protected|private)\s+(?:static\s+)?(?:(\??[A-Za-z_\\|][A-Za-z0-9_\\|\[\]<> ,]*)\s+)?\$([A-Za-z_][A-Za-z0-9_]*)\s*(?:=\s*([^;]+))?\s*;/g;
  const props = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    const doc = m[1];
    const phpTypeRaw = (m[3] || "").trim();
    const name = m[4];
    const defVal = (m[5] || "").trim();

    const docVar = extractDocVarType(doc);

    const tsFromDoc = docVar ? mapPhpTypeToTs(docVar, datePref) : undefined;
    const tsFromType = phpTypeRaw
      ? mapPhpTypeToTs(phpTypeRaw, datePref)
      : undefined;

    const tsType = tsFromDoc || tsFromType || "any";

    const nullable =
      /\|\s*null\b/.test(tsType) ||
      /^\?/.test(phpTypeRaw) ||
      /\bnull\b/i.test(defVal);
    const optional = optionalOnNullable && nullable;

    const docDesc = extractDocDescription(doc);

    props.push({ name, tsType, optional, doc: docDesc });
  }
  return props;
}

function parsePhpImport(src) {
  // match use statements
  const useRegex = /^use\s+([^;]+);/gm;
  let imports = [];
  let match;
  while ((match = useRegex.exec(src)) !== null) {
    const fullPath = match[1].trim(); // vd: Jikan\Model\Common\DateRange
    const parts = fullPath.split("\\");
    const className = parts[parts.length - 1];
    const tsPath = fullPath.replace(/\\/g, "/");
    if(tsPath.startsWith("Jikan/Model/")) {
      imports.push(
        `import { ${className} } from "${tsPath.replace(
          "Jikan/Model/",
          "../"
        )}";`
      );
    }
  }

  return imports;
}

function buildInterface(name, props) {
  const lines = [];
  lines.push(`export interface ${name} {`);
  for (const p of props) {
    const optionalMark = p.optional ? "?" : "";
    if (p.doc) lines.push(`  /** ${p.doc} */`);
    lines.push(`  ${cleanIdentifier(p.name)}${optionalMark}: ${p.tsType};`);
  }
  lines.push("}");
  return lines.join("\n");
}

function getPhpFiles(dir, allFiles = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getPhpFiles(fullPath, allFiles); // đệ quy
    } else if (entry.isFile() && entry.name.endsWith(".php")) {
      allFiles.push(fullPath);
    }
  }

  return allFiles;
}





// ---------------- Main ----------------
function php2ts(filePath) {
  const php = fs.readFileSync(filePath, "utf8");

  const className =
    getPhpClassName(php) ||
    path.basename(filePath).replace(/\.php$/i, "");
  const ifaceName = `${className}`;
  const imports = parsePhpImport(php);
  const props = parsePhpProperties(php, "string", true);
  // console.log(props);

  const ts = buildInterface(ifaceName, props);

  const header = `// Auto-generated by php2ts.js from ${path.basename(
    filePath
  )}\n`;
  const outContent = imports.join("\n") + "\n" + header + ts + "\n";
  // const outContent = header + ts + "\n";
  const outFile = filePath.replace(/\.php$/i, ".d.ts");

  fs.writeFileSync(outFile, outContent, "utf8");
  console.log(`Wrote ${outFile}`);

}


(function batchConvert() {
  const folder = "src/Model";
  const files = getPhpFiles(folder);
  console.log(files);

  for (const file of files) {
    php2ts(file);
  }
})();