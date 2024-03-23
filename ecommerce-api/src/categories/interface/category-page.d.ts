import { CategoryResponse } from '../interface/categories';

export interface CategoryPage {
  data: CategoryResponse[];
  page: number;
  total_page: number;
}
