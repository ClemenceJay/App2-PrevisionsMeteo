import React from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import CardPrevision from './CardPrevision';

const Previsions = ({ meteo5j, langue }) => {

  return (
    <FlatList
        data={meteo5j}
        style={styles.listePrevisions}
        horizontal={true}
        renderItem={(prevision) => {return <CardPrevision prevision={prevision} langue={langue}/>}}
    />
    );
  };
  
const styles = StyleSheet.create({
  text : {
    color: 'white',
  },
  listePrevisions: {
    margin: 20,
    flexGrow: 0,
    flexShrink: 1,
    marginRight: 5,
    marginLeft: 5,
    maxWidth: '90%',
    height: 200,
    borderRadius: 15
  }
});

export default Previsions;