// Shared by the column labels and every row, so they always line up
export function gridColumns(showAgent: boolean) {
  return showAgent
    ? "md:grid-cols-[7rem_minmax(0,2fr)_minmax(0,1.4fr)_minmax(0,1.2fr)_8rem_2.5rem]"
    : "md:grid-cols-[7rem_minmax(0,2fr)_minmax(0,1.4fr)_8rem_2.5rem]"
}
