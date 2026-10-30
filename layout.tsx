import React from 'react';
export const metadata = { title: 'IA Répondeur', description: 'Tableau de bord' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head><script src="https://cdn.tailwindcss.com"></script></head>
      <body>{children}</body>
    </html>
  )
}