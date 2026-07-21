# Client Detail Page + Client Permission Parity

## Problem

`App.tsx` routes `/clients/:clientId` to the `Agent` page (`TeamMemberProfile role="agent"`) instead of a client detail view. A `ClientDetailView.tsx` file exists but is an empty stub — nothing imports or routes to it, and `ClientRow` has no navigation into it. Opening a client's detail page currently shows a team-member profile, not the client.

Separately, while building the fix it became clear that:

- Clients only support status updates today (`useUpdateClient` → `updateClientStatusApi`). There is no full-field edit path, unlike properties (`usePropertyForm`/`updatePropertyApi`).
- Client edit/delete actions have no permission gating anywhere (`ClientRow.tsx`, `ClientsTable.tsx`), unlike properties, which gate via `can.editAnyProperty`/`can.deleteProperty` plus an ownership check in `PropertyCard.tsx`.

This spec covers fixing the routing bug, building full client edit to reach parity with properties, and adding the missing permission gating.

## Entity model (for clarity — no code change)

`clients` are leads/customers, a distinct entity from the three user roles (`admin`, `manager`, `agent`). A client has `assigned_agent_id`, a foreign key to `user_profiles.user_id` — the agent responsible for that lead. The bug being fixed is exactly a mixup between these: the client-detail route was rendering an agent's profile page instead of the client's.

