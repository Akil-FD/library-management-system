import { AuthGuard } from "@/guards/AuthGuard"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>
}
