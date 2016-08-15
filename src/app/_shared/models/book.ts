import {Link} from './link';
export interface Book {
  id: string;
  picture: string;
  title: string;
  description: string;
  storeUrls: Link[];
  authors: string[];
  isbn?: string;
}
