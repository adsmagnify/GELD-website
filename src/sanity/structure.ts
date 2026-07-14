import type { StructureResolver } from "sanity/structure";

const SINGLETONS = new Set(["webinar"]);

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Webinar")
        .id("webinar")
        .child(
          S.document()
            .schemaType("webinar")
            .documentId("webinar")
            .title("Webinar")
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETONS.has(item.getId() ?? "")
      ),
    ]);
