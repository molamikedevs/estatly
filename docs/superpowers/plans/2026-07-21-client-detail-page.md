# Client Detail Page + Permission Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix `/clients/:clientId` (currently rendering the Agent/team-member page) into a real client detail page, bring client editing to parity with properties (full-field edit, not just status), and add the ownership-gated permission checks that properties already have but clients never got.

**Architecture:** Mirror the existing property-details pattern file-for-file: a `getClientApi`/`updateClientApi` pair in `apiClients.ts`, a `useClient` hook reading the route param, a `useClientDetails` orchestration hook owning edit/delete dialog state, and a `ClientDetailView` page component. Permission checks follow `PropertyCard.tsx`'s exact shape: a role check from `permissions.ts` OR'd with an ownership check (`assigned_agent_id === user.id`) for agents.

**Tech Stack:** React 19, TanStack Query v5, react-hook-form + zod, Supabase JS client, react-router-dom v7, Tailwind v4 + shadcn/radix components.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-21-client-detail-page-design.md` — every task below implements a section of it.
- **No test runner exists in this repo** (no vitest/jest config, no `*.test.*` files, no `test` script in `package.json`). Do not add one as part of this plan — that's out of scope. Each task's verification step is `pnpm run typecheck` (and `pnpm run lint` where the task touches JSX/imports) instead of an automated test, plus a manual browser check for user-facing behavior. The final task is a full manual QA pass through the running app.
- Package manager is **pnpm** (`pnpm-lock.yaml`, `pnpm-workspace.yaml` present) — use `pnpm run <script>`, not `npm run`.
- Follow existing naming/shape conventions exactly where a precedent exists (e.g. `getPropertyApi` → `getClientApi`, `usePropertyDetails` → `useClientDetails`). Don't introduce new abstractions (e.g. no new "operations" hook for `ClientsTable` — it already owns local state like `deleteTarget` directly, so `editClient`/`editOpen` follow the same local-`useState` convention).
- Two deviations from the committed spec, made at plan time (both file-structure/decomposition details the spec's "Design" section described at a coarser grain than a plan needs — no behavior described in the spec changes):
  - The spec said the detail page would reuse `BudgetRange` "as-is." `BudgetRange`'s progress bar is meaningful when scaled against a *ceiling across many clients* (as `ClientsTable` does) — on a single-client page there's no such ceiling, so the bar would always render full-width and add no information. Task 9 uses `formatBudgetRange` (plain text) instead.
  - The spec's "Files touched" list didn't include `ClientDetailHeader.tsx` (Task 8, a new file) or a `ClientStatusGroup.tsx` change (Task 11). Splitting the header into its own component mirrors the existing `PropertyDetailsHeader.tsx` precedent (permission computation is intricate enough to isolate). The `ClientStatusGroup.tsx` change is a mechanical prop-threading consequence of giving `ClientRow` an `onEdit` prop in Task 10 — it wasn't visible as a separate file until the row-level edit entry point was worked out at this level of detail.

---

### Task 1: Client permissions

**Files:**
- Modify: `src/lib/permissions.ts`

**Interfaces:**
- Produces: `can.editAnyClient(role: UserRole): boolean`, `can.deleteClient(role: UserRole): boolean` — consumed by Task 9 (`ClientDetailHeader`) and Task 11 (`ClientRow`).

- [ ] **Step 1: Add the two permission checks**

Modify `src/lib/permissions.ts` — add `editAnyClient` and `deleteClient` right after the existing `viewAllClients` line:

```ts
import type { UserRole } from "@/types/database"

export const can = {
  // Properties
  createProperty: (role: UserRole) =>
    ["admin", "manager", "agent"].includes(role),
  editAnyProperty: (role: UserRole) => ["admin", "manager"].includes(role),
  deleteProperty: (role: UserRole) => ["admin", "manager"].includes(role),
  // Agents can set sale-lifecycle statuses (offer/sold/rented), managers can too
  setSaleStatus: (role: UserRole) =>
    ["admin", "manager", "agent"].includes(role),

  // Clients
  viewAllClients: (role: UserRole) => ["admin", "manager"].includes(role),
  editAnyClient: (role: UserRole) => ["admin", "manager"].includes(role),
  deleteClient: (role: UserRole) => ["admin", "manager"].includes(role),

  // Viewings
  viewAllViewings: (role: UserRole) => ["admin", "manager"].includes(role),

  // Agents page
  accessAgentsPage: (role: UserRole) => ["admin", "manager"].includes(role),
  manageAgents: (role: UserRole) => role === "admin",

  // Settings
  accessSettings: (role: UserRole) => role === "admin",
}
```

- [ ] **Step 2: Verify**

Run: `pnpm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/permissions.ts
git commit -m "feat(clients): add editAnyClient/deleteClient permission checks"
```

---

### Task 2: Single-client fetch (API + hook)

**Files:**
- Modify: `src/api/apiClients.ts`
- Create: `src/features/clients/useClient.ts`

**Interfaces:**
- Consumes: `supabase` client (`@/lib/supabase`), `Client` type (`@/types/database`).
- Produces: `getClientApi(id: number): Promise<Client>`, and hook `useClient(): { isLoading: boolean, client: Client | undefined, error: Error | null }` — consumed by Tasks 6, 7, 8, 9.

- [ ] **Step 1: Add `getClientApi`**

Modify `src/api/apiClients.ts` — add this function (after the imports, anywhere in the file; suggested: right before `createClientApi`):

```ts
export async function getClientApi(id: number): Promise<Client> {
  const { data, error } = await supabase
    .from("clients")
    .select(
      "*, agent:user_profiles!clients_assigned_agent_id_user_profiles_fkey(full_name, avatar, email)"
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("getClientApi error:", error)
    throw new Error("Client details could not be loaded")
  }

  return data
}
```

- [ ] **Step 2: Verify the API compiles**

Run: `pnpm run typecheck`
Expected: no errors.

- [ ] **Step 3: Create `useClient.ts`**

Create `src/features/clients/useClient.ts`:

```ts
import { getClientApi } from "@/api/apiClients"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

