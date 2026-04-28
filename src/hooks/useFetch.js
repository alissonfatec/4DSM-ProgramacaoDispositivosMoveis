import { useState, useEffect, useCallback } from 'react';

/**
 * Hook genérico para chamadas de API.
 * 
 * @param {Function} serviceFn - função do service (ex: () => alunosService.listar())
 * @param {boolean} immediate  - se true, chama automaticamente ao montar o componente
 * 
 * @example
 * const { data, loading, error, execute } = useFetch(
 *   () => alunosService.listar(),
 *   true
 * );
 */
export function useFetch(serviceFn, immediate = false) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await serviceFn(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      const mensagem = err.response?.data?.error || 'Erro ao carregar dados';
      setError(mensagem);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [serviceFn]);

  useEffect(() => {
    if (immediate) execute();
  }, []);

  return { data, loading, error, execute };
}
