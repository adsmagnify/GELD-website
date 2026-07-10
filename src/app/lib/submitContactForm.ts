export const CONTACT_EMAIL = "Support@geldwealth.com";

export interface ContactFormPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
  source?: string;
  intent?: string;
}

export async function submitContactForm(
  payload: ContactFormPayload
): Promise<{ intent: string }> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as
    | { error?: string; intent?: string }
    | null;

  if (!response.ok) {
    throw new Error(data?.error ?? "Failed to send message. Please try again.");
  }

  return { intent: data?.intent || payload.intent || "general" };
}
