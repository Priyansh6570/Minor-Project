import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Camera } from "expo-camera";
import server from "../components/Server";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  button: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "black",
  },
  qrOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 250,
    height: 250,
    marginLeft: -125,
    marginTop: -125,
    borderWidth: 2,
    borderColor: "white",
  },
});

export default function HomePage({ navigation, route }) {
  const [isCameraActive, setIsCameraActive] = useState(
    route?.params?.scanOnly || false
  );

  const handleBarCodeScanned = async ({ data }) => {
    setIsCameraActive(false);
    if (data.startsWith("http://") || data.startsWith("https://")) {
      const [url, pcName] = data.split("|");
      server.updateURL(url, pcName || "Unknown PC");
      try {
        await server.ping();
        Alert.alert("Success", "Backend connected successfully!");
        navigation.navigate("NewHomePage");
      } catch (err) {
        Alert.alert("Error", "Unable to connect to the backend.");
      }
    } else {
      Alert.alert("Invalid QR Code", "Please scan a valid server URL.");
    }
  };

  return (
    <View style={styles.container}>
      {isCameraActive ? (
        <Camera style={styles.camera} onBarCodeScanned={handleBarCodeScanned}>
          <View style={styles.qrOverlay} />
        </Camera>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsCameraActive(true)}
        >
          <Text style={styles.buttonText}>Scan QR Code</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}