import { Category } from './Category';

export interface Notes {
  title: string;
  note: string;
  category?: Category;
  createdAt?: any;
  id?: string;
  user?: string;
}
