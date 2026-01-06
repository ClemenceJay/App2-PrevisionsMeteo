import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

export default function App() {

  const [position, setPosition] = useState(null);
  const [meteo, setMeteo] = useState(null);
  const [meteoIconeUrl, setMeteoIconeUrl] = useState(null);
  const apiKey = Constants.expoConfig.extra.openWeatherApiKey;

  useEffect(() => {
    const getPosition = async() => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let positionActuelle = await Location.getCurrentPositionAsync({});
      setPosition(positionActuelle);
    }

    getPosition();
  }, []);

  useEffect(() => {

    const getMeteo = async() => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(url);
        const dataMeteo = await response.json();
        setMeteo(dataMeteo);

        let iconeURL = `https://openweathermap.org/img/wn/${dataMeteo.weather[0].icon}@2x.png`;
        setMeteoIconeUrl(iconeURL);
      } catch (error) {
        console.log("Erreur API météo :", error);
      }
    }

    getMeteo(); 

  }, [position]);

  return (
    <View style={styles.container}>
      <Text>Vous êtes ici:</Text>
      {position ? (
        <Text>Latitude: {position.coords.latitude} - Longitude: {position.coords.longitude}</Text>
      ) : (
        <Text>On attend que la position soit disponible</Text>
      )}
      {meteo ? (
        <View>
          <Text>Vous êtes ici : {meteo.name}</Text>
          <Text>Il fait : {meteo.main.temp}°C</Text>
          <Text>Le temps : {meteo.weather[0].description}</Text>
          <Image source={{uri: meteoIconeUrl}} style={{width: 50, height: 50}}/>
        </View>
      ) : (
        <Text>On attend le retour API</Text>
      )}
      <Button
        title='relaod'
        color='#3e3f2cff'
        onPress={() => setPosition(null)}/>
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
