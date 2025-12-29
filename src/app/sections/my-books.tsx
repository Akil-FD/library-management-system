'use client'

import { Book, BorrowedBook } from "@/types/dashboard"
import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth";
import EmptyData from "@/components/empty-data";
import { LOCAL_STORAGE_KEYS } from "@/constants/app";
import { BorrowedBookCard } from "../(protected)/dashboard/components/borrow-book-card";

export default function MyBooks() {
    const [booksState, setBooksState] = useState<BorrowedBook[]>([]);

    const {borrowedBooks, updateBorrowedBooks } = useAuth();

    useEffect(() => {
        const storeDataBorrowedBooks = localStorage.getItem(LOCAL_STORAGE_KEYS.BORROWED_BOOKS);
        if (storeDataBorrowedBooks && storeDataBorrowedBooks.length) {
            setBooksState(storeDataBorrowedBooks ? JSON.parse(storeDataBorrowedBooks) : []);
        } else {
            setBooksState(borrowedBooks);
            localStorage.setItem(LOCAL_STORAGE_KEYS.BORROWED_BOOKS, JSON.stringify(borrowedBooks));
        }
    }, []);


    const handleReturnBooks = useCallback((bookDetails: BorrowedBook) => {
        const storedBooks = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKS);
        const parsedStoredBooks: Book[] = storedBooks ? JSON.parse(storedBooks) : [];
        const updatedBookInStore = parsedStoredBooks.find(b => b.title === bookDetails.title);
        const updatedBook = updatedBookInStore ? {
            ...updatedBookInStore,
            inStock: updatedBookInStore.inStock + 1,
            isBorrowed: false,
            borrowedDate: "",
        } : null;

        const updatedBorrowedBooks = borrowedBooks.filter(b => b.title !== bookDetails.title);

        const updatedBooks = updatedBook ? parsedStoredBooks.map(b => b.title === updatedBook.title ? updatedBook : b) : booksState;

        setBooksState(updatedBorrowedBooks);
        updateBorrowedBooks(updatedBorrowedBooks);

        localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKS, JSON.stringify(updatedBooks));
        localStorage.setItem(LOCAL_STORAGE_KEYS.BORROWED_BOOKS, JSON.stringify(updatedBorrowedBooks));
    }, [booksState, borrowedBooks, updateBorrowedBooks]);


    return (
        <div className="p-1 sm:p-5 h-full w-full box-border">

            {
                booksState.length &&
                <div
                    className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(320px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(400px,1fr))]"
                >
                    {booksState?.map((book, index) => (
                        <BorrowedBookCard key={index} book={book} onReturn={handleReturnBooks} />
                    ))}
                </div>
                ||
                <EmptyData message={ "You haven't borrowed any books yet."} />
            }
        </div>
    )
}