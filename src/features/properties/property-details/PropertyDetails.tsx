import BackLink from "@/components/common/BackLink"
import DataRenderer from "@/components/common/DataRenderer"
import Loader from "@/components/common/Loader"
import PageTitle from "@/components/common/PageTitle"
import { useProperty } from "@/features/properties/useProperty"
import { EMPTY_PROPERTY } from "@/lib/states"
import PropertyDetailsContent from "./PropertyDetailsContent"

export default function PropertyDetails() {
  const { isLoading, property, error, refetch } = useProperty()

  return (
    <div className="space-y-6">
      {/* One title for every state: loading, error, empty and loaded */}
      <PageTitle title={property?.title ?? "Property"} />
      <BackLink route="/properties" label="Back to properties" />
      <DataRenderer
        data={property ? [property] : undefined}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        loading={<Loader />}
        empty={EMPTY_PROPERTY}
        render={([loaded]) => <PropertyDetailsContent property={loaded} />}
      />
    </div>
  )
}
