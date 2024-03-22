// src/stores/auth.ts

import { defineStore } from 'pinia'

interface AuthState {
  _token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    _token: null
  }),
  actions: {
    setToken(token: string) {
      localStorage.setItem('auth.token', token)
      this._token = token
    },
    logout() {
      localStorage.removeItem('auth.token')
      this._token = null
    }
  },
  getters: {
    token(): string | null {
      if (!this._token) {
        this._token = localStorage.getItem('auth.token') || ''
      }
      return this._token
    },
    isAuthenticated(): boolean {
      return !!this._token
    }
  }
})
