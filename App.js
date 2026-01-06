import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';

export default function App() {

  const [position, setPosition] = useState(null);

  useEffect(() => {
    const getPosition = async() => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let positionActuelle = await Location.getCurrentPositionAsync({});
      setPosition(positionActuelle);
    }

    getPosition();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Vous êtes ici:</Text>
      {position ? (
        <Text>Latitude: {position.coords.latitude} - Longitude: {position.coords.longitude}</Text>
      ) : (
        <Text>On attend que la position soit disponible</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
