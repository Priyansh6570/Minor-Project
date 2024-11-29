import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import server from "../components/Server";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  button: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "black",
  },
  statusText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default function NewHomePage({ navigation }) {
  const [isConnected, setIsConnected] = useState(false);
  const [pcName, setPCName] = useState("");

  const checkHealth = async () => {
    try {
      const isHealthy = await server.healthCheck();
      if (isHealthy) {
        setIsConnected(true);
        setPCName(server.getPCName());
      } else {
        navigation.navigate("HomePage");
      }
    } catch {
      navigation.navigate("HomePage");
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <View style={styles.container}>
      {isConnected ? (
        <>
          <Text style={styles.statusText}>
            Connected to: {pcName || "Unknown PC"}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("CapturePage")}
          >
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("HomePage", { scanOnly: true })}
          >
            <Text style={styles.buttonText}>Connect to Another PC</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.statusText}>Checking backend connection...</Text>
      )}
    </View>
  );
}
