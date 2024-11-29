import React, { useState, useEffect } from "react";
import { View, Animated, StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000090",
  },
  disk: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: "white",
    position: "absolute",
  },
  text: {
    marginTop: 210,
    color: "white",
    position: "relative",
    top: 10,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

interface ProgressIndicatorProps {
  status: string;
}

export default function ProgressIndicator({ status }: ProgressIndicatorProps) {
  const [rotationAnim1, setRotationAnim1] = useState(new Animated.Value(0));
  const [rotationAnim2, setRotationAnim2] = useState(new Animated.Value(0));

  useEffect(() => {
    const rotate1 = Animated.loop(
      Animated.timing(rotationAnim1, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    const rotate2 = Animated.loop(
      Animated.timing(rotationAnim2, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      })
    );

    rotate1.start();
    rotate2.start();
  }, [rotationAnim1, rotationAnim2]);

  const rotation1 = rotationAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const rotation2 = rotationAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.disk,
          {
            transform: [
              { rotateX: rotation1 },
              { rotateY: rotation1 },
            ],
          },
        ]}
      />
      
      <Animated.View
        style={[
          styles.disk,
          {
            transform: [
              { rotateX: rotation2 },
              { rotateY: rotation2 },
            ],
          },
        ]}
      />
      
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}