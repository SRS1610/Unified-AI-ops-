import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-5xl">🕳️</div>
      <h1 className="text-2xl font-semibold">Nothing here.</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        This page doesn&apos;t exist yet. Head back to your workspace.
      </p>
      <Link href="/home">
        <Button>Back to home</Button>
      </Link>
    </div>
  )
}
