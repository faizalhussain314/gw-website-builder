export interface CategoryList {
  id: number;
  name: string;
}
export interface Category {
  name: string;
}

export interface AutocompleteProps {
  categoryList: Category[];
}
