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
