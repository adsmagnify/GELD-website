import { Suspense } from "react";

import ThankYouClient from "./ThankYouClient";

export default function ContactThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouClient />
    </Suspense>
  );
}
