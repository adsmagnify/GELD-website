import { redirect } from "next/navigation";

/**
 * Catch any unmatched path (e.g. /foo, /random/page) and send users home
 * instead of showing a 404 page.
 */
export default function CatchAllRedirect() {
  redirect("/");
}
