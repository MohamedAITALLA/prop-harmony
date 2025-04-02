
/**
 * Hook for managing authentication tokens
 */
export function useTokenManagement() {
  const getToken = (): string | null => {
    return localStorage.getItem("token");
  };

  const setToken = (token: string): void => {
    localStorage.setItem("token", token);
  };

  const removeToken = (): void => {
    localStorage.removeItem("token");
  };

  const hasToken = (): boolean => {
    return !!getToken();
  };

  return {
    getToken,
    setToken,
    removeToken,
    hasToken
  };
}
