export const metadata = {
  title: 'Customer Portal',
  description: 'POC Customer Portal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
