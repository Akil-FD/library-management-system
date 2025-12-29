'use client'

import { Book } from "@/types/dashboard"
import BookCard from "../(protected)/dashboard/components/book-card"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/enums/auth.enum";
import EmptyData from "@/components/empty-data";

export default function Dashboard({ books }: { books: Book[] }) {
    const [stateBooks, setStateBooks] = useState<Book[]>([]);

    const { user } = useAuth();

    useEffect(() => {
        const storeDataBooks = localStorage.getItem("books");
        if (storeDataBooks && storeDataBooks.length) {
            setStateBooks(storeDataBooks ? JSON.parse(storeDataBooks) : []);
        } else {
            setStateBooks(books);
            localStorage.setItem("books", JSON.stringify(books));
        }
    }, [books]);

    return (
        <div className="p-1 sm:p-5 h-full w-full box-border">

            {
                stateBooks.length &&
                <div
                    className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(320px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(400px,1fr))]"
                >

                    {stateBooks?.map((book, index) => (
                        <BookCard key={index} book={book} />
                    ))}
                </div>
                ||
               <EmptyData message={user?.role === UserRole.ADMIN ? "No books available. Please add books to the library." : "No books available at the moment. Please check back later."} />

            }
        </div>
    )
}