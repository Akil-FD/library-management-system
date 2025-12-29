import { toast } from "sonner"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

const baseClass =
    "rounded-xl border px-4 py-3 flex items-start gap-3 shadow-lg"

export const showSuccessToast = (title: string, description?: string) =>
    toast.custom(() => (
        <div className={`${baseClass} bg-emerald-50 border-emerald-200`}>
            <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
            <div>
                <p className="text-sm font-semibold text-emerald-900" > {title} </p>
                {
                    description && (
                        <p className="text-xs text-emerald-700" > {description} </p>
                    )
                }
            </div>
        </div>
    ));

export const showErrorToast = (title: string, description?: string) =>
    toast.custom(() => (
        <div className={`${baseClass} bg-red-50 border-red-200`}>
            <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
                <p className="text-sm font-semibold text-red-900" > {title} </p>
                {
                    description && (
                        <p className="text-xs text-red-700" > {description} </p>
                    )
                }
            </div>
        </div>
    ));

export const showWarningToast = (title: string, description?: string) =>
    toast.custom(() => (
        <div className={`${baseClass} bg-amber-50 border-amber-200`}>
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
                <p className="text-sm font-semibold text-amber-900" > {title} </p>
                {
                    description && (
                        <p className="text-xs text-amber-700" > {description} </p>
                    )
                }
            </div>
        </div>
    ));