export function useClient() {
  const { clientId } = useParams()
  const id = Number(clientId)

  const {
    isLoading,
    data: client,
    error,
  } = useQuery({
    queryKey: ["client", id],
    queryFn: () => getClientApi(id),
  })

  return { isLoading, client, error }
}
```

- [ ] **Step 4: Verify**

Run: `pnpm run typecheck`
Expected: no errors. (This hook has no consumer yet — it's exercised end-to-end in Task 9.)

- [ ] **Step 5: Commit**

```bash
git add src/api/apiClients.ts src/features/clients/useClient.ts
git commit -m "feat(clients): add getClientApi and useClient hook"
```

---

### Task 3: Full-field client update (API, rename, new hook)

**Files:**
- Modify: `src/api/apiClients.ts`
- Modify: `src/features/clients/useUpdateClient.ts` → rename to `src/features/clients/useUpdateClientStatus.ts`
- Modify: `src/features/clients/ClientsTable.tsx` (update the renamed hook's one call site)
- Create: `src/features/clients/useUpdateClient.ts` (new — full edit, takes over the name)

**Interfaces:**
- Consumes: `ClientFormValues` (`@/types/global`), `Client` (`@/types/database`).
- Produces: `updateClientApi(newClient: ClientFormValues, id: string): Promise<Client>`; hook `useUpdateClientStatus(): { isPending, updateStatus }`; hook `useUpdateClient(): { isPending, updateClient }` where `updateClient({ newClient, id })`. Consumed by Task 4 (`useClientForm`) and Task 11 (`ClientsTable`'s status-change handler).

- [ ] **Step 1: Add `updateClientApi`**

Modify `src/api/apiClients.ts` — add after `createClientApi`:

```ts
export async function updateClientApi(
  newClient: ClientFormValues,
  id: string
): Promise<Client> {
  const dbReady = {
    full_name: newClient.full_name,
    email: newClient.email,
    phone: newClient.phone || null,
    nationality: newClient.nationality || null,
    budget_min: newClient.budget_min ? Number(newClient.budget_min) : null,
    budget_max: newClient.budget_max ? Number(newClient.budget_max) : null,
    preferred_type: newClient.preferred_type || null,
    preferred_locations: newClient.preferred_locations,
    notes: newClient.notes || null,
    status: newClient.status,
  }

  const { data, error } = await supabase
    .from("clients")
    .update(dbReady)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("updateClientApi error:", error)
    throw new Error("Client could not be updated")
  }

  return data
}
```

Add `ClientFormValues` to the existing type-only import at the top of the file:

```ts
import type { Client, ClientStatus } from "@/types/database"
import type { ClientFormValues } from "@/types/global"
```

- [ ] **Step 2: Verify**

Run: `pnpm run typecheck`
Expected: no errors.

- [ ] **Step 3: Rename the status-only hook**

```bash
git mv src/features/clients/useUpdateClient.ts src/features/clients/useUpdateClientStatus.ts
```

Edit the renamed file so its function name and returned property match the `useUpdatePropertyStatus` convention — replace the whole contents of `src/features/clients/useUpdateClientStatus.ts` with:

```ts
import { updateClientStatusApi } from "@/api/apiClients"
import type { ClientStatus } from "@/types/database"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateClientStatus() {
  const queryClient = useQueryClient()

  const { isPending, mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: ClientStatus }) =>
      updateClientStatusApi(id, status),

    onSuccess: () => {
      toast.success("Client status updated")
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, updateStatus }
}
```

- [ ] **Step 4: Update the renamed hook's call site**

Modify `src/features/clients/ClientsTable.tsx`:

```ts
// before
import { useUpdateClient } from "./useUpdateClient"
// ...
const { updateClient } = useUpdateClient()
// ...
function handleStatusChange(client: Client, status: ClientStatus) {
  updateClient({ id: client.id, status })
}
```

```ts
// after
import { useUpdateClientStatus } from "./useUpdateClientStatus"
// ...
const { updateStatus } = useUpdateClientStatus()
// ...
function handleStatusChange(client: Client, status: ClientStatus) {
  updateStatus({ id: client.id, status })
}
```

- [ ] **Step 5: Create the new full-edit `useUpdateClient.ts`**

Create `src/features/clients/useUpdateClient.ts`:

```ts
import { updateClientApi } from "@/api/apiClients"
import type { ClientFormValues } from "@/types/global"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateClient() {
  const queryClient = useQueryClient()

  const { isPending, mutate: updateClient } = useMutation({
    mutationFn: ({
      newClient,
      id,
    }: {
      newClient: ClientFormValues
      id: string
    }) => updateClientApi(newClient, id),

    onSuccess: () => {
      toast.success("Client successfully updated")
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      queryClient.invalidateQueries({ queryKey: ["client"] })
    },

    onError: (err) => toast.error(err.message),
  })

  return { isPending, updateClient }
}
```

- [ ] **Step 6: Verify**

Run: `pnpm run typecheck`
Expected: no errors — in particular, no leftover references to the old `useUpdateClient` status-only shape.

Run: `pnpm run lint`
Expected: no errors.

- [ ] **Step 7: Manual check**

Run `pnpm run dev`, open the app, go to Clients, change a client's status from the row dropdown. Confirm the toast still says "Client status updated" and the row moves to the new status group (this exercises the renamed hook end-to-end).

- [ ] **Step 8: Commit**

```bash
git add src/api/apiClients.ts src/features/clients/useUpdateClientStatus.ts src/features/clients/useUpdateClient.ts src/features/clients/ClientsTable.tsx
git commit -m "feat(clients): add full-field updateClientApi, rename status hook to useUpdateClientStatus"
```

---

### Task 4: Full-edit support in the client form

**Files:**
- Modify: `src/features/clients/useClientForm.ts`
- Modify: `src/features/clients/ClientForm.tsx`

**Interfaces:**
- Consumes: `useUpdateClient` (Task 3), `Client` (`@/types/database`), `ClientFormProps` (`@/types/database`, already defined, currently unused).
- Produces: `useClientForm({ client?, onClose }): { form, isEdit, isPending, onSubmit }`; `<ClientForm client? onClose>`. Consumed by Task 9 (`ClientDetailView`) and Task 11 (`ClientsTable`).

- [ ] **Step 1: Add the edit branch to `useClientForm.ts`**

Replace the full contents of `src/features/clients/useClientForm.ts`:

```ts
import { clientSchema } from "@/lib/validation"
import type { Client } from "@/types/database"
import type { ClientFormValues } from "@/types/global"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useCreateClient } from "./useCreateClient"
import { useUpdateClient } from "./useUpdateClient"

