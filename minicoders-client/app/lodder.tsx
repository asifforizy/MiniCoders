
import { Spinner } from "@/components/ui/spinner"

const GlobalLoading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full border bg-card p-4 shadow-sm">
          <Spinner className="size-7" />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium">Loading</p>
          <p className="text-xs text-muted-foreground">
            Please wait a moment...
          </p>
        </div>
      </div>
    </div>
  )
}

export default GlobalLoading