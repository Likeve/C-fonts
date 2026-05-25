export type Lang = "zh" | "zh-Hant" | "en";

export const dict = {
  siteTitle: { zh: "中文字体库", "zh-Hant": "中文字體庫", en: "Chinese Fonts" },
  siteDesc: { zh: "精选中文字体，免费预览与下载", "zh-Hant": "精選中文字體，免費預覽與下載", en: "Curated Chinese fonts, preview & download" },
  categories: { zh: "字体分类", "zh-Hant": "字體分類", en: "Categories" },
  allFonts: { zh: "全部字体", "zh-Hant": "全部字體", en: "All Fonts" },
  searchPlaceholder: { zh: "搜索字体名称...", "zh-Hant": "搜尋字體名稱...", en: "Search font name..." },
  preview: { zh: "预览", "zh-Hant": "預覽", en: "Preview" },
  download: { zh: "下载字体", "zh-Hant": "下載字體", en: "Download" },
  downloadTtf: { zh: "下载 TTF", "zh-Hant": "下載 TTF", en: "Download TTF" },
  fontDetail: { zh: "字体详情", "zh-Hant": "字體詳情", en: "Font Details" },
  category: { zh: "分类", "zh-Hant": "分類", en: "Category" },
  vendor: { zh: "字体厂商", "zh-Hant": "字體廠商", en: "Foundry" },
  fileName: { zh: "文件名", "zh-Hant": "檔案名", en: "File Name" },
  backToHome: { zh: "返回首页", "zh-Hant": "返回首頁", en: "Back to Home" },
  noCover: { zh: "暂无封面", "zh-Hant": "暫無封面", en: "No Cover" },
  typeToPreview: { zh: "输入文字以预览效果...", "zh-Hant": "輸入文字以預覽效果...", en: "Enter text to preview..." },
  loading: { zh: "加载中...", "zh-Hant": "載入中...", en: "Loading..." },
  foundry: { zh: "厂商", "zh-Hant": "廠商", en: "Foundry" },
  totalFonts: { zh: "款字体", "zh-Hant": "款字體", en: " fonts" },
  noTtf: { zh: "暂未开放", "zh-Hant": "暫未開放", en: "Unavailable" },
  noCoverTag: { zh: "无封面", "zh-Hant": "無封面", en: "No Cover" },
  perfect: { zh: "完整", "zh-Hant": "完整", en: "Complete" },
  previewNotAvailable: { zh: "该字体暂不可用，敬请期待", "zh-Hant": "該字體暫不可用，敬請期待", en: "This font is not yet available. Coming soon!" },
  fontFile: { zh: "字体文件", "zh-Hant": "字體檔案", en: "Font File" },
  status: { zh: "状态", "zh-Hant": "狀態", en: "Status" },
  footerCopyright: { zh: "中文字体库", "zh-Hant": "中文字體庫", en: "Chinese Fonts" },
  language: { zh: "语言", "zh-Hant": "語言", en: "Language" },
};

export function t(key: keyof typeof dict, lang: Lang): string {
  return dict[key][lang];
}

export const vendors: Record<string, { zh: string; "zh-Hant": string; en: string }> = {
  Yixin: { zh: "壹心字库", "zh-Hant": "壹心字庫", en: "Yixin" },
  Zihun: { zh: "字魂网", "zh-Hant": "字魂網", en: "Zihun" },
  Ziling: { zh: "字灵", "zh-Hant": "字靈", en: "Ziling" },
  Ziqu: { zh: "字趣", "zh-Hant": "字趣", en: "Ziqu" },
  Erya: { zh: "尔雅字库", "zh-Hant": "爾雅字庫", en: "Erya" },
  Zixiaohun: { zh: "字小魂", "zh-Hant": "字小魂", en: "Zixiaohun" },
  Zhanku: { zh: "站酷", "zh-Hant": "站酷", en: "Zhanku" },
  Canger: { zh: "仓耳字库", "zh-Hant": "倉耳字庫", en: "Canger" },
  Hanbiao: { zh: "汉标字库", "zh-Hant": "漢標字庫", en: "Hanbiao" },
  Zizhiqu: { zh: "字制区", "zh-Hant": "字製區", en: "Zizhiqu" },
  Resource: { zh: "资源字体", "zh-Hant": "資源字體", en: "Resource" },
  YangRendong: { zh: "杨任东", "zh-Hant": "楊任東", en: "Yang Rendong" },
  iFonts: { zh: "iFonts", "zh-Hant": "iFonts", en: "iFonts" },
  iSlide: { zh: "iSlide", "zh-Hant": "iSlide", en: "iSlide" },
  ShiWei: { zh: "狮尾", "zh-Hant": "獅尾", en: "ShiWei" },
  WDXL: { zh: "WDXL", "zh-Hant": "WDXL", en: "WDXL" },
  JingNan: { zh: "经南", "zh-Hant": "經南", en: "JingNan" },
  SiYuan: { zh: "思源", "zh-Hant": "思源", en: "SiYuan" },
  Other: { zh: "其他", "zh-Hant": "其他", en: "Other" },
};
