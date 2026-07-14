import HomeClient from "./components/HomeClient/HomeClient";
import { getWebinarPoster } from "./lib/webinarPoster";

export const revalidate = 60;

export default async function Home() {
  const webinarPoster = await getWebinarPoster();

  return <HomeClient webinarPoster={webinarPoster} />;
}
