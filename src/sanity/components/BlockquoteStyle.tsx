import type { BlockStyleProps } from "sanity";

/**
 * Custom blockquote style for the Portable Text editor.
 * Replaces Sanity's default BlockQuote renderer, which incorrectly nests
 * a <div> inside <p> and triggers React hydration warnings.
 */
export function BlockquoteStyle(props: BlockStyleProps) {
  return (
    <blockquote
      data-testid="text-style--blockquote"
      style={{
        margin: 0,
        paddingLeft: 12,
        borderLeft: "3px solid rgba(127, 127, 127, 0.45)",
        fontStyle: "italic",
      }}
    >
      {props.children}
    </blockquote>
  );
}
