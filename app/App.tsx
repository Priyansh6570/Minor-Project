import React, { useState, useEffect, useRef } from "react";
import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import server from "./components/Server";
import ProgressIndicator from "./components/ProgressIndicator";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
  },
  resultImg: {
    position: 'absolute',
    top: '10%',
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "80%",
    resizeMode: 'contain',
  },
});

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [pressed, setPressed] = useState(false);
  const [pasting, setPasting] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      server.ping();
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(cameraStatus === "granted");
      await ImagePicker.requestCameraPermissionsAsync();
    })();
  }, []);

  const pickImage = async () => {
    setPressed(true);
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    
    if (!result.canceled) {
      const processedImageUri = await server.cut(result.assets[0].uri);
      setProcessedImage(processedImageUri);
    }
  };
  
  const pasteImage = async () => {
    setPasting(true);
    if (processedImage) {
      const response = await server.paste(processedImage);
      console.log(response);
      setPressed(false);
      setPasting(false);
      setProcessedImage(null);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.cameraContainer} ref={cameraRef} type={Camera.Constants.Type.back}>
        {/* {(processedImage && pressed)? ( */}
          <Image
            source={{ uri: processedImage || '/' }}
            style={styles.resultImg}
          />
        {/* ): null} */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          {processedImage && (
            <TouchableOpacity style={styles.button} onPress={pasteImage}>
              <Text style={styles.buttonText}>Paste</Text>
            </TouchableOpacity>
          )}
        </View>
      </Camera>
      {(pressed && !processedImage) || pasting ? <ProgressIndicator /> : null }
    </View>
  );
}
