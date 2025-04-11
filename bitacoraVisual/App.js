import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Main from './screens/Home';
import Gallery from './screens/Gallery';
import { Ionicons } from '@expo/vector-icons'; 
import MapScreen from './screens/MapScreen';

const Drawer = createDrawerNavigator();

const App = () => {
    const [capturedMedia, setCapturedMedia] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        const loadMedia = async () => {
            const storedMedia = await AsyncStorage.getItem('capturedMedia');
            if (storedMedia) {
                setCapturedMedia(JSON.parse(storedMedia));
            }
        };
        loadMedia();
    }, []);

    const handleMediaCaptured = async (media) => {
        const updatedMedia = [...capturedMedia, media];
        setCapturedMedia(updatedMedia);
        await AsyncStorage.setItem('capturedMedia', JSON.stringify(updatedMedia));
    };

    return (
        <NavigationContainer>
            <Drawer.Navigator
                initialRouteName="Home"
                screenOptions={({ route }) => ({
                    headerStyle: {
                        backgroundColor: '#4CAF50', // Color barra superior
                    },
                    headerTintColor: '#fff',
                    drawerActiveTintColor: '#4CAF50', // Color texto activo
                    drawerInactiveTintColor: 'gray',
                    drawerLabelStyle: {
                        fontSize: 16,
                    },
                    drawerIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Details') {
                            iconName = focused ? 'list' : 'list-outline';
                        }
                        else if (route.name === 'Mapa') {
                          iconName = 'map';
                      }


                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
            >
                <Drawer.Screen
                    name="Home"
                    children={() => <Main onMediaCaptured={handleMediaCaptured} />}
                    options={{ title: 'Inicio' }}
                />
                <Drawer.Screen
                    name="Details"
                    children={() => (
                        <Gallery
                            capturedMedia={capturedMedia}
                            setCapturedMedia={setCapturedMedia}
                            onLocationSelect={setSelectedLocation}
                        />
                    )}
                    options={{ title: 'Galeria' }}
                />
                <Drawer.Screen
                    name="Mapa"
                    children={() => <MapScreen onMediaCaptured={selectedLocation} />}
                    options={{ title: 'Ubicacion' }}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export default App;
