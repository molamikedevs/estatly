import { uploadGalleryImagesApi } from "@/api/uploader"
import type { GalleryImage } from "@/types/database"
import type { PropertyFormValues } from "@/types/global"

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function formatPrice(price: number, listingType: string) {
  const formatted = new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(price)
  return listingType === "rent" ? `${formatted}/yr` : formatted
}

export function formatSize(sqm: number) {
  return `${Math.round(sqm)} m²`
}

export function formatViewingDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export function formatViewingTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export function formatBudgetShort(amount: number) {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}M`
  }
  if (amount >= 1_000) {
    return `${Math.round(amount / 1_000)}K`
  }
  return String(amount)
}

export function formatBudgetRange(
  min: number | null,
  max: number | null
): string {
  if (min == null && max == null) return "Not specified"
  if (min != null && max != null)
    return `AED ${formatBudgetShort(min)} – ${formatBudgetShort(max)}`
  if (min != null) return `From AED ${formatBudgetShort(min)}`
  return `Up to AED ${formatBudgetShort(max!)}`
}

export async function buildPropertyPayload(newProperty: PropertyFormValues) {
  // 1. Upload Images
  const galleryImages = newProperty.gallery_images as GalleryImage[]
  const resolvedUrls = await uploadGalleryImagesApi({
    images: galleryImages,
    bucket: "property-images",
  })

  // 2. Return payload
  return {
    ...newProperty,
    price: Number(newProperty.price),
    bedrooms: Number(newProperty.bedrooms),
    bathrooms: Number(newProperty.bathrooms),
    size_sqm: Number(newProperty.size_sqm),
    year_built: newProperty.year_built ? Number(newProperty.year_built) : null,
    gallery_images: resolvedUrls,
    main_image: resolvedUrls[0] ?? null,
  }
}
