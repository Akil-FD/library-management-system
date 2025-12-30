export type Book = {
    title: string;
    author: string;
    cover: string;
    inStock: number;
    year: string | number;
    isBorrowed: boolean;
}

export type BorrowedBook = Book & {
    borrowed: {
        onDate: string;
        returnedDate: string;
        name?: string;
    }
}