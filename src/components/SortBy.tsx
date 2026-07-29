import { useSearchParams } from "react-router-dom"
import SortBySelect from "./SortbySelect"

interface SortOption {
  value: string
  label: string
}

export default function SortBy({ options }: { options: SortOption[] }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const sortBy = searchParams.get("sort_by") || options[0].value

  function handleChange(value: string) {
    const next = new URLSearchParams(searchParams)
    next.set("sort_by", value)
    setSearchParams(next)
  }

  return (
    <SortBySelect options={options} value={sortBy} onChange={handleChange} />
  )
}
