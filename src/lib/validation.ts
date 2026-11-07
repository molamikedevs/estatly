import { DURATIONS } from "@/lib/constants"
import { z } from "zod"

/* ─────────────────────────────────────────────
  Shared
   ───────────────────────────────────────────── */

const CURRENT_YEAR = new Date().getFullYear()
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^[+\d\s()-]*$/

/* ─────────────────────────────────────────────
  Auth
   ───────────────────────────────────────────── */

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),
})

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

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

export type PasswordFormValues = z.infer<typeof passwordSchema>

/* ─────────────────────────────────────────────
  People: admins create and edit team members;
  your own profile reuses the phone and specialization rules
   ───────────────────────────────────────────── */

// Add a team member: the page sets the role, the admin sets a temporary password
export const createTeamMemberSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Full name is required")
    .max(80, "Name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    // bcrypt only uses the first 72 bytes
    .max(72, "Password is too long"),
  role: z.enum(["manager", "agent"], { message: "Choose a role" }),
})

export type CreateTeamMemberValues = z.infer<typeof createTeamMemberSchema>

// Admin edits a member's details (email and role are locked)
export const teamMemberFormSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Full name is required")
    .max(80, "Name is too long"),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long")
    .regex(PHONE, "Use digits, spaces, +, -, or ()"),
  specialization: z.string().trim().max(80, "Specialization is too long"),
})

export const teamMemberSchema = teamMemberFormSchema.transform((values) => ({
  full_name: values.full_name,
  phone: values.phone || null,
  specialization: values.specialization || null,
}))

export type TeamMemberFormValues = z.infer<typeof teamMemberFormSchema>

// Your own profile: phone and specialization only. Your name, email and
// role are set by an admin, so they are not in the form. pick() reuses
// the team rules, so both forms always validate these fields the same way
export const profileFormSchema = teamMemberFormSchema.pick({
  phone: true,
  specialization: true,
})

export const profileSchema = profileFormSchema.transform((values) => ({
  phone: values.phone || null,
  specialization: values.specialization || null,
}))

export type ProfileFormValues = z.infer<typeof profileFormSchema>

/* ─────────────────────────────────────────────
  Properties
   ───────────────────────────────────────────── */

const numberText = (message: string) =>
  z
    .string()
    .min(1, message)
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, message)

// No status: new listings always start as pending-approval (set by the API)
// and the status only changes through its own action
export const propertyFormSchema = z.object({
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

  price: numberText("Enter a valid price"),
  bedrooms: numberText("Enter the number of bedrooms"),
  bathrooms: numberText("Enter the number of bathrooms"),
  size_sqm: numberText("Enter a valid size"),

  // The year picker stores an ISO date; empty means not set
  year_built: z.string().refine((v) => {
    if (v === "") return true
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

  // Existing photos have a url; new ones also carry the File to upload
  gallery_images: z
    .array(
      z.object({ id: z.string(), url: z.string(), file: z.any().optional() })
    )
    .max(10, "Up to 10 images allowed"),
})

// Same rules plus conversion to database values (used by action)
export const propertySchema = propertyFormSchema.transform(
  ({ price, bedrooms, bathrooms, size_sqm, year_built, ...rest }) => ({
    ...rest,
    price: Number(price),
    bedrooms: Number(bedrooms),
    bathrooms: Number(bathrooms),
    size_sqm: Number(size_sqm),
    // The column holds the year. Number(isoDate) was NaN, saved as null
    year_built: year_built ? new Date(year_built).getFullYear() : null,
  })
)

const PROPERTY_STATUS_VALUES = [
  "pending-approval",
  "published",
  "under-offer",
  "sold",
  "rented",
] as const

export const updatePropertyStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(PROPERTY_STATUS_VALUES, { message: "Choose a valid status" }),
})

export type PropertyFormValues = z.infer<typeof propertyFormSchema>

/* ─────────────────────────────────────────────
  Viewings
  *FormSchema: the rules, as strings (used by forms)
  *Schema without "Form": same rules plus conversion (used by action)
   ───────────────────────────────────────────── */

const VIEWING_STATUSES = [
  "scheduled",
  "completed",
  "cancelled",
  "no-show",
  "offer-made",
] as const

