import { preloadModule } from "react-dom";

const bridgeScript = "https://core.sanity-cdn.com/bridge.js";

/**
 * Embedded Studio needs Sanity's Dashboard bridge so manage.sanity.io
 * can load /studio inside an iframe.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  preloadModule(bridgeScript, { as: "script" });

  return (
    <>
      <script src={bridgeScript} async type="module" />
      {children}
    </>
  );
}
