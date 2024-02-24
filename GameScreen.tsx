import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import Card from './Card';

const shuffleArray = (array: Array<any>) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

interface CardData {
  id: string;
  image: any; 
}

const generateCards = () => {
  const cardImages = [
    require('./imagenes/2_trebol.png'),
    require('./imagenes/2.png'),
    require('./imagenes/B.png'),
    require('./imagenes/K.png'),
    require('./imagenes/3_trebol.png'),
    require('./imagenes/3.png'),
  ];
  const shuffledImages = shuffleArray(cardImages);
  const duplicatedImages = [...shuffledImages, ...shuffledImages];
  return shuffleArray(duplicatedImages).map((image, index) => ({
    id: index.toString(),
    image,
  }));
};

const GameScreen = () => {
  const [cards, setCards] = useState<CardData[]>(generateCards());
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastCardId, setLastCardId] = useState<string | null>(null);
  const [lives, setLives] = useState(25);

  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    if (matchedPairs.length === cards.length) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => {
        resetGame();
        fadeAnim.setValue(1);
      });
    }
  }, [fadeAnim, matchedPairs, cards.length]);

  const handleCardPress = (index: number) => {
    setAttempts(attempts + 1);

    if (flippedIndices.length < 2 && !flippedIndices.includes(index) && !matchedPairs.includes(cards[index].id)) {
      setFlippedIndices((prevFlipped) => [...prevFlipped, index]);

      if (lastCardId !== null && lastCardId !== cards[index].id) {
        const lastCardIndex = cards.findIndex((card) => card.id === lastCardId);

        if (cards[lastCardIndex].image === cards[index].image) {
          setMatchedPairs((prevMatched) => [...prevMatched, cards[lastCardIndex].id, cards[index].id]);
          setFlippedIndices([]);
          setScore((prevScore) => {
            const newScore = streak > 0 ? prevScore + 2 ** streak : prevScore + 1;
            setStreak((prevStreak) => prevStreak + 1);
            return newScore;
          });
        } else {
          setLives((prevLives) => prevLives - 1);

          setTimeout(() => {
            setFlippedIndices([]);

            if (lives === 0) {
              resetGame();
            }
          }, 1000);
        }
      }

      setLastCardId(cards[index].id);
    }
  };

  const isCardFlipped = (index: number) => {
    return flippedIndices.includes(index) || matchedPairs.includes(cards[index].id);
  };

  const resetGame = () => {
    setCards(generateCards());
    setFlippedIndices([]);
    setMatchedPairs([]);
    setAttempts(0);
    setScore(0);
    setStreak(0);
    setLastCardId(null);
    setLives(25);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.gameContainer, opacity: fadeAnim }}>
        <Text style={styles.scoreText}>Puntos: {score}</Text>
        <View style={styles.livesContainer}>
          <Image source={require('./imagenes/cora.png')} style={styles.heartImage} />
          <Text style={styles.livesText}>{lives}</Text>
        </View>
        <FlatList
          data={cards}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Card
              card={item}
              onPress={() => handleCardPress(index)}
              isFlipped={isCardFlipped(index)}
            />
          )}
        />
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Image source={require('./imagenes/reset.png')} style={styles.resetButtonImage} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#008000', 
  },
  gameContainer: {
    width: '80%',
    alignItems: 'center', 
  },
  scoreText: {
    fontSize: 24, 
    fontFamily: 'Arial', 
    color: 'white', 
    marginBottom: 10, 
  },
  livesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  heartImage: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  livesText: {
    fontSize: 20,
    fontFamily: 'Arial',
    color: 'white',
  },
  resetButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 20, 
  },
  resetButtonImage: {
    width: 30,
    height: 30,
  },
});
export default GameScreen;