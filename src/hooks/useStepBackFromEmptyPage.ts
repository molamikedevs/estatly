import { RequestError } from "@/lib/errors"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

// A delete or a status change under a filter can leave ?page= past the end.
// Supabase answers 416 (see toRequestError): step back one page.
// An effect, because it reacts to the server's answer, whatever caused it.
export function useStepBackFromEmptyPage(error: unknown, page: number) {
  const [, setSearchParams] = useSearchParams()
  const pageIsGone = error instanceof RequestError && error.statusCode === 416

  useEffect(() => {
    if (!pageIsGone || page <= 1) return
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set("page", String(page - 1))
        return next
      },
      // The dead page does not get a Back-button entry
      { replace: true }
    )
  }, [pageIsGone, page, setSearchParams])
}
