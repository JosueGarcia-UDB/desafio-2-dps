import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const Gallery = ({ capturedMedia, setCapturedMedia, onLocationSelect }) => {
    const [locationNames, setLocationNames] = useState({});
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [editedAnnotation, setEditedAnnotation] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFullscreenModalVisible, setIsFullscreenModalVisible] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchLocationNames = async () => {
            const updatedLocationNames = {};
            for (const media of capturedMedia) {
                if (media.location && !locationNames[media.id]) {
                    const { latitude, longitude } = media.location;
                    try {
                        const [result] = await Location.reverseGeocodeAsync({ latitude, longitude });
                        updatedLocationNames[media.id] = `${result.region || ''}, ${result.country || ''}`;
                    } catch (error) {
                        updatedLocationNames[media.id] = 'Ubicación desconocida';
                    }
                }
            }
            setLocationNames((prev) => ({ ...prev, ...updatedLocationNames }));
        };

        fetchLocationNames();
    }, [capturedMedia]);

    const handleEditAnnotation = (media) => {
        setSelectedMedia(media);
        setEditedAnnotation(media.annotation || "");
        setIsModalVisible(true);
    };

    const handleSaveAnnotation = () => {
        setCapturedMedia((prev) =>
            prev.map((item) =>
                item.id === selectedMedia.id ? { ...item, annotation: editedAnnotation } : item
            )
        );
        setIsModalVisible(false);
    };

    const handleDeleteMedia = (id) => {
        Alert.alert(
            "Eliminar",
            "¿Estás seguro de que deseas eliminar este archivo?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => {
                        setCapturedMedia((prev) => prev.filter((item) => item.id !== id));
                    },
                },
            ]
        );
    };

    const handleMediaPress = (media) => {
        setSelectedMedia(media);
        setIsFullscreenModalVisible(true);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleMediaPress(item)}>
            <View style={styles.card}>
                <View style={styles.mediaContainer}>
                    {item.type === "video" ? (
                        <Video
                            source={{ uri: item.uri }}
                            style={styles.media}
                            useNativeControls
                            resizeMode="cover"
                            isLooping
                        />
                    ) : (
                        <Image source={{ uri: item.uri }} style={styles.media} />
                    )}
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.annotation}>{item.annotation || "Sin anotación"}</Text>
                    <TouchableOpacity
                        style={styles.locationContainer}
                        onPress={() => {
                            onLocationSelect(item.location);
                            navigation.navigate('Mapa');
                        }}
                    >
                        <Ionicons name="location-sharp" size={16} color="#4CAF50" />
                        <Text style={styles.locationText}>
                            {locationNames[item.id] || "Ubicación desconocida"}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleDeleteMedia(item.id)}
                        >
                            <Ionicons name="trash" size={20} color="#f44336" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleEditAnnotation(item)}
                        >
                            <Ionicons name="create" size={20} color="#FFA500" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <LinearGradient 
            colors={['#0f2027', '#203a43', '#2c5364']}
            style={styles.background}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Galería</Text>
                <FlatList
                    data={capturedMedia}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                />
                {selectedMedia && (
                    <Modal
                        visible={isModalVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setIsModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <TextInput
                                    style={styles.annotationInput}
                                    placeholder="Edita la anotación..."
                                    value={editedAnnotation}
                                    onChangeText={setEditedAnnotation}
                                />
                                <TouchableOpacity style={styles.saveButton} onPress={handleSaveAnnotation}>
                                    <Text style={styles.saveButtonText}>Guardar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setIsModalVisible(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                )}
                {selectedMedia && (
                    <Modal
                        visible={isFullscreenModalVisible}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setIsFullscreenModalVisible(false)}
                    >
                        <View style={styles.fullscreenModalContainer}>
                            {selectedMedia.type === "video" ? (
                                <Video
                                    source={{ uri: selectedMedia.uri }}
                                    style={styles.fullscreenMedia}
                                    useNativeControls
                                    resizeMode="contain"
                                    isLooping
                                />
                            ) : (
                                <Image
                                    source={{ uri: selectedMedia.uri }}
                                    style={styles.fullscreenMedia}
                                />
                            )}
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setIsFullscreenModalVisible(false)}
                            >
                                <Ionicons name="close-circle" size={36} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </Modal>
                )}
            </View>
        </LinearGradient>
    );
};

export default Gallery;

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 20,
        textAlign: 'center',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        marginBottom: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    mediaContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#E0E0E0',
    },
    media: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        padding: 15,
    },
    annotation: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    locationText: {
        fontSize: 14,
        color: '#4CAF50',
        marginLeft: 5,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    actionButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(161, 57, 57, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        alignItems: 'center',
    },
    annotationInput: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    fullscreenModalContainer: {
        flex: 1,
        backgroundColor: 'rgba(56, 45, 80, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenMedia: {
        width: '100%',
        height: '80%',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
});