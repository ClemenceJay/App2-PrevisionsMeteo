import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, FlatList, ImageBackground, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { getLocales, getCalendars } from 'expo-localization';
import Previsions from './composants/Previsions';
import CardActuelle from './composants/CardActuelle';

const background = require('./assets/background.jpg');

export default function App() {

  const apiKey = Constants.expoConfig.extra.openWeatherApiKey;

  const [reload, setReload] = useState(false);
  const [langue, setLangue] = useState(null); //Code langue pour l'URL de l'API
  const [langueDate, setLangueDate] = useState(null); // Code langue la gestion de la date
  const [position, setPosition] = useState(null);
  const [meteo, setMeteo] = useState(null);
  const [meteoIconeUrl, setMeteoIconeUrl] = useState(null);
  const [meteo5j, setMeteo5j] = useState(null);


  const startReload = () => {
    setPosition(null);
    setReload(!reload);
  }

  useEffect(() => {
    // Récupération de la position du téléphone
    const getPosition = async() => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let positionActuelle = await Location.getCurrentPositionAsync({});
      setPosition(positionActuelle);
    }

    // Récupération de la langue de l'user
    const getLangue = () => {
      let langueDevice = getLocales();
      setLangue(langueDevice[0].languageCode);
      setLangueDate(langueDevice[0].languageTag)
    }

    getPosition();
    getLangue();
  }, [reload]);

  useEffect(() => {
    
    const getMeteo = async() => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      // URL d'appel à l'API dynamique selon la position et la langue de l'user
      let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=${langue}`;

      try {
        const response = await fetch(url);
        const dataMeteo = await response.json();
        setMeteo(dataMeteo);

        // Génération de l'URL de l'icone selon le code récupéré dans le résultat de l'appel à l'API
        let iconeURL = `https://openweathermap.org/img/wn/${dataMeteo.weather[0].icon}@2x.png`;
        setMeteoIconeUrl(iconeURL);
      } catch (error) {
        console.log("Erreur API météo :", error);
      }
    }
    
    const getPrevision5Jours = async() => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      // URL d'appel à l'API dynamique selon la position et la langue de l'user
      let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=${langue}`;

      try {
        const response = await fetch(url);
        const dataMeteo5j = await response.json();
        setMeteo5j(dataMeteo5j.list);
      } catch (error) {
        console.log("Erreur API météo :", error);
      }
    }

    getMeteo();
    getPrevision5Jours();

  }, [position]);

  return (
    <ImageBackground style={styles.container} source={background} resizeMode="cover">
      {position && meteo && meteo5j? (
        <View style={[styles.container, styles.transparent]}>
          <CardActuelle meteo={meteo} meteoIconeUrl={meteoIconeUrl} startReload={startReload}/>
          <Previsions meteo5j={meteo5j} langue={langueDate}/>
        </View>
      ) : (
        <View style={[styles.container, styles.transparent]}>
          <ActivityIndicator size="large" color="#ffd000ff"/>
          <Text style={styles.textLoader}>Encore un peu de patience, votre météo arrive...</Text>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  transparent: {
    backgroundColor:'transparent',
    gap:30
  },
  textLoader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#382304ff'
  }
});
