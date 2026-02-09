'use client'

import { Book, BorrowedBook } from "@/types/dashboard"
import BookCard from "../(protected)/dashboard/components/book-card"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/enums/auth.enum";
import EmptyData from "@/components/empty-data";
import { LOCAL_STORAGE_KEYS } from "@/constants/app";
import { AddBookDialog } from "../(protected)/dashboard/components/add-book-dialog";

export default function Books({ data }: { data: Book[] }) {
    const [booksState, setBooksState] = useState<Book[]>([]);

    const { user, borrowedBooks, updateBorrowedBooks } = useAuth();

    useEffect(() => {
        const storeDataBooks = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKS);
         const parsedStoreDataBooks = storeDataBooks? JSON.parse(storeDataBooks): '';
        const storedBorrowedBooks = localStorage.getItem(LOCAL_STORAGE_KEYS.BORROWED_BOOKS + `_${user?.name}`)
        if (parsedStoreDataBooks || storedBorrowedBooks) {
            const parsedBooks = parsedStoreDataBooks && parsedStoreDataBooks.length > 0 ? parsedStoreDataBooks.map((book: Book) => {
                const borrowedBook = storedBorrowedBooks ?
                    JSON.parse(storedBorrowedBooks).find((borrowedBook: BorrowedBook) => borrowedBook.title === book.title) : null;
                return {
                    ...book,
                    isBorrowed: borrowedBook ? borrowedBook?.isBorrowed : false,
                };
            }) : data;

            setBooksState(parsedBooks);
            updateBorrowedBooks(storedBorrowedBooks ? JSON.parse(storedBorrowedBooks) : [])
            localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKS, JSON.stringify(parsedBooks));

        } else {
            const booksWithBorrowedInfo: Book[] = data.map(book => {
                const borrowedBook = storedBorrowedBooks ?
                    JSON.parse(storedBorrowedBooks).find((borrowedBook: BorrowedBook) => borrowedBook.title === book.title) : null;
                return {
                    ...book,
                    isBorrowed: borrowedBook ? borrowedBook?.isBorrowed : false,
                };
            });

            const parsedStoredBorrowBooks = storedBorrowedBooks ?
                JSON.parse(storedBorrowedBooks) : [];
            setBooksState(booksWithBorrowedInfo);
            updateBorrowedBooks(parsedStoredBorrowBooks);
            localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKS, JSON.stringify(booksWithBorrowedInfo));
            localStorage.setItem(LOCAL_STORAGE_KEYS.BORROWED_BOOKS + `_${user?.name}`, JSON.stringify(parsedStoredBorrowBooks));
        }
    }, [data]);

    const handleBorrow = (bookDetails: BorrowedBook | Book) => {
        const storedUsersHistory = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS_BOOKS_LOG);
        const parsedUsersHistory: BorrowedBook[] = storedUsersHistory ? JSON.parse(storedUsersHistory) : [];

        const book = booksState.find(b => b.title === bookDetails.title);

        const updatedBook = book ? {
            ...book,
            inStock: book.inStock > 0 ? book.inStock - 1 : 0,
            isBorrowed: true,
        } : null;

        if (!updatedBook) return;

        const borrowedBook: BorrowedBook = {
            ...updatedBook,
            borrowed: {
                onDate: new Date().toISOString(),
                returnedDate: '',
            }
        };

        const updatedBorrowedBooks = [...borrowedBooks, borrowedBook];
        parsedUsersHistory.push({ ...borrowedBook, borrowed: { ...borrowedBook.borrowed, name: user?.name ?? '' } });
        const updatedBooks = updatedBook ? booksState.map(b => b.title === updatedBook.title ? updatedBook : b) : booksState;

        setBooksState(updatedBooks);
        updateBorrowedBooks(updatedBorrowedBooks);

        localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKS, JSON.stringify(updatedBooks));
        localStorage.setItem(LOCAL_STORAGE_KEYS.BORROWED_BOOKS + `_${user?.name}`, JSON.stringify(updatedBorrowedBooks));
        localStorage.setItem(LOCAL_STORAGE_KEYS.USERS_BOOKS_LOG, JSON.stringify(parsedUsersHistory));
    };

    const updateStock = (bookDetails: BorrowedBook | Book, status: 'increase' | 'decrease') => {
        const updatedBooks = booksState.map((book) => {
            if (book.title === bookDetails.title) {
                return { ...book, inStock: status === 'increase' ? book.inStock + 1 : book.inStock - 1 }
            }
            return book;
        });

        setBooksState(updatedBooks)
        localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKS, JSON.stringify(updatedBooks));

    }

    const addBooks = (book: Book) => {
        setBooksState((prev) => [...prev, book]);
    }

    return (
        <div className="p-1 sm:p-5 h-full w-full box-border">
            <div className="flex items-center justify-end gap-2 mb-6">
                <AddBookDialog onBookAdd={addBooks} />
            </div>
            {
                booksState.length &&
                <div
                    className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(320px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(400px,1fr))]"
                >
                    {booksState?.map((book, index) => (
                        <BookCard key={index} book={book} isAdmin={user?.role === UserRole.ADMIN} onBorrow={handleBorrow} onStockUpdate={updateStock} />
                    ))}
                </div>
                ||
                <EmptyData message={user?.role === UserRole.ADMIN ? "No books available. Please add books to the library." : "No books available at the moment. Please check back later."} />
            }
        </div >
    )
}
