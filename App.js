import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, FlatList } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { getLocales, getCalendars } from 'expo-localization';

export default function App() {

  const apiKey = Constants.expoConfig.extra.openWeatherApiKey;

  const [reload, setReload] = useState(false);
  const [langue, setLangue] = useState(null);
  const [position, setPosition] = useState(null);
  const [meteo, setMeteo] = useState(null);
  const [meteoIconeUrl, setMeteoIconeUrl] = useState(null);
  const [meteo5j, setMeteo5j] = useState(null);


  const startReload = () => {
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
    <View style={styles.container}>
      {position && meteo && meteo5j? (
        <View>
          <Text>Vous êtes ici : {meteo.name}</Text>
          <Text>Il fait : {meteo.main.temp}°C</Text>
          <Text>Le temps : {meteo.weather[0].description}</Text>
          <Image source={{uri: meteoIconeUrl}} style={{width: 50, height: 50}}/>
          <FlatList
            data={meteo5j}
            style={styles.listeGoal}
            renderItem={(jour) => {
              return <Text style={styles.texttest}>{jour.item.dt_txt}</Text>}}
          />
        </View>
      ) : (
        <Text>Les données chargent! Un peu de patience</Text>
      )}
      <Button
        title='relaod'
        color='#3e3f2cff'
        onPress={() => startReload(null)}/>
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
  listeGoal: {
    margin: 20,
    flexGrow: 0,
    flexShrink: 1,
    marginRight: 5,
    marginLeft: 5,
    maxHeight: '65%'
  },
  texttest: {
    color: '#ad1717ff',
    borderWidth: 2
  }
});
