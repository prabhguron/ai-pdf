import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import FetchProfile from "@/components/common/FetchProfile";
import SegmentScript from "./SegmentScript";
import { metaDescription, metaTitle } from "@/utils/meta";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <SegmentScript />
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>
          <FetchProfile />
          {children}
        </Providers>
      </body>
    </html>
  );
}
