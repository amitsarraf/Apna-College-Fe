export const useAuth = () => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  return { isAuthenticated };
};
