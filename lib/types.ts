export interface Job {
  id: number;
  title_ua: string;
  title_en: string;
  company: string;
  location: string;
  salary: string;
  category: string;
  experience: string;
  type: string;
  posted: string;
  postedText: string;
  description_ua: string;
  description_en: string;
  requirements: string[];
  benefits: string[];
}

export type Theme = "dark" | "light" | "reborn";
export type Language = "ua" | "en";
export type ViewMode = "grid" | "list";