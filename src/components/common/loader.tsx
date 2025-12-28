import { Loader } from "lucide-react"

export function PageLoader() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader
                className="animate-spin text-muted-foreground"
                size={32}
            />
        </div>
    )
}
