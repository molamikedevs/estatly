export default function PageTitle({ title }: { title?: string }) {
  const text = title ? `${title} · Estatly` : "Estatly"
  return <title>{text}</title>
}
