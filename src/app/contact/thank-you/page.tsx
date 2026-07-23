import type { Metadata } from "next";
import { Suspense } from "react";

import ThankYouClient from "./ThankYouClient";

export const metadata: Metadata = {
  title: "Thank you",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ContactThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouClient />
    </Suspense>
  );
}
