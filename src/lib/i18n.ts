export type Lang = "zh" | "en";

export const dict = {
  siteTitle: { zh: "中文字体库", en: "Chinese Fonts" },
  siteDesc: { zh: "精选中文字体，免费预览与下载", en: "Curated Chinese fonts, preview & download" },
  categories: { zh: "字体分类", en: "Categories" },
  allFonts: { zh: "全部字体", en: "All Fonts" },
  searchPlaceholder: { zh: "搜索字体名称...", en: "Search font name..." },
  preview: { zh: "预览", en: "Preview" },
  download: { zh: "下载字体", en: "Download" },
  downloadTtf: { zh: "下载 TTF", en: "Download TTF" },
  fontDetail: { zh: "字体详情", en: "Font Details" },
  category: { zh: "分类", en: "Category" },
  vendor: { zh: "字体厂商", en: "Foundry" },
  fileName: { zh: "文件名", en: "File Name" },
  backToHome: { zh: "返回首页", en: "Back to Home" },
  noCover: { zh: "暂无封面", en: "No Cover" },
  typeToPreview: { zh: "输入文字以预览效果...", en: "Enter text to preview..." },
  loading: { zh: "加载中...", en: "Loading..." },
  foundry: { zh: "厂商", en: "Foundry" },
  totalFonts: { zh: "款字体", en: " fonts" },
  noTtf: { zh: "暂未开放", en: "Unavailable" },
  noCoverTag: { zh: "无封面", en: "No Cover" },
  perfect: { zh: "完整", en: "Complete" },
  previewNotAvailable: { zh: "该字体暂不可用，敬请期待", en: "This font is not yet available. Coming soon!" },
  fontFile: { zh: "字体文件", en: "Font File" },
  status: { zh: "状态", en: "Status" },
};

export function t(key: keyof typeof dict, lang: Lang): string {
  return dict[key][lang];
}

export const vendors: Record<string, { zh: string; en: string }> = {
  Yixin: { zh: "壹心字库", en: "Yixin" },
  Zihun: { zh: "字魂网", en: "Zihun" },
  Ziling: { zh: "字灵", en: "Ziling" },
  Ziqu: { zh: "字趣", en: "Ziqu" },
  Erya: { zh: "尔雅字库", en: "Erya" },
  Zixiaohun: { zh: "字小魂", en: "Zixiaohun" },
  Zhanku: { zh: "站酷", en: "Zhanku" },
  Canger: { zh: "仓耳字库", en: "Canger" },
  Hanbiao: { zh: "汉标字库", en: "Hanbiao" },
  Zizhiqu: { zh: "字制区", en: "Zizhiqu" },
  Resource: { zh: "资源字体", en: "Resource" },
  YangRendong: { zh: "杨任东", en: "Yang Rendong" },
  iFonts: { zh: "iFonts", en: "iFonts" },
  iSlide: { zh: "iSlide", en: "iSlide" },
  ShiWei: { zh: "狮尾", en: "ShiWei" },
  WDXL: { zh: "WDXL", en: "WDXL" },
  JingNan: { zh: "经南", en: "JingNan" },
  SiYuan: { zh: "思源", en: "SiYuan" },
  Other: { zh: "其他", en: "Other" },
};
