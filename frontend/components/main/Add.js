import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { NavigationContainer } from '@react-navigation/native';
//import Icon, { FontAwesome, Feather } from 'react-web-vector-icons';
import { Entypo, Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';


export default function Photo( {navigation} ) {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    //const [camera, setCamera] = useState(null);
    const cameraRef = useRef(null)
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            const galleryStatus = await ImagePicker.requestCameraPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if(cameraRef){
            const data = await cameraRef.current.takePictureAsync(null);
            setImage(data.uri);
        }
    }
    const Delete = () => {
        setImage(null);
    }

    const pickImage = async () => {
        
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    if (hasCameraPermission === null || hasGalleryPermission === false) {
        return <View />;
    }
    if (hasCameraPermission === false || hasGalleryPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={{flex: 1}}>
            <View style={styles.cameraContainer}>
                {image ?
                    (
                    
                        {image} && <Image source={{uri: image}} style={styles.fixedRatio}/>
                               
                    )   
                    : 
                    (
                        <Camera
                        ref={ cameraRef }
                        //ref={ref => setCamera(ref)}
                        style={styles.fixedRatio}
                        type={type}
                        //ratio={'1:1'} 
                        />  
                    )
                }   
            </View>

            <View style={styles.button}>
            <Ionicons name="camera-outline" size={40} color="black" onPress={() => takePicture()}/>
            <Ionicons name="images-outline" size={40} color="black" onPress={() => pickImage()}/>
            <Ionicons name="camera-reverse-outline" size={40} color="black" onPress={() => {
                    setType(
                        type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                    );
                }}/>
            <Ionicons name="trash-outline" size={40} color="black" onPress={() => Delete()}/>
            <Ionicons name="cloud-upload-outline" size={40} color="black" onPress={() => navigation.navigate('Save', {image})}/>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    cameraContainer:{
        //flex: 1,
        flexDirection: 'row'
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    },
    button: {
        //flex: 1,
        //alignSelf:'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: "20%"
        
    }
})