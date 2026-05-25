import type { Metadata } from"next";
import fontsData from"@/data/fonts.json";
import type { FontsJson } from"@/types/font";
import HomeClient from"@/components/HomeClient";

export const metadata: Metadata = {
  alternates: {
    canonical:"/",
  },
};

export default function HomePage() {
  const data = fontsData as FontsJson;

  return <HomeClient fonts={data.fonts} categories={data.categories} />;
}
