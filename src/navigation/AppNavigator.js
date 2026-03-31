import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppContext } from '../context/AppContext';
import { colors } from '../styles/theme';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CadastroAlunosScreen from '../screens/CadastroAlunosScreen';
import CadastroProfessoresScreen from '../screens/CadastroProfessoresScreen';
import CadastroDisciplinasScreen from '../screens/CadastroDisciplinasScreen';
import BoletimScreen from '../screens/BoletimScreen';

const Stack = createNativeStackNavigator();

// Stack público — acessível SEM autenticação
function PublicStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

// Stack privado — só existe na árvore quando isAuthenticated === true
// Impossível navegar para cá sem estar logado, pois o componente não é montado
function PrivateStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600', fontSize: 16 },
        headerBackTitleVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CadastroAlunos"
        component={CadastroAlunosScreen}
        options={{ title: 'Cadastro de Alunos' }}
      />
      <Stack.Screen
        name="CadastroProfessores"
        component={CadastroProfessoresScreen}
        options={{ title: 'Cadastro de Professores' }}
      />
      <Stack.Screen
        name="CadastroDisciplinas"
        component={CadastroDisciplinasScreen}
        options={{ title: 'Cadastro de Disciplinas' }}
      />
      <Stack.Screen
        name="Boletim"
        component={BoletimScreen}
        options={{ title: 'Boletim Acadêmico' }}
      />
    </Stack.Navigator>
  );
}

// O AppNavigator lê isAuthenticated do contexto e decide qual Stack montar.
// Quando o valor muda (login/logout), o React Navigation troca os Stacks
// automaticamente e limpa o histórico — sem nenhum navigate() manual.
export default function AppNavigator() {
  const { isAuthenticated } = useAppContext();
  return isAuthenticated ? <PrivateStack /> : <PublicStack />;
}
