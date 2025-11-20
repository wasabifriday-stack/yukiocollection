// Defines the structure of a single YUKIO item
export interface YukioItem {
  id: string;
  name: string;
  // Optional description or category can be added later
  category?: string; 
  imageUrl?: string;
}