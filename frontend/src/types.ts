export interface BookInfo {
  isbn: string;
  bookName: string;
  author?: string;
  publisher?: string;
}

export interface Book {
  bookID: string;
  bookCond: string;
  price: number;
  bookStatus: string;
  categoryName?: string;
  sellerID: string;
  bookInfo: BookInfo;
}

export interface BookFormData {
  isbn: string;
  bookName: string;
  author: string;
  publisher: string;
  bookCond: string;
  price: number | '';
  categoryName: string;
  location: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface Shop {
  id: string;
  shopName: string;
  userId: string;
}