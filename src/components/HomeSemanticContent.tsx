"use client";

import { useLanguage } from "@/components/LanguageProvider";
import FaqAccordion from "@/components/FaqAccordion";

interface Props {
  fontCount: number;
}

const content = {
  title: {
    zh: "免费中文字体下载 — 高质量汉字字体预览与下载",
    "zh-Hant": "免費中文字型下載 — 高品質漢字字型預覽與下載",
    en: "Free Chinese Font Download — High Quality Chinese Fonts & Hanzi",
  },
  description: {
    zh: `浏览 ${"{count}"}+ 款免费中文字体下载。我们的字库涵盖繁体中文、简体中文、中文手写体、毛笔书法字体、现代无衬线黑体、创意艺术显示字体。每款中文字体均支持在线预览，您可先测试汉字效果再下载 TTF 文件。`,
    "zh-Hant": `瀏覽 ${"{count}"}+ 款免費中文字型下載。我們的字庫涵蓋繁體中文、簡體中文、中文手寫體、毛筆書法字型、現代無襯線黑體、創意藝術顯示字型。每款中文字型均支援線上預覽，您可先測試漢字效果再下載 TTF 檔案。`,
    en: `Browse ${"{count}"}+ free Chinese fonts for download. Our collection includes traditional Chinese fonts, simplified Chinese fonts, Chinese handwriting fonts, Chinese calligraphy fonts, modern sans-serif, and artistic display fonts. Each Chinese font comes with an online preview so you can test Hanzi characters before downloading the TTF file.`,
  },
  categoriesTitle: {
    zh: "热门中文字体分类",
    "zh-Hant": "熱門中文字型分類",
    en: "Popular Chinese font categories",
  },
  footerText: {
    zh: `精选${"{count}"}+款高质量免费中文字体，涵盖简体中文、繁体中文、手写体、毛笔书法、现代黑体、宋体、萌趣字体、创意艺术字等多种风格。每款汉字字体支持在线预览，所见即所得，免费下载 TTF 字库文件。适合平面设计、品牌设计、社交媒体等多种场景。`,
    "zh-Hant": `精選${"{count}"}+款高品質免費中文字型，涵蓋簡體中文、繁體中文、手寫體、毛筆書法、現代黑體、宋體、萌趣字型、創意藝術字等多種風格。每款漢字字型支援線上預覽，所見即所得，免費下載 TTF 字庫檔案。適合平面設計、品牌設計、社群媒體等多種場景。`,
    en: `Curated collection of ${"{count}"}+ high-quality free Chinese fonts covering simplified Chinese, traditional Chinese, handwriting, calligraphy, modern sans-serif, serif/Song, cute display, and creative artistic styles. Each Hanzi font supports online preview — what you see is what you get. Free TTF download. Perfect for graphic design, branding, social media, and more.`,
  },
};

const categoryTags = [
  { zh: "中文手写字体", "zh-Hant": "中文手寫字型", en: "Chinese handwriting fonts" },
  { zh: "毛笔书法字体", "zh-Hant": "毛筆書法字型", en: "Chinese calligraphy fonts" },
  { zh: "现代中文字体", "zh-Hant": "現代中文字型", en: "Modern Chinese fonts" },
  { zh: "繁体中文", "zh-Hant": "繁體中文", en: "Traditional Chinese fonts" },
  { zh: "简体中文", "zh-Hant": "簡體中文", en: "Simplified Chinese fonts" },
  { zh: "粗体标题字", "zh-Hant": "粗體標題字", en: "Bold Chinese title fonts" },
  { zh: "可爱萌趣体", "zh-Hant": "可愛萌趣體", en: "Cute Chinese fonts" },
  { zh: "毛笔刷字体", "zh-Hant": "毛筆刷字型", en: "Chinese brush fonts" },
  { zh: "创意展示体", "zh-Hant": "創意展示體", en: "Creative display Chinese fonts" },
  { zh: "宋体/衬线体", "zh-Hant": "宋體/襯線體", en: "Chinese serif & Song fonts" },
];

