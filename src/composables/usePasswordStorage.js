const PASSWORD_STORAGE_KEY = 'smartmeet_user_password'

export function usePasswordStorage(storage = localStorage) {
  const getPassword = () => storage.getItem(PASSWORD_STORAGE_KEY)
  const setPassword = (password) => storage.setItem(PASSWORD_STORAGE_KEY, password)
  const hasPassword = () => Boolean(getPassword())
  const matchesPassword = (password) => !hasPassword() || getPassword() === password

  return {
    PASSWORD_STORAGE_KEY,
    getPassword,
    setPassword,
    hasPassword,
    matchesPassword
  }
}
