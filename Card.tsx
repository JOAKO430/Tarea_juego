import React from 'react';
import { TouchableOpacity, Image, StyleSheet, TouchableOpacityProps } from 'react-native';

interface CardProps extends TouchableOpacityProps {
  card: {
    id: string;
    image: any; 
  };
  isFlipped: boolean;
}

const Card: React.FC<CardProps> = ({ card, onPress, isFlipped }) => (
  <TouchableOpacity onPress={onPress} style={styles.card}>
    {isFlipped ? (
      <Image source={card.image} style={styles.image} />
    ) : (
      <Image source={require('./imagenes/reverso_carta.png')} style={styles.image} />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: 80,
    height: 120,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 90,
    resizeMode: 'contain',
  },
});

export default Card;
