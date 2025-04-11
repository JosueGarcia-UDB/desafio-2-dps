import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import * as LocationExpo from 'expo-location';

const { height, width } = Dimensions.get("window")

const Location = () => {

    const [location, setLocation] = useState("")
    const [confirm, setConfirm] = useState(false)

    const hadleGetLocation = async () => {

        let { status } = await LocationExpo.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert("El permiso para acceder a la ubicacion fue denegado");
            return;
        }

        let location = await LocationExpo.getCurrentPositionAsync({});

        const objetcLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        }

        setLocation(objetcLocation);
        setConfirm(true)
    }

    const handleSubmitLocation = async () => {
        // Guardar ubicacion en base de datos
        Alert.alert("Ubicación guardada")
        setConfirm(false)
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerImgMap}>
                {location ?
                    <>
                        <Text>Lat: {location.latitude}</Text>
                        <Text>Lat: {location.longitude}</Text>
                    </>
                    :
                    <Image style={styles.imgMap} source={{ uri: "https://i.ibb.co/pLLSXzp/img-ubicacion.png" }} />
                }
            </View>
            <TouchableOpacity style={styles.btnText} onPress={hadleGetLocation}>
                <Text style={styles.text}>Obtener ubicación</Text>
            </TouchableOpacity>
            {confirm && <TouchableOpacity style={styles.btnText} onPress={handleSubmitLocation}>
                <Text style={styles.text}>Guardar ubicación</Text>
            </TouchableOpacity>}
        </View>
    )
}

export default Location;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: 'center',
        marginTop: 20
    },
    containerImgMap: {
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.8,
        height: height * 0.3,
        backgroundColor: "#ffffff"
    },
    imgMap: {
        height: "100%",
        width: "100%",
        resizeMode: 'center'
    },
    btnText: {
        backgroundColor: "#0000ff",
        width: width * 0.8,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 3
    },
    text: {
        fontWeight: 'bold',
        color: "#ffffff",
        fontSize: 16
    },
})