import { z } from "zod"

/* ─────────────────────────────────────────────
  Schema
   ───────────────────────────────────────────── */

const BIO_MAX = 280

export const profileSchema = z
  .object({
    full_name: z
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
    password: z
      .string()
      .max(72, "Password is too long")
      .refine((val) => val === "" || val.length >= 8, {
        message: "Password must be at least 8 characters",
      })
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (!data.password) return true // skip if not changing
      return data.password === data.confirmPassword
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  )

export const createAgentSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
  role: z.enum(["manager", "agent"], {
    message: "Select a role",
  }),
})

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password is too long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})
