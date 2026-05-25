import type { Metadata } from"next";
import fontsData from"@/data/fonts.json";
import type { FontsJson } from"@/types/font";
import FontSuccessClient from"@/components/FontSuccessClient";

const data = fontsData as FontsJson;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const font = data.fonts.find((f) => f.id === decodedId);

  return {
    title: font
      ? `购买成功 - ${font.name}`
      :"支付结果",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function FontSuccessPage() {
  return <FontSuccessClient />;
}
