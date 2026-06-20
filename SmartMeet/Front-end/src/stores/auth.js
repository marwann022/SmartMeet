import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null
    }),

    getters: {
        isAuthenticated: () => !!localStorage.getItem('token')
    },

    actions: {
        login(user) {
            this.user = user

            localStorage.setItem(
                'user',
                JSON.stringify(user)
            )
        },

        logout() {
            this.user = null

            localStorage.removeItem('user')
            localStorage.removeItem('token')
        }
    }
})