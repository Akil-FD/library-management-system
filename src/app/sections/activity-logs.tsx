
'use client'

import { DataTable } from "@/components/data-table";
import { useEffect, useMemo, useState } from "react";
import { LOCAL_STORAGE_KEYS } from "@/constants/app";
import { BorrowedBook } from "@/types/dashboard";
import z from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ActivityStatus } from "@/types/enums/dashboard.enum";

export const schema = z.object({
    id: z.number(),
    userName: z.string(),
    bookTitle: z.string(),
    status: z.string(),
    borrowedOn: z.string(),
    bookReturned: z.string()
})

// export type BorrowHistoryRow = {
//     id: string
//     userName: string
//     bookTitle: string
//     status: "Borrowed" | "Returned"
//     time: string
// }

export default function ActivityLogs() {
    const [usersLog, setUsersLog] = useState<z.infer<typeof schema>[]>([]);

    useEffect(() => {
        const storedUsersHistory = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS_BOOKS_LOG);
        const parsedUsersHistory: BorrowedBook[] = storedUsersHistory ? JSON.parse(storedUsersHistory) : [];

        setUsersLog(parsedUsersHistory.map((book, index) => {
            return {
                id: index + 1,
                userName: book.borrowed?.name ?? 'Unknown',
                bookTitle: book.title,
                status: book.isBorrowed ? ActivityStatus.BORROWED : ActivityStatus.RETURNED,
                borrowedOn: book.borrowed.onDate,
                bookReturned: book.borrowed.returnedDate
            }
        }))
    }, []);

    const columns: ColumnDef<z.infer<typeof schema>>[] = [
        {
            id: "drag",
            accessorFn: () => "",
            header: () => null,
            cell: () => <div />,
        },
        {
            accessorFn: (row) => row.userName,
            id: "userName",
            header: "User Name",
            cell: ({ row }) => (
                <div className="text-sm font-medium">
                    {row.original.userName}
                </div>
            ),
        },
        {
            accessorFn: (row) => row.bookTitle,
            id: "bookTitle",
            header: "Book Title",
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground">
                    {row.original.bookTitle}
                </div>
            ),
        },
        {
            accessorFn: (row) => row.status,
            id: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant="destructive" className={`${row.original.status === ActivityStatus.BORROWED ? "bg-green-500" : "bg-red-600"}`}>
                    {row.original.status}
                </Badge>
            ),
        },
        {
            accessorFn: (row) => row.borrowedOn,
            id: "borrowedOn",
            header: "Borrowed On",
            cell: ({ row }) => (
                <div className="text-muted-foreground">
                    {new Date(row.original.borrowedOn).toLocaleString()}
                </div>
            ),
        },
        {
            accessorFn: (row) => row.bookReturned,
            id: "bookReturned",
            header: "Returned On",
            cell: ({ row }) => (
                <div className="text-muted-foreground">
                    {row.original.bookReturned ? new Date(row.original.bookReturned).toLocaleString() : '-'}
                </div>
            ),
        },
    ];

    return <div className="h-full w-full box-border">
        <DataTable<typeof schema> data={usersLog} columns={columns} />
    </div>
}