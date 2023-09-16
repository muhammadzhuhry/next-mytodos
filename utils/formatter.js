export const setJWTAuth = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}