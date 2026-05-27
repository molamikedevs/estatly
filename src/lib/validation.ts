import { z } from "zod"

/* ─────────────────────────────────────────────
  Schema
   ───────────────────────────────────────────── */

const BIO_MAX = 280
const CURRENT_YEAR = new Date().getFullYear()

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

const numberText = (message: string) =>
  z
    .string()
    .min(1, message)
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, message)

export const propertySchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(120, "Title is too long"),

  description: z
    .string()
    .min(30, "Description must be at least 30 characters")
    .max(2000, "Description is too long"),

  listing_type: z.enum(["rent", "sale"], {
    message: "Select a listing type",
  }),

  property_type: z.enum(
    [
      "apartment",
      "villa",
      "townhouse",
      "penthouse",
      "studio",
      "office",
      "land",
    ],
    { message: "Select a property type" }
  ),

  status: z.enum(["published", "draft", "archived"]),

  price: numberText("Enter a valid price"),
  bedrooms: numberText("Enter the number of bedrooms"),
  bathrooms: numberText("Enter the number of bathrooms"),
  size_sqm: numberText("Enter a valid size"),

  year_built: z.string().refine((v) => {
    if (v === "") return true // optional — empty is fine
    const year = new Date(v).getFullYear()
    return !Number.isNaN(year) && year >= 1800 && year <= CURRENT_YEAR
  }, `Enter a year between 1800 and ${CURRENT_YEAR}`),

  city: z.string().min(2, "City is required").max(80, "City name is too long"),

  neighborhood: z
    .string()
    .min(2, "Neighborhood is required")
    .max(80, "Neighborhood is too long"),

  address: z
    .string()
    .min(5, "Address is required")
    .max(200, "Address is too long"),

  furnished: z.boolean(),

  features: z.array(z.string()).max(20, "Too many features"),
  amenities: z.array(z.string()).max(20, "Too many amenities"),

  gallery_images: z
    .array(
      z.object({ id: z.string(), url: z.string(), file: z.any().optional() })
    )
    .max(10, "Up to 10 images allowed"),
})

export const viewingSchema = z.object({
  property_id: z.string().min(1, "Select a property"),
  client_id: z.string().min(1, "Select a client"),
  scheduled_at: z.string().min(1, "Pick a date and time"),
  duration_minutes: z.string().min(1, "Select a duration"),
  status: z.enum([
    "scheduled",
    "completed",
    "cancelled",
    "no-show",
    "offer-made",
  ]),
  notes: z.string().max(500, "Notes are too long").optional().or(z.literal("")),
})

export const clientSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name is required")
    .max(80, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z
    .string()
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  nationality: z.string().max(60, "Too long").optional().or(z.literal("")),
  budget_min: z
    .string()
    .refine((v) => v === "" || Number(v) >= 0, "Enter a valid amount")
    .optional()
    .or(z.literal("")),
  budget_max: z
    .string()
    .refine((v) => v === "" || Number(v) >= 0, "Enter a valid amount")
    .optional()
    .or(z.literal("")),
  preferred_type: z.string().optional().or(z.literal("")),
  preferred_locations: z.array(z.string()).max(10, "Too many locations"),
  notes: z
    .string()
    .max(1000, "Notes are too long")
    .optional()
    .or(z.literal("")),
  status: z.enum(["active", "closed-won", "closed-lost", "inactive"]),
})
