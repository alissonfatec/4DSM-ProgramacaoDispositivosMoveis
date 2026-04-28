import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario]   = useState(null);
  const [loading, setLoading]   = useState(true); // checando sessão salva

  // Ao abrir o app: verifica se já há sessão salva
  useEffect(() => {
    async function restaurarSessao() {
      try {
        const usuarioSalvo = await AsyncStorage.getItem('@appscholar:usuario');
        if (usuarioSalvo) {
          setUsuario(JSON.parse(usuarioSalvo));
        }
      } catch (err) {
        console.error('Erro ao restaurar sessão:', err);
      } finally {
        setLoading(false);
      }
    }
    restaurarSessao();
  }, []);

  async function login(email, senha) {
    const response = await authService.login(email, senha);
    const { token, usuario: dadosUsuario } = response.data;

    await AsyncStorage.setItem('@appscholar:token',   token);
    await AsyncStorage.setItem('@appscholar:usuario', JSON.stringify(dadosUsuario));

    setUsuario(dadosUsuario);
    return dadosUsuario;
  }

  async function logout() {
    await AsyncStorage.multiRemove(['@appscholar:token', '@appscholar:usuario']);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado — useAuth() em qualquer tela
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