Role model, per `permissions.ts` and Supabase RLS (already enforced server-side, not re-implemented here): admins oversee everything, managers oversee agents, agents own clients assigned to them. RLS policies "Agents can manage clients" and "Users can view clients based on role" already scope which client rows a given user can read/write at the database level — this spec adds matching UI-level gating (hide/disable actions the user couldn't perform anyway) and does not change RLS.

## Design

### 1. Permissions (`src/lib/permissions.ts`)

Add two entries alongside the existing `viewAllClients`:

```ts
editAnyClient: (role: UserRole) => ["admin", "manager"].includes(role),
deleteClient: (role: UserRole) => ["admin", "manager"].includes(role),
```

Ownership for agents is computed at the call site (not in `permissions.ts`, matching how `PropertyCard.tsx` does it):

```ts
const isOwner = client.assigned_agent_id === user?.id
const canEdit = can.editAnyClient(role) || (role === "agent" && isOwner)
const canDelete = can.deleteClient(role) || (role === "agent" && isOwner)
```

Applied in both `ClientRow.tsx` (table actions dropdown) and `ClientDetailView.tsx` (detail page header actions), so behavior is identical in both places.

### 2. Data layer

**`src/api/apiClients.ts`** — add:

- `getClientApi(id: number): Promise<Client>` — single client + agent join (`user_profiles!clients_assigned_agent_id_user_profiles_fkey`), mirrors `getPropertyApi`.
- `updateClientApi(values: ClientFormValues, id: string): Promise<Client>` — full-field update, mirrors `updatePropertyApi` (no image-upload step; clients have no gallery).

**`src/api/apiViewings.ts`** — add:

- `getClientViewingsApi(clientId: number): Promise<Viewing[]>` — viewings for one client, with `property` (title, city, neighborhood, main_image) and `agent` (full_name, avatar) joins, ordered by `scheduled_at` descending. No pagination — this is a sidebar/section list, not the main viewings table.

**New hooks:**

- `src/features/clients/useClient.ts` — mirrors `useProperty.ts`: reads `clientId` from `useParams`, `useQuery(["client", id], () => getClientApi(id))`.
- `src/features/viewings/useClientViewings.ts` — `useQuery(["client-viewings", clientId], () => getClientViewingsApi(clientId))`, enabled only when `clientId` is defined.

**Rename:** `src/features/clients/useUpdateClient.ts` (current status-only mutation) → `useUpdateClientStatus.ts`. Its one call site, `ClientsTable.tsx`, updates its import and the destructured name it uses for the status-change handler. A new `src/features/clients/useUpdateClient.ts` is created for full-field edits, mirroring `useUpdateProperty.ts` (mutation over `updateClientApi`, invalidates `["clients"]` and `["client", id]` on success).

### 3. Full client edit

**`src/features/clients/useClientForm.ts`**: add a `client?: Client` param alongside the existing `onClose`. Add a `clientToFormValues(c: Client): ClientFormValues` mapper (numbers → strings for `budget_min`/`budget_max`, pass-through for the rest — mirrors `propertyToFormValues` in `usePropertyForm.ts`). Branch `onSubmit`: if `client` is present, call the new `useUpdateClient`'s `updateClient({ values, id: String(client.id) })`; otherwise `createClient` as today.

**`src/features/clients/ClientForm.tsx`**: add a `client?: Client` prop (the `ClientFormProps` interface already exists, unused, in `src/types/database.ts` — this wires it up), pass through to `useClientForm`. Submit button label: "Save changes" when editing, "Add client" when creating (mirrors `PropertyForm.tsx`'s `isEdit` label swap).

### 4. Detail page

**`src/features/clients/ClientDetailView.tsx`** (replaces the empty stub): structured like `PropertyDetails.tsx`.

- `BackLink route="clients" label="Back to clients"`.
- Header: client name, `ClientStatusBadge`, and an actions area (edit → opens `FormSheet` with `ClientForm`; delete → opens `ConfirmDelete`) rendered only when `canEdit`/`canDelete` are true per the permission rules above.
- Contact block: email, phone, nationality.
- `BudgetRange` (reused as-is), preferred type, preferred locations, notes.
- Sidebar: new `src/features/clients/ClientAgentCard.tsx`, mirroring `PropertyAgentCard.tsx` — shows the assigned agent's name/avatar/email with a "Send email" mailto action, or an "Unassigned" fallback state.
- Viewing history section: list from `useClientViewings`, each entry reusing `ViewingStatusBadge` and `formatViewingDate`/`formatViewingTime`; a simple empty state ("No viewings yet") when the list is empty.

**New `src/features/clients/useClientDetails.ts`** (mirrors `usePropertyDetails.ts`): owns `editOpen`/`deleteOpen` state, wires `useDeleteClient`, and on successful delete navigates to `/clients` (a single-client screen has nothing left to show after delete, same reasoning as `usePropertyDetails`).

**Not-found / no-access state**: new `src/features/clients/ClientEmptyState.tsx` (singular, matching the existing `PropertyEmptyState.tsx` / `PropertiesEmptyState.tsx` naming split — plural is the list-empty state, singular is the detail not-found state). Mirrors `PropertyEmptyState.tsx`: "Client not found", generic copy, link back to `/clients`. Shown when `useClient` resolves with no data. Deliberately covers both "the client doesn't exist" and "RLS denied this user access" without distinguishing between them in the UI, to avoid leaking which case it is.

**Routing**: new `src/pages/Client.tsx` (mirrors `pages/Property.tsx`, renders `<ClientDetailView />`). `App.tsx`'s `/clients/:clientId` route element changes from `<Agent />` to `<Client />`. No `RoleProtected` wrapper — same tier as `/clients` and `/properties/:propertyId` today, accessible to any authenticated role (agents need access to their own clients).

**Navigation into the page**: `ClientRow.tsx` — clicking the client name/avatar cell navigates to `/clients/:id` via `useNavigate`, with the actions-dropdown cell using its existing stopPropagation-equivalent isolation so the dropdown still works independently (same pattern `PropertyCard.tsx` uses for its clickable image + separate actions menu).

## Non-goals

- No changes to RLS policies or the database schema.
- No changes to the properties or viewings detail flows.
- No pagination on the client's viewing-history list (kept simple; revisit if a client accumulates a large viewing history).
- No changes to `ClientsTable.tsx`'s create-button gating (out of scope — this spec only adds gating to edit/delete actions that are net-new or being made role-aware for the first time).

## Files touched

```text
src/lib/permissions.ts                  (+2 permission checks)
src/api/apiClients.ts                   (+getClientApi, +updateClientApi)
src/api/apiViewings.ts                  (+getClientViewingsApi)
src/features/clients/useClient.ts       (new)
src/features/viewings/useClientViewings.ts (new)
src/features/clients/useUpdateClientStatus.ts (renamed from useUpdateClient.ts)
src/features/clients/useUpdateClient.ts (new — full edit, takes over the name)
src/features/clients/useClientForm.ts   (edit/create branch)
src/features/clients/ClientForm.tsx     (+client prop)
src/features/clients/ClientDetailView.tsx (replaces stub)
src/features/clients/ClientAgentCard.tsx (new)
src/features/clients/useClientDetails.ts (new)
src/features/clients/ClientEmptyState.tsx (new)
src/features/clients/ClientRow.tsx      (navigation + permission gating)
src/features/clients/ClientsTable.tsx   (update rename's call site)
src/pages/Client.tsx                    (new)
src/App.tsx                             (route element fix)
```
