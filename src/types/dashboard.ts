export type Book = {
    title: string;
    author: string;
    cover: string;
    inStock: number;
    year: string | number;
}

export type BorrowedBook = Book & {
    isBorrowed: boolean;
    borrowedDate: string;
}