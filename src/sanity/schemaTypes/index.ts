import { type SchemaTypeDefinition } from "sanity";

import { blog } from "./blog";
import { blockContent } from "./blockContent";
import { webinar } from "./webinar";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blog, blockContent, webinar],
};
