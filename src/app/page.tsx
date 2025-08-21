import Link from "next/link";
import { RandomClient, TopClient } from "../../jikan-ts";
import type { Anime } from "../../jikan-ts/models";
import { AnimeCard, SectionHeader, StatsCard, GridLayout } from "@/components";

export default async function HomePage() {
  const topClient = new TopClient({
    enableLogging: false,
    cacheOptions: { ttl: 1000 * 60 * 10 },
  });
  const randomClient = new RandomClient({
    enableLogging: false,
    cacheOptions: { ttl: 1000 * 60 * 5 },
  });

  const [topAiringRes, topPopularRes, randomRes] = await Promise.all([
    topClient.getTopAnime({ filter: "airing", page: 1, limit: 12 }),
    topClient.getTopAnime({ filter: "bypopularity", page: 1, limit: 12 }),
    randomClient.getRandomAnime(),
  ]);

  const hero = randomRes.data;
  const airing = topAiringRes.data;
  const popular = topPopularRes.data;

  const heroImg =
    hero.images.webp?.large_image_url ||
    hero.images.jpg.large_image_url ||
    hero.images.jpg.image_url;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 overflow-hidden">
          {heroImg && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImg}
              alt={hero.title}
              className="w-full h-full object-cover opacity-20"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
        </div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Anime <span className="text-yellow-400">Wiki</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Khám phá thế giới anime với cơ sở dữ liệu lớn nhất về anime, manga,
            nhân vật và nhiều hơn nữa
          </p>
          {hero && (
            <div className="mt-8 p-4 bg-white/10 backdrop-blur rounded-lg max-w-md mx-auto">
              <p className="text-sm text-yellow-200 mb-2">
                ✨ Random Anime hôm nay:
              </p>
              <Link
                href={`/anime/${hero.mal_id}`}
                className="text-lg font-semibold hover:text-yellow-300 transition-colors"
              >
                {hero.title}
              </Link>
            </div>
          )}
        </div>
      </section>


      {/* Featured Content */}
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Top Airing */}
        <section>
          <SectionHeader
            title="Đang phát sóng"
            icon="🔥"
            viewAllHref="/anime/top?filter=airing"
          />
          <GridLayout cols={{ sm: 6, md: 6, lg: 6 }}>
            {airing.slice(0, 12).map((anime: Anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </GridLayout>
        </section>

        {/* Top Popular */}
        <section>
          <SectionHeader
            title="Phổ biến nhất"
            icon="⭐"
            viewAllHref="/anime/top?filter=bypopularity"
          />
          <GridLayout cols={{ sm: 1, md: 4, lg: 6 }}>
            {popular.slice(0, 12).map((anime: Anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </GridLayout>
        </section>
      </div>

      {/* Quick Navigation */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Khám phá theo danh mục"
            className="text-center"
          />
          <GridLayout cols={{ sm: 6, md: 6 }}>
            <Link href="/anime" className="group">
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all group-hover:scale-105">
                <div className="text-4xl mb-4">🎌</div>
                <h3 className="text-xl font-semibold mb-2">Anime</h3>
                <p className="text-gray-600">
                  Khám phá hàng ngàn bộ anime từ mọi thể loại
                </p>
              </div>
            </Link>

            <Link href="/manga" className="group">
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all group-hover:scale-105">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">Manga</h3>
                <p className="text-gray-600">
                  Đọc và tìm hiểu về manga yêu thích
                </p>
              </div>
            </Link>

            <Link href="/characters" className="group">
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all group-hover:scale-105">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-semibold mb-2">Nhân vật</h3>
                <p className="text-gray-600">
                  Tìm hiểu về các nhân vật anime/manga
                </p>
              </div>
            </Link>
          </GridLayout>
        </div>
      </section>
    </div>
  );
}
