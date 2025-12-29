
import { Book } from "@/types/dashboard";
import { dashboardApi } from "@/api/dashboard/dashboard.api";
import { CONFIG } from "@/constants/app";
import Dashboard from "@/app/sections/dashboard";

export default async function Page() {

  async function fetchCoverByTitle(title: string): Promise<string | null> {
    try {
      const res = await dashboardApi.getCoverImageByTitle(title)
      const data = await res.json()
      const id = data.docs?.[0]?.cover_i
      return id ? `https://covers.openlibrary.org/b/id/${id}-M.jpg` : null
    } catch (error) {
      if (process.env.NODE_ENV === CONFIG.DEVELOPMENT) {
        console.error("Error fetching cover image:", error);
      }
      return null;
    }
  }

  async function fetchBooks(): Promise<Book[] | undefined> {
    try {
      const res = await dashboardApi.getBooks()
      const { results } = await res.json()

      const settledBooks = await Promise.allSettled(
        results.map(async (book: any): Promise<Book | null> => {
          const title = book.title ?? "Unknown Title"
          const author = book.authorships?.[0]?.author?.display_name ?? "Unknown"
          const year = book.publication_year ?? "—"
          const inStock = Math.floor(Math.random() * 10)

          const isbn = book.ids?.isbn?.[0]
          const cover =
            isbn
              ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
              : await fetchCoverByTitle(title)

          return cover
            ? { title, author, year, cover, inStock }
            : null
        })
      )

      return settledBooks
        .filter((result): result is PromiseFulfilledResult<Book> => result.status === "fulfilled" && result.value !== null)
        .map(result => result.value);
    } catch (error) {
      if (process.env.NODE_ENV === CONFIG.DEVELOPMENT) {
        console.error("Error fetching books:", error);
      }
    }
  }

  const books: Book[] | undefined = await fetchBooks();

  return (
    <Dashboard books={books ?? []} />
  )
}
