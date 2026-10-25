import ErrorMessage from "@/components/common/ErrorMessage"
import PageHeader from "@/components/common/PageHeader"
import SettingsForm from "./SettingsForm"
import SettingsSkeleton from "./SettingsSkeleton"
import { useSettings } from "./useSettings"

export default function AgencySettings() {
  const { isLoading, settings, error, refetch } = useSettings()

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <PageHeader
        title="Settings"
        subText="Agency details and defaults for the whole team"
      />

      {isLoading && <SettingsSkeleton />}
      {error && <ErrorMessage error={error} onRetry={() => refetch()} />}
      {settings && <SettingsForm settings={settings} />}
    </div>
  )
}
