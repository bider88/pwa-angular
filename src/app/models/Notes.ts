import { Category } from './Category';

export interface Notes {
  title: string;
  note: string;
  category?: Category;
  createdAt?: Date;
  id?: string;
}
