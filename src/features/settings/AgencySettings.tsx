import SettingsForm from "./SettingsForm"
import SettingsSkeleton from "./SettingsSkeleton"
import { useSettings } from "./useSettings"

export default function AgencySettings() {
  const { isLoading, settings } = useSettings()

  if (isLoading) return <SettingsSkeleton />
  if (!settings) return null

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your agency profile and operational defaults.
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  )
}
