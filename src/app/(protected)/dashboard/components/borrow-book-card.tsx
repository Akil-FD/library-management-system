'use client'

import { useCallback } from "react"
import { BorrowedBook } from "@/types/dashboard"
import BookCard from "./book-card"

export function BorrowedBookCard({
  book,
  onReturn,
}: {
  book: BorrowedBook,
  onReturn?: (details: BorrowedBook) => void
}) {
const handleReturnBooks = useCallback(() => {
    onReturn?.(book)
  }, [book, onReturn])

  return (<BookCard book={book} onReturn={handleReturnBooks} />)
}

