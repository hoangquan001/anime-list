`params.id`;
import { notFound } from "next/navigation";
import { AnimeClient } from "@jikan-ts";
import type { Anime } from "@jikan-ts/models";
import { AnimeDetailLayout } from "./components/AnimeDetailLayout";

interface AnimeLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default async function AnimeLayout({
  children,
  params,
}: AnimeLayoutProps) {
  const animeClient = new AnimeClient({ enableLogging: false });
  const id = Number(params.id);

  if (!Number.isFinite(id) || id <= 0) return notFound();

  try {
    const response = await animeClient.getAnimeFullById(id);
    const anime = response.data as Anime;

    return <AnimeDetailLayout anime={anime}>{children}</AnimeDetailLayout>;
  } catch (error) {
    console.error("Error fetching anime:", error);
    notFound();
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const animeClient = new AnimeClient({ enableLogging: false });
    const response = await animeClient.getAnimeFullById(Number(params.id));
    const anime = response.data as Anime;

    // Get current path to determine tab
    const tabTitles: Record<string, string> = {
      characters: "Nhân vật",
      staff: "Staff",
      episodes: "Tập phim",
      videos: "Video",
      pictures: "Hình ảnh",
      statistics: "Thống kê",
      recommendations: "Gợi ý",
    };

    // Since we can't access pathname in generateMetadata, we'll use a base title
    return {
      title: `${anime.title} - Anime Wiki`,
      description:
        anime.synopsis || `Thông tin chi tiết về anime ${anime.title}`,
      openGraph: {
        title: anime.title,
        description:
          anime.synopsis || `Thông tin chi tiết về anime ${anime.title}`,
        images: [
          anime.images.jpg.large_image_url || anime.images.jpg.image_url,
        ],
      },
    };
  } catch {
    return {
      title: "Anime không tìm thấy - Anime Wiki",
      description: "Anime bạn tìm kiếm không tồn tại.",
    };
  }
}