const EMPTY_VALUES: ClientFormValues = {
  full_name: "",
  email: "",
  phone: "",
  nationality: "",
  budget_min: "",
  budget_max: "",
  preferred_type: "",
  preferred_locations: [],
  notes: "",
  status: "active",
}

// Existing client (numbers) -> form values (strings) for editing
function clientToFormValues(c: Client): ClientFormValues {
  return {
    full_name: c.full_name,
    email: c.email,
    phone: c.phone ?? "",
    nationality: c.nationality ?? "",
    budget_min: c.budget_min != null ? String(c.budget_min) : "",
    budget_max: c.budget_max != null ? String(c.budget_max) : "",
    preferred_type: c.preferred_type ?? "",
    preferred_locations: c.preferred_locations ?? [],
    notes: c.notes ?? "",
    status: c.status,
  }
}

interface UseClientFormParams {
  client?: Client
  onClose: () => void
}

export function useClientForm({ client, onClose }: UseClientFormParams) {
  const isEdit = Boolean(client)

  const { updateClient, isPending: isUpdating } = useUpdateClient()
  const { createClient, isPending: isCreating } = useCreateClient()
  const isPending = isEdit ? isUpdating : isCreating

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    mode: "onBlur",
    defaultValues: client ? clientToFormValues(client) : EMPTY_VALUES,
  })

  const onSubmit = form.handleSubmit((values) => {
    if (isEdit && client) {
      updateClient(
        { newClient: values, id: String(client.id) },
        { onSuccess: onClose }
      )
    } else {
      createClient(values, { onSuccess: onClose })
    }
  })

  return { form, isEdit, isPending, onSubmit }
}
```

- [ ] **Step 2: Verify**

Run: `pnpm run typecheck`
Expected: no errors.

- [ ] **Step 3: Add the `client` prop to `ClientForm.tsx`**

Modify `src/features/clients/ClientForm.tsx` — change the import and component signature:

```tsx
// before
import { useClientForm } from "@/features/clients/useClientForm"
// ...
interface ClientFormProps {
  onClose: () => void
}

