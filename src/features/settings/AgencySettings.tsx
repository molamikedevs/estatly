import FormSheet from "@/components/form-components/FormSheet"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useState } from "react"
import SettingsDisplay from "./SettingsDisplay"
import SettingsError from "./SettingsError"
import SettingsForm from "./SettingsForm"
import SettingsSkeleton from "./SettingsSkeleton"
import { useSettings } from "./useSettings"

export default function AgencySettings() {
  const { isLoading, settings } = useSettings()
  const [editOpen, setEditOpen] = useState(false)

  if (isLoading) return <SettingsSkeleton />

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your agency profile and operational defaults.
          </p>
        </div>

        {settings && (
          <Button onClick={() => setEditOpen(true)} className="gap-2 shadow-sm">
            <Pencil className="h-3.5 w-3.5" />
            Edit settings
          </Button>
        )}
      </div>

      {!settings ? (
        <SettingsError />
      ) : (
        <>
          <SettingsDisplay settings={settings} />

          <FormSheet
            open={editOpen}
            onOpenChange={setEditOpen}
            size="md"
            title="Edit settings"
            description="Update your agency profile and operational defaults."
          >
            <SettingsForm
              settings={settings}
              onClose={() => setEditOpen(false)}
            />
          </FormSheet>
        </>
      )}
    </div>
  )
}
