'use client'

import { useEffect, useState } from "react"
import { Book } from "@/types/dashboard"
import { dashboardApi } from "@/api/dashboard/dashboard.api"
import Books from "@/app/sections/books"

function getGoogleBookCover({
    volumeId,
    thumbnail,
}: {
    volumeId?: string | null
    thumbnail?: string | null
}): string | null {
    if (thumbnail) {
        return thumbnail.replace("http://", "https://")
    }

    if (volumeId) {
        return `https://books.google.com/books/content?id=${volumeId}&printsec=frontcover&img=1&zoom=2`
    }

    return null
}

export default function BooksClient() {
    const [books, setBooks] = useState<Book[]>([]);

    async function fetchBooks() {
        const res = await dashboardApi.getBooks();
        const data = await res.json();

        const mapped: Book[] = data.items
            ?.map((b: any) => {
                const info = b.volumeInfo

                return {
                    title: info.title ?? "No Title",
                    author: info.authors?.[0] ?? "Unknown Author",
                    year: info.publishedDate?.split("-")[0] ?? "—",
                    cover: getGoogleBookCover({
                        volumeId: b.id,
                        thumbnail: info.imageLinks?.thumbnail,
                    }),
                    inStock: Math.floor(Math.random() * 10),
                    isBorrowed: false,
                }
            })
            .filter((b: Book) => b.cover);

        setBooks(mapped && mapped.length > 0 ? mapped : []);
    }

    useEffect(() => {
        fetchBooks()
    }, []);

    return <Books data={books} />
}
