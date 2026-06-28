import { defineStore } from 'pinia'
import axios from 'axios'

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
        },

        async fetchProfile() {
            const token = localStorage.getItem('token')
            if (!token) return
            try {
                const { data } = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (data.success && data.user) {
                    this.updateUser(data.user)
                }
            } catch (error) {
                console.error('Failed to refresh profile:', error)
            }
        }
    }
})