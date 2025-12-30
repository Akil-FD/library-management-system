"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { FieldGroup } from "@/components/ui/field"
import { FormInput } from "@/components/common/FormInput"
import z from "zod/v3"
import { LOCAL_STORAGE_KEYS } from "@/constants/app"
import { Book } from "@/types/dashboard"

const addBookSchema = z.object({
    bookName: z.string().min(1, "Book name is required"),
    authorName: z.string().min(1, "Author name is required"),
    publishedYear: z.coerce.number().min(1, "Published year is required"),
    stock: z.coerce.number().min(0),
    coverImage: z.string().optional(),
})

type AddBookFormValues = z.infer<typeof addBookSchema>


export function AddBookDialog({ onBookAdd }: { onBookAdd: (details: Book) => void }) {
    const [open, setOpen] = React.useState(false);

    const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm<AddBookFormValues>({
        resolver: zodResolver(addBookSchema),
        defaultValues: {
            bookName: "",
            authorName: "",
            publishedYear: 0,
            stock: 0,
            coverImage: undefined,
        },
    })

    const imageUrl = watch("coverImage")

    React.useEffect(() => {
        if (!imageUrl) {
            setValue('coverImage', '')

            return
        }
        setValue('coverImage', imageUrl);
    }, [imageUrl])

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (!newOpen) {
            reset();
        }
    }

    const onCoverImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]
        if (!file) return

        setValue("coverImage", URL.createObjectURL(file))
    }


    const onSubmit = (data: AddBookFormValues) => {
        const getStoredBooks = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKS) || "[]"
        );

        const formatedBookDetails = {
            author: data.authorName,
            cover: data?.coverImage ?? '',
            inStock: data.stock,
            isBorrowed: false,
            title: data.bookName,
            year: data.publishedYear
        };


        const updatedBooks: Book[] = [...getStoredBooks, formatedBookDetails]
        localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKS, JSON.stringify(updatedBooks));
        onBookAdd(formatedBookDetails);
        setOpen(false);
    }

    const inputProps = {
        bookName: {
            label: "Book Name",
            name: "bookName",
            type: "text",
            placeholder: "Enter book name",
            required: true,
        },
        authorName: {
            label: "Author",
            name: "authorName",
            type: "text",
            placeholder: "Enter author name",
            required: true,
        },
        publishedYear: {
            label: "Published Year",
            name: "publishedYear",
            type: "number",
            placeholder: "Enter published year",
            required: true,
        },
        stock: {
            label: "In Stock",
            name: "stock",
            type: "number",
            placeholder: "Enter stock quantity",
            required: true,
        },
        coverImage: {
            label: "Book Cover",
            name: "coverImage",
            type: "file",
            placeholder: "",
            required: false,
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline">Add Book</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add book</DialogTitle>
                    <DialogDescription>
                        Add new book. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>

                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <FormInput {...inputProps.bookName} register={register} error={errors.bookName} />
                        <FormInput {...inputProps.authorName} register={register} error={errors.authorName} />
                        <FormInput {...inputProps.publishedYear} register={register} error={errors.publishedYear} />
                        <FormInput {...inputProps.stock} register={register} error={errors.stock} />
                        <FormInput {...inputProps.coverImage} register={register} error={errors.coverImage} onChange={(e) => onCoverImageUpload(e)} />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>Save changes</Button>
                        </DialogFooter>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    )
}
