`params.id`;
import { notFound } from "next/navigation";
// import type { Anime } from '@jikan-ts/models'
import { AnimeClient, Anime } from "@jikan-ts";
import { OverviewTab } from "./components/tabs/OverviewTab";

interface AnimePageProps {
  params: { id: string };
}

export default async function AnimePage({ params }: AnimePageProps) {
  const animeClient = new AnimeClient({ enableLogging: false });
  const id = Number(params.id);

  if (!Number.isFinite(id) || id <= 0) return notFound();

  try {
    const response = await animeClient.getAnimeFullById(id);
    const anime = response.data as Anime;

    return <OverviewTab anime={anime} />;
  } catch (error) {
    console.error("Error fetching anime:", error);
    notFound();
  }
}
