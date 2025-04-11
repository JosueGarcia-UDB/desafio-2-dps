import { StyleSheet, Text, View, ImageBackground, Dimensions, Animated, Easing } from 'react-native';
import React, { useRef, useEffect } from 'react';
import ImagePicker from '../components/ImagePicker';
import { LinearGradient } from 'expo-linear-gradient';

const { height, width } = Dimensions.get("window");

const Home = ({ onMediaCaptured }) => {
  // Animación para el overlay
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <LinearGradient 
      colors={['#0f2027', '#203a43', '#2c5364']} 
      style={styles.background}
      start={[0, 0]}
      end={[1, 1]}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Recuerdos-2025</Text>
        <Text style={styles.subtitle}>Toma una foto de recuerdo</Text>
        <View style={styles.card}>
          <ImagePicker onMediaCaptured={onMediaCaptured} />
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgb(0, 0, 0)', // Slightly lower opacity to let gradient shine through
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  title: {
    fontSize: width * 0.09, // Responsive text
    fontWeight: '900',
    color: '#FFD700', // Gold color
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 7,
  },
  subtitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 35,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 5,
  },
  card: {

    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});