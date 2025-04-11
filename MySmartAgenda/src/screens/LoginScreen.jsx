import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { toast } from "sonner-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const checkSession = async () => {
      try {
        const userId = await AsyncStorage.getItem("@user_id");
        if (userId) {
          navigation.replace("Home");
        }
      } catch (error) {
        console.log("Error al verificar sesión:", error);
      }
    };

    checkSession();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Por favor ingrese un correo válido");
      return;
    }

    try {
      // Verificar usuario en AsyncStorage
      const usersJSON = await AsyncStorage.getItem("@users");
      const users = usersJSON ? JSON.parse(usersJSON) : [];

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // Guardar ID de sesión
        await AsyncStorage.setItem("@user_id", user.id);
        navigation.replace("Home");
      } else {
        toast.error("Correo o contraseña incorrectos");
      }
    } catch (error) {
      toast.error("Error al iniciar sesión");
      console.error(error);
    }
  };

  const goToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/agenda.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>My Smart Agenda</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#000000"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#000000"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerLink} onPress={goToRegister}>
          <Text style={styles.registerText}>
            ¿No tienes una cuenta? Regístrate
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    paddingVertical: 20,
    fontSize: 25,
    color: "#09f",
    fontWeight: "bold",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    color: "#4A90E2",
    fontSize: 16,
  },
});
