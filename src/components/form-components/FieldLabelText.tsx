import type { FieldLabelTextProps } from "@/types/global"

export default function FieldLabelText({
  children,
  required,
  optional,
}: FieldLabelTextProps) {
  return (
    <>
      {children}
      {required && (
        <>
          {" "}
          <span className="text-destructive">*</span>
        </>
      )}
      {optional && (
        <>
          {" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </>
      )}
    </>
  )
}
