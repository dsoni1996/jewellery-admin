import "../styles/globals.css";

export const metadata = {
  title: "MANAS Admin — Jewellery Management",
  description: "Admin panel for MANAS Jewellery",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
