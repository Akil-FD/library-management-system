import { showErrorToast } from "@/components/common/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { DEFAULT_VALUES, MENU_ITEMS } from "@/constants/app";
import { useAuth } from "@/hooks/useAuth";
import { BorrowedBook } from "@/types/dashboard";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";


interface BookCardProps {
    book: BorrowedBook;
    onBorrow?: (details: BorrowedBook) => void;
    onReturn?: (details: BorrowedBook) => void;
}


export default function BookCard({ book, onBorrow, onReturn }: BookCardProps) {
    const [imgError, setImgError] = useState(false);
    const { borrowedBooks } = useAuth();
    const pathname = usePathname();

    const memoized = useMemo(() => {
        return {
            isMyBooksPage: pathname === MENU_ITEMS[1]?.url,
            isBooksPage: pathname === MENU_ITEMS[0]?.url,
        };
    }, [pathname]);

    const handleBorrow = useCallback(() => {
        if (onBorrow && (book.isBorrowed || book.inStock > 0) && borrowedBooks.length < DEFAULT_VALUES.BORROW_BOOKS_LIMIT) {
            onBorrow(book);
        }

        if (borrowedBooks.length >= DEFAULT_VALUES.BORROW_BOOKS_LIMIT) {
            showErrorToast(`Borrow limit reached (Max ${DEFAULT_VALUES.BORROW_BOOKS_LIMIT} books)`);
        }

    }, [onBorrow, book, borrowedBooks]);

    return (
        <Card
            className="
               flex flex-col sm:flex-row
               w-full
               rounded-xl
               bg-white
               p-4 sm:p-5
               shadow-[0_8px_24px_rgba(0,0,0,0.08)]
               hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]
               transition-all
             "
        >

            <div className="mx-auto sm:mx-0 flex-shrink-0">
                <div className="relative h-44 w-32 sm:h-48 sm:w-36 overflow-hidden rounded-lg bg-muted">
                    <Image
                        src={imgError ? DEFAULT_VALUES.BOOKS_PLACEHOLDER_IMAGE : book.cover}
                        alt={book.title}
                        fill
                        sizes="(max-width: 640px) 128px, 144px"
                        className="object-cover"
                        onError={() => setImgError(true)}
                    />
                </div>
            </div>


            <div className="flex flex-1 flex-col justify-between mt-4 sm:mt-0 sm:pl-5">
                <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-base font-semibold line-clamp-2">
                        {book.title}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        {book.author}
                    </p>

                    {memoized.isMyBooksPage &&
                        <p className="text-xs text-muted-foreground">
                            Borrowed on{" "}
                            <span className="font-medium">
                                {new Date(book.borrowedDate).toLocaleDateString()}
                            </span>
                        </p>
                    }

                    {memoized.isBooksPage &&
                        <p className="text-xs text-muted-foreground">
                            Published Year : {book.year}
                        </p>
                    }

                    {memoized.isMyBooksPage && <BarrowedBadge />}

                    {memoized.isBooksPage &&
                        <Badge
                            variant={book.inStock <= 0 ? "secondary" : "default"}
                            className={`mt-2 w-fit mx-auto sm:mx-0 ${book.inStock <= 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                        >
                            {book.inStock <= 0 ? "Out of Stock" : `${book.inStock} in Stock`}
                        </Badge>
                    }
                </div>


                <div className="mt-4 sm:mt-0 flex">
                    {memoized.isMyBooksPage &&
                        <ReturnButton
                            onClick={() => onReturn?.(book)}
                        />
                    }

                    {memoized.isBooksPage &&
                        <BorrowButton
                            className={book.inStock > 0
                                ? "bg-foreground text-background hover:bg-foreground/90"
                                : "bg-muted text-muted-foreground cursor-not-allowed"
                            }
                            name={book.isBorrowed ? 'Already Borrowed' : 'Borrow Book'}
                            disabled={book.isBorrowed || book.inStock === 0}
                            onClick={handleBorrow}
                        />
                    }
                </div>
            </div>
        </Card>);

}


const BarrowedBadge = () => {
    return (
        <Badge
            variant="secondary"
            className="mt-2 w-fit mx-auto sm:mx-0 bg-indigo-100 text-indigo-700"
        >
            Borrowed
        </Badge>
    )
}

const ReturnButton = ({ disabled = false, onClick }: { disabled?: boolean; onClick: () => void }) => {
    return (
        <Button
            variant="outline"
            className="
              w-full sm:w-auto sm:ml-auto
              rounded-lg
              text-red-600 border-red-600
              hover:bg-red-600 hover:text-white
            "
            onClick={onClick}
            disabled={disabled}
        >
            Return Book
        </Button>
    )

}

const BorrowButton = ({ disabled, name, className, onClick }: { disabled?: boolean; name: string, className?: string, onClick: () => void }) => {
    return <Button
        disabled={disabled}
        className={`w-full sm:w-auto sm:ml-auto rounded-lg ${className}`}
        onClick={onClick}
    >
        {name}
    </Button>

}