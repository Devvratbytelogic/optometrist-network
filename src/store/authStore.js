import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ROLES, REGISTRATION_STATUS } from '../lib/constants'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),

      isAdmin: () => {
        const state = useAuthStore.getState()
        return state.user?.role === ROLES.ADMIN
      },
      isOptometrist: () => {
        const state = useAuthStore.getState()
        return state.user?.role === ROLES.OPTOMETRIST
      },
      isApprovedOptometrist: () => {
        const state = useAuthStore.getState()
        return state.user?.role === ROLES.OPTOMETRIST && state.user?.registrationStatus === REGISTRATION_STATUS.APPROVED
      },
    }),
    { name: 'optometrist-network-auth' }
  )
)
