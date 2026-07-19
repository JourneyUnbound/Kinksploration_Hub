export const metadata = {
  title: 'Journey Unbound™ — Kinksploration Hub',
  description: 'Integrated exploration system for informed consent, boundaries, planning, aftercare, and reflection.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Trebuchet MS, system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
