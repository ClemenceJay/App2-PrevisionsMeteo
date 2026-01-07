import React from 'react';
import { Button, Pressable, StyleSheet, Text, Image, View } from 'react-native';

const CardActuelle = ({ meteo, meteoIconeUrl, startReload }) => {

    // Arrondi de la température:
    let temp = Math.round(meteo.main.temp)
  
  return (
        <View style={styles.cardPrincipale}>
            <View style={styles.containerText}>
                <Text>{meteo.name}</Text>
                <Text>{meteo.weather[0].description}</Text>
            </View>
            <View style={styles.containerRow}>
                <Image source={{uri: meteoIconeUrl}} style={{width: 150, height: 150}}/>
                <Text style={styles.temperature}> {temp}°C</Text>
            </View>
            <Button
                title='relaod'
                color='#3e3f2cff'
                onPress={() => startReload(null)}/>
        </View>
    );
};

const styles = StyleSheet.create({
  containerRow: {
      flexDirection: 'row',
      gap: 5,
      justifyContent: 'space-between',
      alignItems:'center'
  },
  cardPrincipale: {
    backgroundColor: "#ffffffae",
    padding: 30,
    borderRadius: 15
  },
  temperature:{
    fontSize:30
  },
  containerText: {
    alignItems:'center'
  }
  
});

export default CardActuelle;