export default function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <rect width="64" height="64" rx="16" fill="var(--primary)" />
      <path
        d="M19 13 H45 V21 H29 V28 H42 V36 H29 V43 H45 V51 H19 Z"
        fill="var(--primary-foreground)"
      />
    </svg>
  )
}
