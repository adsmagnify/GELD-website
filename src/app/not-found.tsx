import { redirect } from "next/navigation";

/**
 * Used when a page calls notFound() (e.g. missing blog slug).
 * Send users home instead of showing a 404 UI.
 */
export default function NotFound() {
  redirect("/");
}
