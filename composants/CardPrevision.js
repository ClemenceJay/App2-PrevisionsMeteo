import React from 'react';
import { Button, Pressable, StyleSheet, Text, Image, View } from 'react-native';

const CardPrevision = ({ prevision, langue }) => {

  // On récupère les données souhaitées
  let urlImage = `https://openweathermap.org/img/wn/${prevision.item.weather[0].icon}@2x.png`;
  let description = prevision.item.weather[0].description;
  // Gestion de la date pour récupèrer la date et l'heure au format souhaité
  const dateStr = prevision.item.dt_txt;
  const dateFull = new Date(dateStr.replace(" ", "T"));

  const jour = dateFull.toLocaleDateString(langue, {
    weekday: "long"
  });
  const date = dateFull.toLocaleDateString(langue, {
    day: "2-digit",
    month: "2-digit"
  });
  const heure = dateFull.toLocaleTimeString(langue, {
    hour: "numeric"
  });
  
  return (
        <View style={styles.cardJour}>
          <Text style={styles.date}>{jour.toUpperCase()} - {date}</Text>
          <Text style={styles.heure}>{heure}</Text>
          <Image source={{uri: urlImage}} style={{width: 100, height: 100}}/>
          <Text>{description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
  cardJour: {
    flexGrow: 0,
    flexShrink: 0,
    width: 200,
    justifyContent:'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#c1fff6c3',
    marginRight:10,
  },
  date: {
    fontWeight: 400,
    fontSize:20,
  },
  heure: {
    fontWeight: 500
  }
});

export default CardPrevision;