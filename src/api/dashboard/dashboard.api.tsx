
export const dashboardApi = {
    getBooks(): Promise<Response> {
        try {
            return fetch(
                "https://www.googleapis.com/books/v1/volumes?q=programming&maxResults=40",
                { cache: "no-store" }
            );
        } catch (error) {
            return Promise.reject(error);
        }

    },

}