export default function ClientForm({ onClose }: ClientFormProps) {
  const { form, isPending, onSubmit } = useClientForm({ onClose })
```

```tsx
// after
import { useClientForm } from "@/features/clients/useClientForm"
import type { ClientFormProps } from "@/types/database"
// ...
export default function ClientForm({ client, onClose }: ClientFormProps) {
  const { form, isEdit, isPending, onSubmit } = useClientForm({
    client,
    onClose,
  })
```

Remove the now-duplicate local `ClientFormProps` interface declaration (the import replaces it).

Then update the `FormFooter` call at the bottom of the same file to swap labels by `isEdit`:

```tsx
// before
<FormFooter
  canSave={!isPending}
  isSubmitting={isPending}
  onCancel={onClose}
  submitLabel="Add client"
  submittingLabel="Adding…"
/>
```

```tsx
// after
<FormFooter
  canSave={!isPending}
  isSubmitting={isPending}
  onCancel={onClose}
  submitLabel={isEdit ? "Save changes" : "Add client"}
  submittingLabel={isEdit ? "Saving…" : "Adding…"}
/>
```

- [ ] **Step 4: Verify**

Run: `pnpm run typecheck`
Expected: no errors.

Run: `pnpm run lint`
Expected: no errors.

- [ ] **Step 5: Manual check**

Run `pnpm run dev`, open Clients, click "Add new client" — confirm the sheet still says "Add new client" / button says "Add client" and creating still works (this hasn't changed behavior, just confirms the create path still works after the edit branch was added). There's no edit entry point wired up yet (that's Task 11) — this step only confirms create isn't broken.

- [ ] **Step 6: Commit**

```bash
git add src/features/clients/useClientForm.ts src/features/clients/ClientForm.tsx
git commit -m "feat(clients): add edit-mode branch to useClientForm and ClientForm"
```

---

### Task 5: Client viewing history (API + hook)

**Files:**
- Modify: `src/api/apiViewings.ts`
- Create: `src/features/viewings/useClientViewings.ts`

**Interfaces:**
- Produces: `getClientViewingsApi(clientId: number): Promise<Viewing[]>`; hook `useClientViewings(clientId: number): { isLoading, viewings: Viewing[] }`. Consumed by Task 9 (`ClientDetailView`).

- [ ] **Step 1: Add `getClientViewingsApi`**

Modify `src/api/apiViewings.ts` — add after `getRecentViewingsApi`:

```ts
export async function getClientViewingsApi(
  clientId: number
): Promise<Viewing[]> {
  const { data, error } = await supabase
    .from("viewings")
    .select(
      `*,
       property:properties(title, city, neighborhood, main_image),
       client:clients(full_name, email, phone),
       agent:user_profiles!viewings_agent_id_user_profiles_fkey(full_name, avatar, email)`
    )
    .eq("client_id", clientId)
    .order("scheduled_at", { ascending: false })

  if (error) {
    console.error("getClientViewingsApi error:", error)
    throw new Error("Client viewings could not be loaded")
  }

  return data ?? []
}
```

- [ ] **Step 2: Verify**

Run: `pnpm run typecheck`
Expected: no errors.

- [ ] **Step 3: Create the hook**

Create `src/features/viewings/useClientViewings.ts`:

```ts
import { getClientViewingsApi } from "@/api/apiViewings"
import { useQuery } from "@tanstack/react-query"

export function useClientViewings(clientId: number) {
  const { isLoading, data: viewings } = useQuery({
    queryKey: ["client-viewings", clientId],
    queryFn: () => getClientViewingsApi(clientId),
    enabled: Number.isFinite(clientId) && clientId > 0,
  })

  return { isLoading, viewings: viewings ?? [] }
}
```

- [ ] **Step 4: Verify**

Run: `pnpm run typecheck`
Expected: no errors. (No consumer yet — exercised in Task 9.)

- [ ] **Step 5: Commit**

```bash
git add src/api/apiViewings.ts src/features/viewings/useClientViewings.ts
git commit -m "feat(viewings): add getClientViewingsApi and useClientViewings hook"
```

---

### Task 6: Detail-page supporting components

**Files:**
- Create: `src/features/clients/ClientAgentCard.tsx`
- Create: `src/features/clients/ClientEmptyState.tsx`

**Interfaces:**
- Consumes: `useClient` (Task 2), `UserAvatar` (`@/components/UserAvatar`), `Button` (`@/components/ui/button`).
- Produces: `<ClientAgentCard />`, `<ClientEmptyState />`. Consumed by Task 9 (`ClientDetailView`).

- [ ] **Step 1: Create `ClientAgentCard.tsx`**

Create `src/features/clients/ClientAgentCard.tsx`:

```tsx
import { Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/UserAvatar"
import { useClient } from "./useClient"

export default function ClientAgentCard() {
  const { client } = useClient()
  if (!client) return null

  const agentName = client.agent?.full_name || "Unassigned agent"
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <p className="text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
        Assigned agent
      </p>
      <div className="mt-3 flex items-center gap-3">
        <UserAvatar
          name={agentName}
          src={client.agent?.avatar ?? undefined}
          size="lg"
        />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{agentName}</p>
          {client.agent?.email && (
            <p className="truncate text-xs text-muted-foreground">
              {client.agent.email}
            </p>
          )}
        </div>
      </div>
      {client.agent?.email && (
        <Button
          asChild
          variant="outline"
          size="sm"
          className="mt-4 w-full gap-2"
        >
          <a href={`mailto:${client.agent.email}`}>
            <Mail className="h-3.5 w-3.5" />
            Send email
          </a>
        </Button>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create `ClientEmptyState.tsx`**

Create `src/features/clients/ClientEmptyState.tsx`:

```tsx
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function ClientEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-lg font-semibold">Client not found</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        This client may have been removed or you don't have access to it.
      </p>
      <Button asChild variant="outline" size="sm" className="mt-4 gap-2">
        <Link to="/clients">
          <ArrowLeft className="h-4 w-4" />
          Back to clients
        </Link>
      </Button>
    </div>
  )
}
```

- [ ] **Step 3: Verify**

Run: `pnpm run typecheck`
Expected: no errors. (No consumer yet — exercised in Task 9.)

- [ ] **Step 4: Commit**

```bash
git add src/features/clients/ClientAgentCard.tsx src/features/clients/ClientEmptyState.tsx
git commit -m "feat(clients): add ClientAgentCard and ClientEmptyState components"
```

---

### Task 7: `useClientDetails` orchestration hook

**Files:**
- Create: `src/features/clients/useClientDetails.ts`

**Interfaces:**
- Consumes: `useClient` (Task 2), `useDeleteClient` (existing).
- Produces: `useClientDetails(): { isLoading, client, editOpen, deleteOpen, isDeleting, setEditOpen, setDeleteOpen, handleConfirmDelete }`. Consumed by Task 9 (`ClientDetailView`).

- [ ] **Step 1: Create the hook**

Create `src/features/clients/useClientDetails.ts`:

```ts
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useClient } from "./useClient"
import { useDeleteClient } from "./useDeleteClient"

export function useClientDetails() {
  const { isLoading, client } = useClient()
  const navigate = useNavigate()

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { deleteClient, isPending: isDeleting } = useDeleteClient()

  // On a single-client screen, a successful delete leaves nothing to
  // show — close the dialog and return to the list.
  function handleConfirmDelete() {
    if (!client) return
    deleteClient(client.id, {
      onSuccess: () => {
        setDeleteOpen(false)
        navigate("/clients")
      },
    })
  }

  return {
    isLoading,
    client,
    editOpen,
    deleteOpen,
    isDeleting,
    setEditOpen,
    setDeleteOpen,
    handleConfirmDelete,
  }
}
```

- [ ] **Step 2: Verify**

Run: `pnpm run typecheck`
Expected: no errors. (No consumer yet — exercised in Task 9.)

- [ ] **Step 3: Commit**

```bash
git add src/features/clients/useClientDetails.ts
git commit -m "feat(clients): add useClientDetails orchestration hook"
```

---

### Task 8: `ClientDetailHeader` component

**Files:**
- Create: `src/features/clients/ClientDetailHeader.tsx`

**Interfaces:**
- Consumes: `useUser` (`@/features/auth/useUser`), `can` (`@/lib/permissions`, Task 1), `ClientStatusBadge` (existing).
- Produces: `<ClientDetailHeader client onEdit? onDelete? />`. Consumed by Task 9 (`ClientDetailView`).

- [ ] **Step 1: Create the component**

Create `src/features/clients/ClientDetailHeader.tsx`:

```tsx
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@/features/auth/useUser"
import { can } from "@/lib/permissions"
import type { Client } from "@/types/database"
import { Mail, MoreVertical, Pencil, Phone, Trash2 } from "lucide-react"
import ClientStatusBadge from "./ClientStatusBadge"

interface ClientDetailHeaderProps {
  client: Client
  onEdit?: (client: Client) => void
  onDelete?: (client: Client) => void
}

export default function ClientDetailHeader({
  client,
  onEdit,
  onDelete,
}: ClientDetailHeaderProps) {
  const { user } = useUser()
  const role = user?.user_profile?.role

  // Agent can edit/delete only their own; managers/admins can any
  const isOwner = client.assigned_agent_id === user?.id
  const canEdit = role
    ? can.editAnyClient(role) || (role === "agent" && isOwner)
    : false
  const canDelete = role
    ? can.deleteClient(role) || (role === "agent" && isOwner)
    : false

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ClientStatusBadge status={client.status} />

        {(canEdit || canDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 shadow-sm backdrop-blur-sm transition-colors data-[state=open]:bg-muted"
                aria-label="Client actions"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {canEdit && onEdit && (
                <>
                  <DropdownMenuLabel className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Manage
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => onEdit(client)}
                    className="gap-2 text-sm"
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                    Edit details
                  </DropdownMenuItem>
                </>
              )}

              {canDelete && onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(client)}
                    className="gap-2 text-sm text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete client
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <h1 className="mt-3 text-2xl font-bold tracking-tight">
        {client.full_name}
      </h1>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Mail className="h-3.5 w-3.5" />
          {client.email}
        </span>
        {client.phone && (
          <span className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" />
            {client.phone}
          </span>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Run: `pnpm run typecheck`
Expected: no errors. (No consumer yet — exercised in Task 9.)

- [ ] **Step 3: Commit**

```bash
git add src/features/clients/ClientDetailHeader.tsx
git commit -m "feat(clients): add ClientDetailHeader component"
```

---

### Task 9: `ClientDetailView` assembly + routing

**Files:**
- Modify: `src/features/clients/ClientDetailView.tsx` (replaces the empty stub)
- Create: `src/pages/Client.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: everything from Tasks 2–8 (`useClientDetails`, `ClientDetailHeader`, `ClientAgentCard`, `ClientEmptyState`, `useClientViewings`, `ClientForm`), plus existing `BackLink`, `ConfirmDelete`, `FormSheet`, `Spinner`, `ViewingStatusBadge`, `formatBudgetRange`/`formatViewingDate`/`formatViewingTime` (`@/lib/helpers`).
- Produces: `<ClientDetailView />`, `<Client />` page, and the fixed `/clients/:clientId` route. This is the task that makes the whole feature reachable end-to-end.

- [ ] **Step 1: Write `ClientDetailView.tsx`**

Replace the full contents of `src/features/clients/ClientDetailView.tsx` (currently the empty/garbled stub):

```tsx
import BackLink from "@/components/BackLink"
import ConfirmDelete from "@/components/ConfirmDelete"
import FormSheet from "@/components/form-components/FormSheet"
import Spinner from "@/components/Spinner"
import { useClientViewings } from "@/features/viewings/useClientViewings"
import ViewingStatusBadge from "@/features/viewings/ViewingStatusBadge"
import { formatBudgetRange, formatViewingDate, formatViewingTime } from "@/lib/helpers"
import { Globe } from "lucide-react"
import ClientAgentCard from "./ClientAgentCard"
import ClientDetailHeader from "./ClientDetailHeader"
import ClientEmptyState from "./ClientEmptyState"
import ClientForm from "./ClientForm"
import { useClientDetails } from "./useClientDetails"

export default function ClientDetailView() {
  const {
    isLoading,
    client,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    isDeleting,
    handleConfirmDelete,
  } = useClientDetails()

  const { viewings, isLoading: isLoadingViewings } = useClientViewings(
    client?.id ?? 0
  )

  if (isLoading) return <Spinner label="Loading client" />
  if (!client) return <ClientEmptyState />

  return (
    <div className="group space-y-6">
      <BackLink route="clients" label="Back to clients" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="space-y-6">
          <ClientDetailHeader
            client={client}
            onEdit={() => setEditOpen(true)}
            onDelete={() => setDeleteOpen(true)}
          />

          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <p className="text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Requirements
            </p>
            <div className="mt-3 space-y-2">
              <p className="tabular text-sm font-medium">
                {formatBudgetRange(client.budget_min, client.budget_max)}
              </p>
              {client.nationality && (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Globe className="h-3.5 w-3.5 shrink-0" />
                  {client.nationality}
                </p>
              )}
              {client.preferred_type && (
                <p className="text-sm">
                  Prefers{" "}
                  <span className="font-medium">{client.preferred_type}</span>
                </p>
              )}
              {client.preferred_locations &&
                client.preferred_locations.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {client.preferred_locations.join(", ")}
                  </p>
                )}
            </div>
          </div>

          {client.notes && (
            <div className="rounded-2xl border bg-card p-5 shadow-card">
              <p className="text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                Notes
              </p>
              <p className="mt-3 text-sm whitespace-pre-line text-muted-foreground">
                {client.notes}
              </p>
            </div>
          )}

          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <p className="text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Viewing history
            </p>
            {isLoadingViewings ? (
              <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
            ) : viewings.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No viewings yet.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {viewings.map((viewing) => (
                  <li
                    key={viewing.id}
                    className="flex items-center justify-between gap-3 border-t border-border/60 pt-3 first:border-t-0 first:pt-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {viewing.property?.title ?? "Unknown property"}
                      </p>
                      <p className="tabular text-xs text-muted-foreground">
                        {formatViewingDate(viewing.scheduled_at)} ·{" "}
                        {formatViewingTime(viewing.scheduled_at)}
                      </p>
                    </div>
                    <ViewingStatusBadge status={viewing.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sticky sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <ClientAgentCard />
        </aside>
      </div>

      <FormSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        size="md"
        title="Edit client"
        description="Update this client's details below."
      >
        <ClientForm client={client} onClose={() => setEditOpen(false)} />
      </FormSheet>

      <ConfirmDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
        title="Delete this client?"
        description="This will also delete all viewings scheduled for this client. This action can't be undone."
      />
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Run: `pnpm run typecheck`
Expected: no errors.

- [ ] **Step 3: Create `pages/Client.tsx`**

Create `src/pages/Client.tsx`:

```tsx
import ClientDetailView from "@/features/clients/ClientDetailView"

export default function Client() {
  return <ClientDetailView />
}
```

- [ ] **Step 4: Fix the route in `App.tsx`**

Modify `src/App.tsx` — add the lazy import next to the other page imports:

```tsx
// before
const Clients = lazy(() => import("@/pages/Clients"))
```

```tsx
// after
const Clients = lazy(() => import("@/pages/Clients"))
const Client = lazy(() => import("@/pages/Client"))
```

And fix the route element:

```tsx
// before
<Route path="/clients/:clientId" element={<Agent />} />
```

```tsx
// after
<Route path="/clients/:clientId" element={<Client />} />
```

Do not remove the `Agent` import — it's still used by `/agents/:userId`.

- [ ] **Step 5: Verify**

Run: `pnpm run typecheck`
Expected: no errors.

Run: `pnpm run lint`
Expected: no errors.

- [ ] **Step 6: Manual check**

Run `pnpm run dev`. Navigate directly to `/clients/<id>` for a real client ID from the `clients` table (check via `pnpm dlx supabase` or just note one from the Clients table in the UI). Confirm:
- The page shows the client's name, status, contact info, budget, preferences, notes (if any), viewing history (or "No viewings yet"), and an assigned-agent card — not a team-member profile.
- Navigating to a clearly invalid ID (e.g. `/clients/999999`) shows "Client not found" with a link back to `/clients`, not a crash.

- [ ] **Step 7: Commit**

```bash
git add src/features/clients/ClientDetailView.tsx src/pages/Client.tsx src/App.tsx
git commit -m "fix(clients): route /clients/:clientId to a real client detail page"
```

---

### Task 10: Navigation from the clients table

**Files:**
- Modify: `src/features/clients/ClientRow.tsx`

**Interfaces:**
- Consumes: `useNavigate` (react-router-dom), `useUser` (`@/features/auth/useUser`), `can` (Task 1).
- Produces: clicking a client's name in `ClientsTable` navigates to `/clients/:id`; the row's actions dropdown gains a permission-gated "Edit details" item and gates "Delete client" by `canDelete` (previously ungated). Adds an `onEdit` prop, consumed by Task 11.

- [ ] **Step 1: Rewrite `ClientRow.tsx`**

Replace the full contents of `src/features/clients/ClientRow.tsx`:

```tsx
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import UserAvatar from "@/components/UserAvatar"
import { useUser } from "@/features/auth/useUser"
import { can } from "@/lib/permissions"
import type { Client, ClientStatus } from "@/types/database"
import {
  CheckCircle,
  Circle,
  Mail,
  MinusCircle,
  MoreHorizontal,
  Pencil,
  Phone,
  Trash2,
  XCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import BudgetRange from "./BudgetRange"

interface ClientRowProps {
  client: Client
  budgetCeiling: number
  onEdit?: (client: Client) => void
  onStatusChange?: (client: Client, status: ClientStatus) => void
  onDelete?: (client: Client) => void
}

export default function ClientRow({
  client,
  budgetCeiling,
  onEdit,
  onDelete,
  onStatusChange,
}: ClientRowProps) {
  const { agent } = client
  const navigate = useNavigate()
  const { user } = useUser()
  const role = user?.user_profile?.role

  // Agent can edit/delete only their own; managers/admins can any
  const isOwner = client.assigned_agent_id === user?.id
  const canEdit = role
    ? can.editAnyClient(role) || (role === "agent" && isOwner)
    : false
  const canDelete = role
    ? can.deleteClient(role) || (role === "agent" && isOwner)
    : false

  function goToDetail() {
    navigate(`/clients/${client.id}`)
  }

  return (
    <TableRow className="group">
      {/* Client */}
      <TableCell>
        <button
          onClick={goToDetail}
          className="flex items-center gap-3 text-left"
        >
          <UserAvatar name={client.full_name} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium hover:underline">
              {client.full_name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {client.nationality ?? "—"}
            </p>
          </div>
        </button>
      </TableCell>

      {/* Contact */}
      <TableCell>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            <Mail className="h-3 w-3 shrink-0" />
            {client.email}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            <Phone className="h-3 w-3 shrink-0" />
            {client.phone ?? "Not provided"}
          </p>
        </div>
      </TableCell>

      {/* Budget */}
      <TableCell>
        <BudgetRange
          min={client.budget_min}
          max={client.budget_max}
          ceiling={budgetCeiling}
        />
      </TableCell>

      {/* Assigned agent */}
      <TableCell>
        <div className="flex min-w-0 items-center gap-2">
          <UserAvatar name={agent?.full_name} src={agent?.avatar} size="xs" />
          <span className="truncate text-sm">
            {agent?.full_name ?? "Unassigned"}
          </span>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="pr-4 text-right">
        {(onEdit || onStatusChange || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
                aria-label="Client actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {canEdit && onEdit && (
                <>
                  <DropdownMenuItem
                    onClick={() => onEdit(client)}
                    className="gap-2 text-sm"
                  >
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    Edit details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              {onStatusChange && (
                <>
                  <DropdownMenuLabel className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Update status
                  </DropdownMenuLabel>

                  <DropdownMenuItem
                    onClick={() => onStatusChange(client, "active")}
                    className="gap-2 text-sm"
                  >
                    <Circle className="h-3.5 w-3.5 text-success" />
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onStatusChange(client, "closed-won")}
                    className="gap-2 text-sm"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-info" />
                    Closed — won
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onStatusChange(client, "closed-lost")}
                    className="gap-2 text-sm"
                  >
                    <XCircle className="h-3.5 w-3.5 text-destructive" />
                    Closed — lost
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onStatusChange(client, "inactive")}
                    className="gap-2 text-sm"
                  >
                    <MinusCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    Inactive
                  </DropdownMenuItem>
                </>
              )}

              {canDelete && onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(client)}
                    className="gap-2 text-sm text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete client
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  )
}
```

Note: `onStatusChange` remains ungated — no permission was defined for status changes (matches the approved spec, which only added `editAnyClient`/`deleteClient`).

- [ ] **Step 2: Verify**

Run: `pnpm run typecheck`
Expected: errors are expected here — `ClientStatusGroup.tsx` doesn't pass `onEdit` yet, and neither `ClientRow`'s new prop nor `ClientStatusGroup`'s prop types line up until Task 11. That's fine; Task 11 completes the chain. If your tool flags this, proceed to Task 11 before doing a clean typecheck.

- [ ] **Step 3: Commit**

```bash
git add src/features/clients/ClientRow.tsx
git commit -m "feat(clients): add detail-page navigation and permission-gated edit/delete to ClientRow"
```

---

### Task 11: Wire edit state through `ClientStatusGroup` and `ClientsTable`

**Files:**
- Modify: `src/features/clients/ClientStatusGroup.tsx`
- Modify: `src/features/clients/ClientsTable.tsx`

**Interfaces:**
- Consumes: `ClientRow`'s new `onEdit` prop (Task 10), `ClientForm` (Task 4), `FormSheet` (existing).
- Produces: a working "Edit details" action from the clients list, completing the chain from Task 10.

- [ ] **Step 1: Thread `onEdit` through `ClientStatusGroup.tsx`**

Modify `src/features/clients/ClientStatusGroup.tsx`:

```tsx
// before
interface ClientStatusGroupProps {
  status: ClientStatus
  clients: Client[]
  budgetCeiling: number
  onDelete?: (client: Client) => void
  onStatusChange: (client: Client, status: ClientStatus) => void
}

export default function ClientStatusGroup({
  status,
  clients,
  budgetCeiling,
  onDelete,
  onStatusChange,
}: ClientStatusGroupProps) {
```

```tsx
// after
interface ClientStatusGroupProps {
  status: ClientStatus
  clients: Client[]
  budgetCeiling: number
  onEdit?: (client: Client) => void
  onDelete?: (client: Client) => void
  onStatusChange: (client: Client, status: ClientStatus) => void
}

export default function ClientStatusGroup({
  status,
  clients,
  budgetCeiling,
  onEdit,
  onDelete,
  onStatusChange,
}: ClientStatusGroupProps) {
```

And in the same file, pass it down to `ClientRow`:

```tsx
// before
{open &&
  clients.map((client) => (
    <ClientRow
      key={client.id}
      client={client}
      budgetCeiling={budgetCeiling}
      onDelete={onDelete}
      onStatusChange={onStatusChange}
    />
  ))}
```

```tsx
// after
{open &&
  clients.map((client) => (
    <ClientRow
      key={client.id}
      client={client}
      budgetCeiling={budgetCeiling}
      onEdit={onEdit}
      onDelete={onDelete}
      onStatusChange={onStatusChange}
    />
  ))}
```

- [ ] **Step 2: Verify**

Run: `pnpm run typecheck`
Expected: no errors now that `ClientRow`'s `onEdit` prop (Task 10) has a source.

- [ ] **Step 3: Add edit-sheet state and wiring to `ClientsTable.tsx`**

Modify `src/features/clients/ClientsTable.tsx` — add the `FormSheet` import and the new state:

```tsx
// before
import ConfirmDelete from "@/components/ConfirmDelete"
import CreateButton from "@/components/CreateButton"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Client, ClientStatus } from "@/types/database"
import { useState } from "react"
import ClientForm from "./ClientForm"
import ClientRowSkeleton from "./ClientRowSkeleton"
import ClientStatusGroup from "./ClientStatusGroup"
import ClientsEmptyState from "./ClientsEmptyState"
import { useClients } from "./useClients"
import { useDeleteClient } from "./useDeleteClient"
```

```tsx
// after
import ConfirmDelete from "@/components/ConfirmDelete"
import CreateButton from "@/components/CreateButton"
import FormSheet from "@/components/form-components/FormSheet"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Client, ClientStatus } from "@/types/database"
import { useState } from "react"
import ClientForm from "./ClientForm"
import ClientRowSkeleton from "./ClientRowSkeleton"
import ClientStatusGroup from "./ClientStatusGroup"
import ClientsEmptyState from "./ClientsEmptyState"
import { useClients } from "./useClients"
import { useDeleteClient } from "./useDeleteClient"
```

Inside the component body, add the new state and handler right after the existing `deleteTarget` state:

```tsx
// before
const { isLoading, clients } = useClients()
const { isPending: isDeleting, deleteClient } = useDeleteClient()
const [deleteTarget, setDeleteTarget] = useState<Client | undefined>()
const { updateClient } = useUpdateClient()
```

```tsx
// after
const { isLoading, clients } = useClients()
const { isPending: isDeleting, deleteClient } = useDeleteClient()
const [deleteTarget, setDeleteTarget] = useState<Client | undefined>()
const [editClient, setEditClient] = useState<Client | undefined>()
const [editOpen, setEditOpen] = useState(false)
const { updateStatus } = useUpdateClientStatus()
```

(The `useUpdateClient` → `useUpdateClientStatus` import/rename here was already done in Task 3 — this step is adding the `editClient`/`editOpen` lines alongside it.)

Add a `handleEdit` function next to the existing `handleStatusChange`:

```tsx
function handleStatusChange(client: Client, status: ClientStatus) {
  updateStatus({ id: client.id, status })
}

function handleEdit(client: Client) {
  setEditClient(client)
  setEditOpen(true)
}
```

Pass `onEdit` to `ClientStatusGroup`:

```tsx
// before
<ClientStatusGroup
  key={status}
  status={status}
  clients={grouped[status] ?? []}
  budgetCeiling={budgetCeiling}
  onStatusChange={handleStatusChange}
  onDelete={setDeleteTarget}
/>
```

```tsx
// after
<ClientStatusGroup
  key={status}
  status={status}
  clients={grouped[status] ?? []}
  budgetCeiling={budgetCeiling}
  onEdit={handleEdit}
  onStatusChange={handleStatusChange}
  onDelete={setDeleteTarget}
/>
```

Add the edit `FormSheet` right after the closing `</div>` of the content block and before the `ConfirmDelete`:

```tsx
<FormSheet
  open={editOpen}
  onOpenChange={setEditOpen}
  size="md"
  title="Edit client"
  description="Update this client's details below."
>
  <ClientForm client={editClient} onClose={() => setEditOpen(false)} />
</FormSheet>

<ConfirmDelete
  open={Boolean(deleteTarget)}
  onOpenChange={(open) => !open && setDeleteTarget(undefined)}
  onConfirm={handleConfirmDelete}
  isPending={isDeleting}
  title="Delete this client?"
  description="This will also delete all viewings scheduled for this client. This action can't be undone."
/>
```

- [ ] **Step 4: Verify**

Run: `pnpm run typecheck`
Expected: no errors.

Run: `pnpm run lint`
Expected: no errors.

- [ ] **Step 5: Manual check**

Run `pnpm run dev`, go to Clients. As a role with `editAnyClient`/`deleteClient` access (admin or manager test user), confirm:
- A client row's actions menu shows "Edit details" above "Update status".
- Clicking it opens a sheet titled "Edit client" pre-filled with that client's data; changing a field and saving shows "Client successfully updated" and the row reflects the change.
- "Delete client" still works and still shows the "will also delete all viewings" confirmation.

If you only have an agent test user available, confirm instead that edit/delete only appear on clients where `assigned_agent_id` matches that agent, and are absent on other agents' clients (status-change stays visible on all — see the note in Task 10).

- [ ] **Step 6: Commit**

```bash
git add src/features/clients/ClientStatusGroup.tsx src/features/clients/ClientsTable.tsx
git commit -m "feat(clients): wire edit-details sheet through ClientsTable and ClientStatusGroup"
```

---

### Task 12: End-to-end manual verification

**Files:** none (verification only)

**Interfaces:** none — this task exercises everything from Tasks 1–11 together.

- [ ] **Step 1: Full typecheck + lint pass**

Run: `pnpm run typecheck`
Expected: no errors.

Run: `pnpm run lint`
Expected: no errors.

- [ ] **Step 2: Build check**

Run: `pnpm run build`
Expected: build completes with no errors (this also catches anything `tsc --noEmit` alone might miss in the Vite build graph).

- [ ] **Step 3: Manual QA checklist**

Run `pnpm run dev` and, in the browser:

1. From `/clients`, click a client's name → lands on `/clients/:id` showing that client's own detail page (not a team-member profile).
2. On the detail page, the sidebar shows the correct assigned agent (or "Unassigned agent" if `assigned_agent_id` is null).
3. The viewing-history section lists only viewings for that specific client, newest first, and shows "No viewings yet" for a client with none.
4. Visiting `/clients/999999` (or any ID with no matching row) shows the "Client not found" empty state, not a crash or infinite spinner.
5. Edit and delete from the detail page match what's available from the table row for the same client and role (no discrepancy between the two entry points).
6. Log in as (or otherwise confirm the logic for) an agent role and verify they cannot edit/delete a client assigned to a different agent, from either the table or a directly-visited detail URL — the actions should simply not render.
7. Confirm `/agents/:userId` still works and still shows a team-member profile (unaffected by this change).

- [ ] **Step 4: Final commit (only if the manual pass surfaced fixes)**

If Step 3 found nothing to fix, there's nothing to commit here — Task 11's commit is the last one. If it did surface a small fix, commit it individually with a message describing what broke and why.

---

## Summary of hook/file renames (for the implementer's reference)

| Before | After |
|---|---|
| `useUpdateClient.ts` returning `{ isPending, updateClient }` (status-only) | `useUpdateClientStatus.ts` returning `{ isPending, updateStatus }` |
| *(did not exist)* | `useUpdateClient.ts` returning `{ isPending, updateClient }` (full edit, new mutation shape: `updateClient({ newClient, id })`) |
