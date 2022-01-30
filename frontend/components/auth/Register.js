import React, {  useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, KeyboardAvoidingView, ScrollView } from 'react-native'
import firebase from 'firebase';
require('firebase/firestore');
import { Snackbar } from 'react-native-paper';
//import { ScrollView } from 'react-native-gesture-handler';


export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [isValid, setIsValid] = useState(true);

    const onRegister = () => {
        if (name.length == 0 || username.length == 0 || email.length == 0 || password.length == 0) {
            setIsValid({ bool: true, boolSnack: true, message: "Please fill out everything" })
            return;
        }
        if (password.length < 6) {
            setIsValid({ bool: true, boolSnack: true, message: "passwords must be at least 6 characters" })
            return;
        }
        if (password.length < 6) {
            setIsValid({ bool: true, boolSnack: true, message: "passwords must be at least 6 characters" })
            return;
        }
        firebase.firestore()
            .collection('users')
            .where('username', '==', username)
            .get()
            .then((snapshot) => {

                if (!snapshot.exist) {
                    firebase.auth().createUserWithEmailAndPassword(email, password)
                        .then(() => {
                            if (snapshot.exist) {
                                return
                            }
                            firebase.firestore().collection("users")
                                .doc(firebase.auth().currentUser.uid)
                                .set({
                                    name,
                                    email,
                                    username,
                                    image: 'default'
                                })
                        })
                        .catch(() => {
                            setIsValid({ bool: true, boolSnack: true, message: "Something went wrong" })
                        })
                }
            }).catch(() => {
                setIsValid({ bool: true, boolSnack: true, message: "Something went wrong" })
            })

    }

        return (
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}} keyboardVerticalOffset={60}>
                <ScrollView>
                <ImageBackground style={ styles.logo } 
                    source={require('./image/login.png')}>
                </ImageBackground>
                <View style={{paddingTop: 30}}>
                        <TextInput
                            style={styles.input}
                            placeholder="Username..."
                            value={username}
                            onChangeText={(username) => setUsername(username)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder = "Name..."
                            onChangeText={(name) => setName(name)}
                            
                        /> 
                        <TextInput
                            style={styles.input}
                            placeholder = "E-mail..."
                            keyboardType='email-address'
                            onChangeText={(email) => setEmail(email)}
                        
                        />
                        <TextInput
                            style={styles.input}
                            placeholder = "Password..."
                            secureTextEntry={true}
                            keyboardType='visible-password'
                            onChangeText={(password) => setPassword(password)}
                            
                        />
                </View>
                <View style = {styles.viewButton}>
                    <TouchableOpacity 
                        style = {styles.touchButton}
                        onPress= {() => onRegister()}>
                        <Text style={styles.buttonText}> Sign Up </Text>
                    </TouchableOpacity>
                </View>
                <Snackbar
                    style={{justifyContent: 'center'}}
                    visible={isValid.boolSnack}
                    duration={2000}
                    onDismiss={() => { setIsValid({ boolSnack: false }) }}>
                    {isValid.message}
                </Snackbar>
                </ScrollView>
            </KeyboardAvoidingView>
        )
}

const styles = StyleSheet.create({
    logo: {
        marginTop: "5%",
        width: "100%",
        height: 80,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    touchButton: {
        backgroundColor: "#8b008b",
        padding: 10,
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 2
    },
    buttonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
    },
    viewButton:{
        paddingRight: 20,
        paddingLeft: 20,
    },
});