const faqData = [
  {
    zh: { q: "如何下载中文字体？", a: "浏览我们的字库，点击任何您喜欢的中文字体，在线预览并输入自定义文字测试效果，然后点击「下载 TTF」获取高质量字体文件。所有字体均为 TTF 格式，兼容 Windows、macOS 和 Linux。" },
    "zh-Hant": { q: "如何下載中文字型？", a: "瀏覽我們的字庫，點擊任何您喜歡的中文字型，線上預覽並輸入自訂文字測試效果，然後點擊「下載 TTF」獲取高品質字型檔案。所有字型均為 TTF 格式，相容 Windows、macOS 和 Linux。" },
    en: { q: "How to download Chinese fonts?", a: "Browse our collection, click any Chinese font you like, preview it online with custom text, then click \"Download TTF\" to get the high quality font file. All fonts are in TTF format, compatible with Windows, macOS, and Linux." },
  },
  {
    zh: { q: "如何安装中文字体？", a: "下载 TTF 文件后，双击打开并点击「安装字体」。macOS 用户可使用「字体册」安装，Windows 用户右键字体文件选择「安装」。安装后即可在 Photoshop、Canva、Word 等所有应用中使用。" },
    "zh-Hant": { q: "如何安裝中文字型？", a: "下載 TTF 檔案後，雙擊開啟並點擊「安裝字型」。macOS 使用者可使用「字體簿」安裝，Windows 使用者右鍵字型檔案選擇「安裝」。安裝後即可在 Photoshop、Canva、Word 等所有應用中使用。" },
    en: { q: "How to install Chinese fonts?", a: "After downloading the TTF file, double-click it and select \"Install Font.\" On macOS, use Font Book. On Windows, right-click the font file and choose \"Install.\" The font will appear in all your applications including Photoshop, Canva, and Word." },
  },
  {
    zh: { q: "最适合设计的中文字体推荐", a: "平面设计推荐使用现代无衬线黑体（简洁大方），传统美学推荐毛笔书法字体，个性化表达推荐中文手写体。浏览我们的分类标签，找到最适合您项目的字体风格。" },
    "zh-Hant": { q: "最適合設計的中文字型推薦", a: "平面設計推薦使用現代無襯線黑體（簡潔大方），傳統美學推薦毛筆書法字型，個性化表達推薦中文手寫體。瀏覽我們的分類標籤，找到最適合您專案的字型風格。" },
    en: { q: "Best Chinese fonts for design", a: "For graphic design, we recommend modern sans-serif Chinese fonts for clean layouts, Chinese calligraphy fonts for traditional aesthetics, and Chinese handwriting fonts for a personal touch. Browse our categories to find the perfect style for your project." },
  },
  {
    zh: { q: "这些中文字体可以商用吗？", a: "我们的精选字库包含大量可免费用于个人和商业项目的中文字体。每款字体的详情页均标注了厂商信息，建议在商用前查看原始字库厂商的授权条款。" },
    "zh-Hant": { q: "這些中文字型可以商用嗎？", a: "我們的精選字庫包含大量可免費用於個人和商業專案的中文字型。每款字型的詳情頁均標註了廠商資訊，建議在商用前檢視原始字庫廠商的授權條款。" },
    en: { q: "Are these Chinese fonts free for commercial use?", a: "Our curated collection includes many free Chinese fonts suitable for both personal and commercial projects. Each font's detail page shows the vendor information. We recommend checking the original foundry's license for commercial use." },
  },
];

export default function HomeSemanticContent({ fontCount }: Props) {
  const { lang } = useLanguage();
  const cnt = String(fontCount);

  const faqItems = faqData.map((f) => ({
    question: f[lang].q,
    answer: f[lang].a,
  }));

  return (
    <section className="mx-auto max-w-[1440px] px-4 sm:px-6 py-16 border-t border-zinc-200 mt-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-zinc-800 mb-6 text-center">
          {content.title[lang]}
        </h2>
        <p className="text-zinc-500 leading-relaxed mb-8 text-center">
          {content.description[lang].replace("{count}", cnt)}
        </p>

        <div className="mb-8">
          <FaqAccordion items={faqItems} />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-zinc-800">
            {content.categoriesTitle[lang]}
          </h3>
          <div className="flex flex-wrap gap-2 text-sm text-zinc-500">
            {categoryTags.map((tag) => (
              <span
                key={tag.en}
                className="rounded-full bg-zinc-100 px-3 py-1"
              >
                {tag[lang]}
              </span>
            ))}
          </div>
        </div>

        <p className="text-zinc-400 text-sm leading-relaxed mt-8 text-center">
          {content.footerText[lang].replace("{count}", cnt)}
        </p>
      </div>
    </section>
  );
}
