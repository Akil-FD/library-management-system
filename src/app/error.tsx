'use client'

import { CONFIG } from "@/constants/app"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error
    reset: () => void
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-bold text-red-600">
                Something went wrong
            </h1>

            <p className="mt-2 text-gray-600">
                Please try again or refresh the page.
            </p>

            {process.env.NODE_ENV === CONFIG.DEVELOPMENT && (
                <pre className="mt-4 max-w-2xl overflow-auto rounded bg-gray-100 p-4 text-xs">
                    {error.stack}
                </pre>
            )}

            <button
                onClick={reset}
                className="mt-6 rounded bg-blue-500 px-5 py-2 text-white hover:bg-blue-600"
            >
                Try again
            </button>
        </div>
    )
}
