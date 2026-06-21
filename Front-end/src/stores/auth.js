import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token
    },

    actions: {
        login(user, token) {
            this.user = user
            this.token = token

            localStorage.setItem(
                'user',
                JSON.stringify(user)
            )

            localStorage.setItem(
                'token',
                token
            )
        },

        updateUser(userData) {
            this.user = {
                ...this.user,
                ...userData
            }

            localStorage.setItem(
                'user',
                JSON.stringify(this.user)
            )
        },

        logout() {
            this.user = null
            this.token = null

            localStorage.removeItem('user')
            localStorage.removeItem('token')
        }
    }
})