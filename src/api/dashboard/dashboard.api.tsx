
export const dashboardApi = {
    getBooks(): Promise<Response> {
        try {
            return fetch(
                "https://api.openalex.org/works?filter=title.search:programming&per-page=50",
                { cache: "no-store" }
            );
        } catch (error) {
            return Promise.reject(error);
        }

    },

    getCoverImageByTitle(title: string): Promise<Response> {
        try {
            return fetch(
                `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1`,
                { cache: "no-store" }
            )
        } catch (error) {
            return Promise.reject(error);
        }
    }

}
