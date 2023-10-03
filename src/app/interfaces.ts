export interface Category {
  id: number;
  name: string;
}

export interface Format {
  res: string;
  size: number;
  key?: string;
}

export interface Formats {
  [key: string]: Format
}

export interface Video {
  id: number;
  catIds: number[];
  name: string;
  formats: Formats;
  releaseDate: string;
}

export interface Author {
  id: number;
  name: string;
  videos: Video[];
}

export interface ProcessedVideo {
  id: number;
  name: string;
  author: string;
  format: string;
  releaseDate: string
  categories: string[];
}

export interface CategoriesMap {
  [key: string]: string
}

export interface VideoFormData {
  videoTitle: string,
  selectedAuthor: string [],
  selectedCategories: number[]
}