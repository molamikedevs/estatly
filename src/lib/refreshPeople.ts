import type { QueryClient } from "@tanstack/react-query"

// A person's name and photo are joined into all of these lists, so a
// change to anyone's profile must refresh them all. One list, used by
// the profile page and by admins editing a team member
const PEOPLE_KEYS = [
  ["user"],
  ["team"],
  ["clients"],
  ["properties"],
  ["property"],
  ["viewings"],
  ["dashboard"],
]

export function refreshPeople(queryClient: QueryClient) {
  // Only queries on screen refetch now; the rest refetch when visited
  PEOPLE_KEYS.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }))
}
