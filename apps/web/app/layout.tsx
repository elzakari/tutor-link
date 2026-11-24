import type { ReactNode } from "react";

export const metadata = {
  title: "Tutor Link",
  description:
    "Find verified tutors, book lessons, and buy lesson materials — one account.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
