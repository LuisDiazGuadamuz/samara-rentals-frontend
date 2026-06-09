import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useMutation, useQuery } from '@apollo/client'
import {
  GET_ADMIN_DASHBOARD,
  CREATE_AGENT,
  UPDATE_AGENT,
  DELETE_AGENT,
  CREATE_PROPERTY,
  UPDATE_PROPERTY,
  DELETE_PROPERTY,
  UPDATE_PROPERTY_STATUS,
  UPDATE_USER_ROLE,
  DELETE_USER,
  DELETE_INQUIRY
} from '../graphql/admin'
import AdminTabs from '../components/admin/AdminTabs'
import AdminSummary from '../components/admin/AdminSummary'
import AdminUsers from '../components/admin/AdminUsers'
import AdminAgents from '../components/admin/AdminAgents'
import AdminProperties from '../components/admin/AdminProperties'
import AdminInquiries from '../components/admin/AdminInquiries'
import AgentFormModal from '../components/admin/AgentFormModal'
import PropertyFormModal from '../components/admin/PropertyFormModal'
import ConfirmDialog from '../components/admin/ConfirmDialog'

export default function AdminPage() {
  const { isAdmin, user } = useAuth()
  const [activeTab, setActiveTab] = useState('summary')
  const [agentModal, setAgentModal] = useState({ open: false, item: null })
  const [propertyModal, setPropertyModal] = useState({ open: false, item: null })
  const [confirmState, setConfirmState] = useState({ open: false, title: '', message: '', onConfirm: null })
  const [actionError, setActionError] = useState('')

  const { loading, error, data, refetch } = useQuery(GET_ADMIN_DASHBOARD, {
    fetchPolicy: 'cache-and-network',
    skip: !isAdmin,
    notifyOnNetworkStatusChange: true
  })

  const [createAgent, { loading: creatingAgent }] = useMutation(CREATE_AGENT)
  const [updateAgent, { loading: updatingAgent }] = useMutation(UPDATE_AGENT)
  const [deleteAgent] = useMutation(DELETE_AGENT)
  const [createProperty, { loading: creatingProperty }] = useMutation(CREATE_PROPERTY, {
    refetchQueries: [{ query: GET_ADMIN_DASHBOARD }],
    awaitRefetchQueries: true
  })
  const [updateProperty, { loading: updatingProperty }] = useMutation(UPDATE_PROPERTY, {
    refetchQueries: [{ query: GET_ADMIN_DASHBOARD }],
    awaitRefetchQueries: true
  })
  const [deleteProperty] = useMutation(DELETE_PROPERTY, {
    refetchQueries: [{ query: GET_ADMIN_DASHBOARD }],
    awaitRefetchQueries: true
  })
  const [updatePropertyStatus] = useMutation(UPDATE_PROPERTY_STATUS, {
    refetchQueries: [{ query: GET_ADMIN_DASHBOARD }],
    awaitRefetchQueries: true
  })
  const [updateUserRole] = useMutation(UPDATE_USER_ROLE)
  const [deleteUser] = useMutation(DELETE_USER)
  const [deleteInquiry] = useMutation(DELETE_INQUIRY)

  const counts = {
    users: data?.users?.length ?? 0,
    agents: data?.agents?.length ?? 0,
    properties: data?.properties?.length ?? 0,
    inquiries: data?.inquiries?.length ?? 0
  }

  const statusCounts = (data?.properties || []).reduce(
    (acc, property) => {
      const status = property.status || 'available'
      if (acc[status] !== undefined) acc[status] += 1
      return acc
    },
    { available: 0, sold: 0, reserved: 0 }
  )

  const refreshData = async () => {
    setActionError('')
    try {
      await refetch()
    } catch (refetchError) {
      setActionError(refetchError.message)
    }
  }

  const handleUpdateUserRole = async (userId, role) => {
    setActionError('')
    try {
      await updateUserRole({ variables: { userId, role } })
      await refreshData()
    } catch (mutationError) {
      setActionError(mutationError.message)
    }
  }

  const handleDeleteUser = (userToDelete) => {
    setConfirmState({
      open: true,
      title: 'Eliminar usuario',
      message: `Â¿Eliminar al usuario ${userToDelete.name}? Esta acciÃ³n no se puede deshacer.`,
      confirmLabel: 'Eliminar',
      onConfirm: async () => {
        try {
          await deleteUser({ variables: { id: userToDelete.id } })
          await refreshData()
        } catch (mutationError) {
          setActionError(mutationError.message)
        }
      }
    })
  }

  const handleCreateAgent = () => setAgentModal({ open: true, item: null })
  const handleEditAgent = (agent) => setAgentModal({ open: true, item: agent })
  const handleCloseAgentModal = () => setAgentModal({ open: false, item: null })

  const handleSubmitAgent = async (input) => {
    setActionError('')
    try {
      if (agentModal.item) {
        await updateAgent({ variables: { id: agentModal.item.id, input } })
      } else {
        await createAgent({ variables: { input } })
      }
      handleCloseAgentModal()
      await refreshData()
    } catch (mutationError) {
      setActionError(mutationError.message)
    }
  }

  const handleDeleteAgent = (agent) => {
    setConfirmState({
      open: true,
      title: 'Eliminar agente',
      message: `Â¿Eliminar al agente ${agent.name}? Esta acciÃ³n eliminarÃ¡ su acceso administrativo.`,
      confirmLabel: 'Eliminar',
      onConfirm: async () => {
        try {
          await deleteAgent({ variables: { id: agent.id } })
          await refreshData()
        } catch (mutationError) {
          setActionError(mutationError.message)
        }
      }
    })
  }

  const handleCreateProperty = () => setPropertyModal({ open: true, item: null })
  const handleEditProperty = (property) => setPropertyModal({ open: true, item: property })
  const handleClosePropertyModal = () => setPropertyModal({ open: false, item: null })

  const handleSubmitProperty = async (input) => {
    setActionError('')
    try {
      if (propertyModal.item) {
        await updateProperty({ variables: { id: propertyModal.item.id, input } })
      } else {
        await createProperty({ variables: { input } })
      }
      handleClosePropertyModal()
      await refreshData()
    } catch (mutationError) {
      setActionError(mutationError.message)
    }
  }

  const handleDeleteProperty = (property) => {
    setConfirmState({
      open: true,
      title: 'Eliminar propiedad',
      message: `Â¿Eliminar la propiedad "${property.title}"? Esta acciÃ³n no se puede deshacer.`,
      confirmLabel: 'Eliminar',
      onConfirm: async () => {
        try {
          await deleteProperty({ variables: { id: property.id } })
          await refreshData()
        } catch (mutationError) {
          setActionError(mutationError.message)
        }
      }
    })
  }

  const handleChangePropertyStatus = async (propertyId, status) => {
    setActionError('')
    try {
      await updatePropertyStatus({ variables: { id: propertyId, status } })
      await refreshData()
    } catch (mutationError) {
      setActionError(mutationError.message)
    }
  }

  const handleDeleteInquiry = (inquiry) => {
    setConfirmState({
      open: true,
      title: 'Eliminar solicitud',
      message: `Â¿Eliminar la solicitud de ${inquiry.name}? Esta acciÃ³n no se puede deshacer.`,
      confirmLabel: 'Eliminar',
      onConfirm: async () => {
        try {
          await deleteInquiry({ variables: { id: inquiry.id } })
          await refreshData()
        } catch (mutationError) {
          setActionError(mutationError.message)
        }
      }
    })
  }

  const closeConfirm = () => setConfirmState((prev) => ({ ...prev, open: false }))

  const handleConfirm = async () => {
    if (confirmState.onConfirm) {
      await confirmState.onConfirm()
    }
    closeConfirm()
  }

  if (!isAdmin) {
    return <div className="p-4">Acceso denegado.</div>
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-samara-ash">Panel administrativo</p>
          <h1 className="mt-2 text-3xl font-semibold text-samara-charcoal">Samara Rentals Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-samara-ash">
            Administra usuarios, agentes, propiedades y solicitudes desde una vista centralizada.
          </p>
        </div>
      </div>

      <div className="mb-6">
        <AdminTabs activeTab={activeTab} onSelect={setActiveTab} />
      </div>

      {actionError && (
        <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {loading && (
        <div className="rounded-3xl border border-samara-stone bg-samara-ivory p-6 text-samara-charcoal">Cargando datos del panel...</div>
      )}

      {!loading && error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">Error cargando datos: {error.message}</div>
      )}

      {!loading && !error && data && (
        <div className="space-y-8">
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <AdminSummary counts={counts} />
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-samara-stone bg-white p-6 shadow-sm">
                  <div className="text-sm uppercase tracking-[0.24em] text-samara-ash">Disponibles</div>
                  <p className="mt-4 text-3xl font-semibold text-samara-charcoal">{statusCounts.available}</p>
                </div>
                <div className="rounded-3xl border border-samara-stone bg-white p-6 shadow-sm">
                  <div className="text-sm uppercase tracking-[0.24em] text-samara-ash">Vendidas</div>
                  <p className="mt-4 text-3xl font-semibold text-samara-charcoal">{statusCounts.sold}</p>
                </div>
                <div className="rounded-3xl border border-samara-stone bg-white p-6 shadow-sm">
                  <div className="text-sm uppercase tracking-[0.24em] text-samara-ash">Reservadas</div>
                  <p className="mt-4 text-3xl font-semibold text-samara-charcoal">{statusCounts.reserved}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <AdminUsers
              users={data.users}
              loading={loading}
              error={error?.message}
              onRoleChange={handleUpdateUserRole}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {activeTab === 'agents' && (
            <AdminAgents
              agents={data.agents}
              loading={loading}
              error={error?.message}
              onCreate={handleCreateAgent}
              onEdit={handleEditAgent}
              onDelete={handleDeleteAgent}
            />
          )}

          {activeTab === 'properties' && (
            <AdminProperties
              properties={data.properties}
              agents={data.agents}
              loading={loading}
              error={error?.message}
              onCreate={handleCreateProperty}
              onEdit={handleEditProperty}
              onDelete={handleDeleteProperty}
              onStatusChange={handleChangePropertyStatus}
            />
          )}

          {activeTab === 'inquiries' && (
            <AdminInquiries
              inquiries={data.inquiries}
              loading={loading}
              error={error?.message}
              onDelete={handleDeleteInquiry}
            />
          )}
        </div>
      )}

      <AgentFormModal
        open={agentModal.open}
        initialData={agentModal.item}
        onClose={handleCloseAgentModal}
        onSubmit={handleSubmitAgent}
        isSaving={creatingAgent || updatingAgent}
        error={actionError}
      />

      <PropertyFormModal
        open={propertyModal.open}
        initialData={propertyModal.item}
        agents={data?.agents ?? []}
        onClose={handleClosePropertyModal}
        onSubmit={handleSubmitProperty}
        isSaving={creatingProperty || updatingProperty}
        error={actionError}
      />

      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
    </main>
  )
}


