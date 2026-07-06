export const CONTACT_EMAIL = "Support@geldwealth.com";

export interface ContactFormPayload {
  name: string;
  email: string;
  message: string;
  source?: string;
}

export async function submitContactForm(payload: ContactFormPayload): Promise<void> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? "Failed to send message. Please try again.");
  }
}
