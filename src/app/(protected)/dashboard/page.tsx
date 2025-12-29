import { APP_ROUTES } from "@/constants/app"
import { redirect } from "next/navigation"

export default function Page() {
  redirect(APP_ROUTES.DASHBOARD_BOOKS)
}
