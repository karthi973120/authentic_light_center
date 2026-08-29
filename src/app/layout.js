import "./globals.css";

export const metadata = {
  title: "Spiritual Healing and Awakening | Authentic Light Center",
  description: "Authentic Light Center offers spiritual healing, daily guided meditation, chakra balancing, Kundalini activation, and retreats under the guidance of Mahavatar Babaji and Mataji.",
  keywords: ["meditation", "spiritual healing", "chakra balancing", "Kundalini activation", "Mahavatar Babaji", "Sunita Devi"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
