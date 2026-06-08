export interface FontData {
  id: string;
  name: string;
  englishName: string;
  category: string;
  categoryZh: string;
  categoryEn: string;
  vendor: string;
  fontPath: string;
  coverPath: string | null;
  tag: null | "no_cover";
  originalId?: string;
}

export interface CategoryData {
  slug: string;
  zh: string;
  en: string;
  count: number;
}

export interface FontsJson {
  fonts: FontData[];
  categories: CategoryData[];
  totalFonts: number;
  totalWithCover: number;
}
