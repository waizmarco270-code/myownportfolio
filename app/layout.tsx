import './globals.css';
import { Inter, Space_Grotesk } from 'next/font/google';
import { ThemeProvider } from '@/lib/theme-context';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata = {
  title: 'Waiz Monazzum | Legendary Portfolio',
  description: 'Full Stack Developer & AI Innovator',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-neutral-950 text-neutral-50 antialiased overflow-x-hidden">
        <ThemeProvider>
          <div className="relative min-h-screen">
            {children}
            <ThemeSwitcher />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
