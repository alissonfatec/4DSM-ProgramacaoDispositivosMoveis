import React from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../hooks/useAuth"; // ← troca aqui
import { colors } from "../styles/theme";
import AlunosListScreen from "../screens/AlunosListScreen";
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import CadastroAlunosScreen from "../screens/CadastroAlunosScreen";
import CadastroProfessoresScreen from "../screens/CadastroProfessoresScreen";
import CadastroDisciplinasScreen from "../screens/CadastroDisciplinasScreen";
import BoletimScreen from "../screens/BoletimScreen";

const Stack = createNativeStackNavigator();

function PublicStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function PrivateStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "600", fontSize: 16 },
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
        options={{ title: "Cadastro de Alunos" }}
      />
      <Stack.Screen
        name="CadastroProfessores"
        component={CadastroProfessoresScreen}
        options={{ title: "Cadastro de Professores" }}
      />
      <Stack.Screen
        name="CadastroDisciplinas"
        component={CadastroDisciplinasScreen}
        options={{ title: "Cadastro de Disciplinas" }}
      />
      <Stack.Screen
        name="Boletim"
        component={BoletimScreen}
        options={{ title: "Boletim Acadêmico" }}
      />
      <Stack.Screen
        name="AlunosList"
        component={AlunosListScreen}
        options={{ title: "Alunos Cadastrados" }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { usuario, loading } = useAuth(); // ← troca aqui

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return usuario ? <PrivateStack /> : <PublicStack />;
}
