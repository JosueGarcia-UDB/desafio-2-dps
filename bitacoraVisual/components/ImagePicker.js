import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const { height, width } = Dimensions.get("window");

const ImagePickerComponent = ({ onMediaCaptured }) => {
    const [media, setMedia] = useState("");
    const [mediaType, setMediaType] = useState(""); // Tipo de media (imagen o video)
    const [annotation, setAnnotation] = useState(""); // Anotación de texto
    const [location, setLocation] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handlePickMedia = async (type) => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permiso denegado", "El permiso para acceder a la cámara fue denegado.");
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: type,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                setMedia(result.assets[0].uri);
                setMediaType(result.assets[0].type);
                const locationData = await handleGetLocation();
                setLocation(locationData);
                setIsModalVisible(true); // Mostrar modal después de capturar
            }
        } catch (error) {
            Alert.alert("Error", `Ocurrió un error al intentar abrir la cámara: ${error.message}`);
        }
    };

    const handleGetLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permiso denegado", "El permiso para acceder a la ubicación fue denegado.");
                return null;
            }

            const location = await Location.getCurrentPositionAsync({});
            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
        } catch (error) {
            Alert.alert("Error", `Ocurrió un error al intentar obtener la ubicación: ${error.message}`);
            return null;
        }
    };

    const handleSaveMedia = () => {
        if (onMediaCaptured) {
            onMediaCaptured({
                id: Date.now().toString(),
                uri: media,
                type: mediaType,
                location,
                annotation,
            });
        }
        setMedia("");
        setAnnotation("");
        setIsModalVisible(false); // Cerrar modal después de guardar
    };

    return (
        <View style={styles.container}>
            <View style={styles.containerBtn}>
                    <TouchableOpacity
            style={styles.btnCamara}
            onPress={() => handlePickMedia(ImagePicker.MediaTypeOptions.Images)}
        >
            <MaterialCommunityIcons name="camera-plus" size={40} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.btnCamara}
            onPress={() => handlePickMedia(ImagePicker.MediaTypeOptions.Videos)}
        >
            <MaterialCommunityIcons name="video-plus" size={40} color="blue" />
        </TouchableOpacity>
            </View>

            <Modal
    visible={isModalVisible}
    transparent={true}
    animationType="slide"
    onRequestClose={() => setIsModalVisible(false)}
>
    <View style={styles.modalOverlay}>
        <View style={styles.newModalContent}>
            <Text style={styles.modalTitle}>
                {mediaType === "video" ? "🎥 Video Capturado" : "📷 Imagen Capturada"}
            </Text>
            {mediaType === "image" && (
                <Image style={styles.img} source={{ uri: media }} />
            )}
            <TextInput
                style={styles.annotationInput}
                placeholder="¿Quieres dejar alguna nota?"
                value={annotation}
                onChangeText={setAnnotation}
                multiline
                numberOfLines={3}
            />
            <View style={styles.modalButtonsRow}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveMedia}>
                    <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                    <Text style={styles.cancelButtonText}> Cancelar</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
</Modal>

        </View>
    );
};

export default ImagePickerComponent;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: 'center',
        padding: 20,
    },
    containerBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    btnCamara: {
        backgroundColor: "#ffffff",
        borderRadius: 50,
        borderWidth: 1,
        padding: 10,
        marginHorizontal: 10,
    },
    img: {
        height: height * 0.4,
        width: height * 0.4,
        borderRadius: 10,
        resizeMode: 'cover',
        marginBottom: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    newModalContent: {
        width: '90%',
        backgroundColor: '#fefefe',
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
    },
    modalButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginRight: 10,
        flex: 1,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#FF5252',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
    },    
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
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
});