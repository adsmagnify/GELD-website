import type { SanityImageSource } from "@sanity/image-url";

import { urlFor } from "./image";

export function getBlogImageUrl(
  source: SanityImageSource,
  width = 800,
  height?: number
) {
  const builder = urlFor(source).width(width).auto("format").quality(100);

  if (height) {
    builder.height(height);
  }

  return builder.url();
}