export const viewingFormSchema = z.object({
  property_id: z.string().min(1, "Select a property"),
  client_id: z.string().min(1, "Select a client"),
  scheduled_at: z
    .string()
    .min(1, "Pick a date and time")
    .refine(
      (v) => new Date(v).getTime() > Date.now(),
      "Pick a time in the future"
    ),
  duration_minutes: z.enum(DURATIONS, { message: "Select a duration" }),
})

export const viewingSchema = viewingFormSchema.transform((values) => ({
  property_id: Number(values.property_id),
  client_id: Number(values.client_id),
  scheduled_at: values.scheduled_at,
  duration_minutes: Number(values.duration_minutes),
}))

export type ViewingFormValues = z.infer<typeof viewingFormSchema>

// Reschedule: same date and duration rules, picked from the create form
export const rescheduleFormSchema = viewingFormSchema.pick({
  scheduled_at: true,
  duration_minutes: true,
})

export const rescheduleViewingSchema = rescheduleFormSchema
  .extend({ id: z.number().int().positive() })
  .transform((values) => ({
    id: values.id,
    scheduled_at: values.scheduled_at,
    duration_minutes: Number(values.duration_minutes),
  }))

export type RescheduleFormValues = z.infer<typeof rescheduleFormSchema>

export const updateViewingStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(VIEWING_STATUSES, { message: "Choose a valid status" }),
})

/* ─────────────────────────────────────────────
  Clients
   ───────────────────────────────────────────── */

const CLIENT_STATUSES = [
  "active",
  "closed-won",
  "closed-lost",
  "inactive",
] as const

const budgetText = z
  .string()
  .refine((v) => v === "" || Number(v) >= 0, "Enter a valid amount")

export const clientFormSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "Full name is required")
      .max(80, "Name is too long"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email"),
    phone: z
      .string()
      .trim()
      .max(20, "Phone number is too long")
      .regex(PHONE, "Use digits, spaces, +, -, or ()"),
    nationality: z.string().trim().max(60, "Too long"),
    budget_min: budgetText,
    budget_max: budgetText,
    preferred_type: z.string(),
    preferred_locations: z.array(z.string()).max(10, "Too many locations"),
  })
  .refine(
    (v) =>
      v.budget_min === "" ||
      v.budget_max === "" ||
      Number(v.budget_max) >= Number(v.budget_min),
    { message: "Max budget must be at least the min", path: ["budget_max"] }
  )

// Empty text becomes null, so the database never stores ""
const textOrNull = (value: string) => value || null
const numberOrNull = (value: string) => (value === "" ? null : Number(value))

export const clientSchema = clientFormSchema.transform((values) => ({
  full_name: values.full_name,
  email: values.email.toLowerCase(),
  phone: textOrNull(values.phone),
  nationality: textOrNull(values.nationality),
  budget_min: numberOrNull(values.budget_min),
  budget_max: numberOrNull(values.budget_max),
  preferred_type: textOrNull(values.preferred_type),
  preferred_locations: values.preferred_locations,
}))

export type ClientFormValues = z.infer<typeof clientFormSchema>

export const updateClientStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(CLIENT_STATUSES, { message: "Choose a valid stage" }),
})

/* ─────────────────────────────────────────────
  Settings
   ───────────────────────────────────────────── */

export const settingsFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Agency name is required")
    .max(100, "Name is too long"),
  contact_email: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => v === "" || EMAIL.test(v), "Enter a valid email"),
  contact_phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long")
    .regex(PHONE, "Use digits, spaces, +, -, or ()"),
  commission_rate: z
    .string()
    .min(1, "Commission rate is required")
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100,
      "Enter a rate between 0 and 100"
    ),
  default_viewing_duration: z.enum(DURATIONS, {
    message: "Select a duration",
  }),
})

export const settingsSchema = settingsFormSchema.transform((values) => ({
  name: values.name,
  contact_email: textOrNull(values.contact_email),
  contact_phone: textOrNull(values.contact_phone),
  commission_rate: Number(values.commission_rate),
  default_viewing_duration: Number(values.default_viewing_duration),
}))

export type SettingsFormValues = z.infer<typeof settingsFormSchema>
