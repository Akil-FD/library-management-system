import { showErrorToast } from "@/components/common/toast";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { DEFAULT_VALUES } from "@/constants/app";
import { useAuth } from "@/hooks/useAuth";
import { BorrowedBook } from "@/types/dashboard";
import Image from "next/image";
import { useCallback, useState } from "react";

export default function BookCard({ book, onBorrow }: { book: BorrowedBook, onBorrow?: (details: BorrowedBook) => void }) {
    const [imgError, setImgError] = useState(false);
    const { borrowedBooks } = useAuth();
    const handleBorrow = useCallback(() => {
        if (onBorrow && (book.isBorrowed || book.inStock > 0) && borrowedBooks.length < DEFAULT_VALUES.BORROW_BOOKS_LIMIT) {
            onBorrow(book);
        }

        if (borrowedBooks.length >= DEFAULT_VALUES.BORROW_BOOKS_LIMIT) {
            showErrorToast(`Borrow limit reached (Max ${DEFAULT_VALUES.BORROW_BOOKS_LIMIT} books)`);
        }

    }, [onBorrow, book, borrowedBooks]);

    return (
        <div
            className="flex justify-center"
        >
            <div className="w-full max-w-[520px]">
                <Card
                    className="group flex w-full flex-col sm:flex-row items-stretch gap-5
                        rounded-2xl border border-border
                        bg-card/80
                        px-6 py-5
                        shadow-sm
                        transition-all duration-300
                        hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg
                    "
                >

                    <div className="relative h-70 w-50 sm:h-40 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-muted m-auto sm:m-0">
                        <Image
                            src={imgError ? "/library-management.jpg" : book.cover}
                            alt={book.title}
                            fill
                            sizes="128px"
                            onError={() => setImgError(true)}
                            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-4 ml-0 sm:ml-2">

                        <div className="space-y-1">
                            <CardTitle className="text-lg font-semibold tracking-tight line-clamp-2">
                                {book.title}
                            </CardTitle>

                            <CardDescription className="text-sm text-muted-foreground line-clamp-1">
                                • {book.author}
                            </CardDescription>

                            <CardDescription className="text-sm text-muted-foreground line-clamp-1">
                                Published Year : {book.year}
                            </CardDescription>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <span
                                className={`
                                    inline-flex items-center gap-2 rounded-full
                                    px-3 py-1.5 text-xs font-semibold min-w-fit
                                    ${book.inStock > 0
                                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                        : "bg-destructive/10 text-destructive"
                                    }
                                `}
                            >
                                <span
                                    className={`
                                        h-2.5 w-2.5 rounded-full
                                        ${book.inStock > 0 ? "bg-emerald-500" : "bg-destructive"
                                        }
                                `}
                                />
                                {book.inStock > 0 ? `${book.inStock} in stock` : "Out of stock"}
                            </span>

                            <Button
                                disabled={book.isBorrowed || book.inStock === 0}
                                className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-all ${book.inStock > 0
                                    ? "bg-foreground text-background hover:bg-foreground/90"
                                    : "bg-muted text-muted-foreground cursor-not-allowed"
                                    }
                                `}
                                onClick={handleBorrow}
                            >
                                {book.isBorrowed ? 'Already Borrowed' : 'Borrow Book'}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>);

} 