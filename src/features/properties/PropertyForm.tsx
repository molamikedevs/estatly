import DatePickerField from "@/components/DatePickerField"
import FormSection from "@/components/form-components/FormSection"
import IconField from "@/components/form-components/IconField"
import SelectField from "@/components/form-components/SelectField"
import SwitchField from "@/components/form-components/SwitchField"
import TagField from "@/components/form-components/TagField"
import TextareaField from "@/components/form-components/TextareaField"
import TextField from "@/components/form-components/TextField"
import GalleryUploader from "@/components/GalleryUploader"
import { FieldGroup } from "@/components/ui/field"
import { usePropertyForm } from "@/features/properties/usePropertyForm"
import { DESC_MAX, LISTING_TYPE_OPTIONS, propertyTypes } from "@/lib/constants"
import type { PropertyFormProps } from "@/types/database"
import {
  Bath,
  BedDouble,
  Building2,
  DollarSign,
  MapPin,
  Ruler,
} from "lucide-react"
import { Controller } from "react-hook-form"
import { FormFooter } from "../auth/FormFooter"

export default function PropertyForm({ property, onClose }: PropertyFormProps) {
  const { form, isEdit, isPending, onSubmit } = usePropertyForm({
    property,
    onClose,
  })
  const { control } = form

  return (
    <form onSubmit={onSubmit} className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 scrollbar-thin space-y-6 overflow-y-auto px-6 py-6">
        {/* ─── Basic information ─────────────────────── */}
        <FormSection
          title="Basic information"
          description="Title, description, and how the property is listed."
        >
          <FieldGroup className="space-y-5">
            <TextField
              control={control}
              name="title"
              id="title"
              label="Title"
              placeholder="Modern 2BR Apartment in Dubai Marina"
              required
            />

            <TextareaField
              control={control}
              name="description"
              id="description"
              label="Description"
              placeholder="Describe the property's standout qualities, location, and lifestyle."
              maxLength={DESC_MAX}
              required
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <SelectField
                control={control}
                name="listing_type"
                id="listing_type"
                label="Listing type"
                options={LISTING_TYPE_OPTIONS}
                required
              />
              <SelectField
                control={control}
                name="property_type"
                id="property_type"
                label="Property type"
                options={propertyTypes}
                required
              />
            </div>
          </FieldGroup>
        </FormSection>

        {/* ─── Pricing & specifications ──────────────── */}
        <FormSection
          title="Pricing & specifications"
          description="Price, size, and the key specs buyers filter by."
        >
          <FieldGroup className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <IconField
                control={control}
                name="price"
                id="price"
                label="Price (AED)"
                icon={DollarSign}
                type="number"
                placeholder="145000"
                required
              />
              <IconField
                control={control}
                name="size_sqm"
                id="size"
                label="Size (m²)"
                icon={Ruler}
                type="number"
                placeholder="110.5"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <IconField
                control={control}
                name="bedrooms"
                id="bedrooms"
                label="Bedrooms"
                icon={BedDouble}
                type="number"
                placeholder="2"
                required
              />
              <IconField
                control={control}
                name="bathrooms"
                id="bathrooms"
                label="Bathrooms"
                icon={Bath}
                type="number"
                placeholder="2"
                required
              />

              <DatePickerField
                control={control}
                name="year_built"
                id="year"
                label="Year built"
                fromYear={1800}
                toYear={new Date().getFullYear()}
                disableFuture
                optional
              />
            </div>

            <SwitchField
              control={control}
              name="furnished"
              id="furnished"
              label="Furnished"
              description="Does the property come with furniture?"
            />
          </FieldGroup>
        </FormSection>

        {/* ─── Location ──────────────────────────────── */}
        <FormSection
          title="Location"
          description="Where the property is located."
        >
          <FieldGroup className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <IconField
                control={control}
                name="city"
                id="city"
                label="City"
                icon={Building2}
                placeholder="Dubai"
                required
              />
              <IconField
                control={control}
                name="neighborhood"
                id="neighborhood"
                label="Neighborhood"
                icon={MapPin}
                placeholder="Dubai Marina"
                required
              />
            </div>

            <IconField
              control={control}
              name="address"
              id="address"
              label="Full address"
              icon={MapPin}
              placeholder="Marina Gate Tower 1, Dubai Marina"
              required
            />
          </FieldGroup>
        </FormSection>

        {/* ─── Features & amenities ──────────────────── */}
        <FormSection
          title="Features & amenities"
          description="Highlight what makes the property stand out."
        >
          <FieldGroup className="space-y-5">
            <TagField
              control={control}
              name="features"
              label="Features"
              description="Property characteristics, e.g. Balcony, Marina View"
              placeholder="Add a feature and press Enter"
            />
            <TagField
              control={control}
              name="amenities"
              label="Amenities"
              description="Building facilities, e.g. Swimming Pool, Gym"
              placeholder="Add an amenity and press Enter"
            />
          </FieldGroup>
        </FormSection>

        {/* ─── Images ────────────────────────────────── */}
        <FormSection
          title="Images"
          description="Upload photos for the listing gallery."
        >
          <Controller
            control={control}
            name="gallery_images"
            render={({ field }) => (
              <GalleryUploader value={field.value} onChange={field.onChange} />
            )}
          />
        </FormSection>
      </div>

      <FormFooter
        canSave={!isPending}
        isSubmitting={isPending}
        onCancel={onClose}
        submitLabel={isEdit ? "Save changes" : "Create property"}
        submittingLabel={isEdit ? "Saving…" : "Creating…"}
      />
    </form>
  )
}
