import { z } from "zod"

/* ─────────────────────────────────────────────
  Schema
   ───────────────────────────────────────────── */

const BIO_MAX = 280

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long")
    .regex(
      /^[a-zA-Z\u00C0-\u017F\s'-]+$/,
      "Use letters, spaces, hyphens or apostrophes only"
    ),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long")
    .regex(/^[+\d\s()-]*$/, "Use digits, spaces, +, -, or ()")
    .optional()
    .or(z.literal("")),
  specialization: z
    .string()
    .trim()
    .max(80, "Specialization is too long")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(BIO_MAX, `Bio must be under ${BIO_MAX} characters`)
    .optional()
    .or(z.literal("")),
})
