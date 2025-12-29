'use client'

import { Book, BorrowedBook } from "@/types/dashboard"
import BookCard from "../(protected)/dashboard/components/book-card"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/enums/auth.enum";
import EmptyData from "@/components/empty-data";

export default function Dashboard({ books }: { books: Book[] }) {
    const [booksState, setBooksState] = useState<BorrowedBook[]>([]);

    const { user, borrowedBooks, updateBorrowedBooks } = useAuth();

    useEffect(() => {
        const storeDataBooks = localStorage.getItem("books");
        if (storeDataBooks && storeDataBooks.length) {
            setBooksState(storeDataBooks ? JSON.parse(storeDataBooks) : []);
        } else {
            const booksWithBorrowedInfo: BorrowedBook[] = books.map(book => {
                const borrowedBook = borrowedBooks.find(borrowedBook => borrowedBook.title === book.title);
                return {
                    ...book,
                    isBorrowed: borrowedBook ? borrowedBook?.isBorrowed : false,
                    borrowedDate: borrowedBook?.isBorrowed ? borrowedBook?.borrowedDate || "" : ""
                };
            })
            setBooksState(booksWithBorrowedInfo);
            localStorage.setItem("books", JSON.stringify(booksWithBorrowedInfo));
        }
    }, [books, borrowedBooks]);

    const handleBorrow = (bookDetails: BorrowedBook) => {
        const book = booksState.find(b => b.title === bookDetails.title);

        const updatedBook = book ? {
            ...book,
            inStock: book.inStock > 0 ? book.inStock - 1 : 0,
            isBorrowed: true,
        } : null;

        const borrowedBook: BorrowedBook = {
            ...bookDetails,
            isBorrowed: true,
            borrowedDate: new Date().toISOString(),
        };

        const updatedBorrowedBooks = [...borrowedBooks, borrowedBook];

        const updatedBooks = updatedBook ? booksState.map(b => b.title === updatedBook.title ? updatedBook : b) : booksState;

        setBooksState(updatedBooks);
        updateBorrowedBooks(updatedBorrowedBooks);

        localStorage.setItem("books", JSON.stringify(updatedBooks));
        localStorage.setItem("borrowedBooks", JSON.stringify(updatedBorrowedBooks));
    };


    return (
        <div className="p-1 sm:p-5 h-full w-full box-border">

            {
                booksState.length &&
                <div
                    className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(320px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(400px,1fr))]"
                >
                    {booksState?.map((book, index) => (
                        <BookCard key={index} book={book} onBorrow={handleBorrow} />
                    ))}
                </div>
                ||
                <EmptyData message={user?.role === UserRole.ADMIN ? "No books available. Please add books to the library." : "No books available at the moment. Please check back later."} />
            }
        </div>
    )
}