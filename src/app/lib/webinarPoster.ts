import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { WEBINAR_QUERY } from "@/sanity/lib/queries";

const FALLBACK_POSTER = {
  src: "/webinar_poster.jpg",
  alt: "GELD webinar poster: Ask The Expert, Trade Smarter with Chandan Taparia",
} as const;

export type WebinarPoster = {
  src: string;
  alt: string;
};

type WebinarDoc = {
  poster?: {
    asset?: { _id?: string; _ref?: string };
    alt?: string;
  };
} | null;

export async function getWebinarPoster(): Promise<WebinarPoster> {
  try {
    const data = await client.fetch<WebinarDoc>(
      WEBINAR_QUERY,
      {},
      { next: { revalidate: 60 } }
    );

    if (data?.poster?.asset) {
      return {
        src: urlFor(data.poster).width(1280).auto("format").quality(90).url(),
        alt: data.poster.alt?.trim() || FALLBACK_POSTER.alt,
      };
    }
  } catch {
    // Fall back to the local poster if Sanity is unavailable.
  }

  return { ...FALLBACK_POSTER };
}
