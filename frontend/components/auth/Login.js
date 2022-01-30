import React, { useState } from 'react'
import { View,Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, KeyboardAvoidingView} from 'react-native'
import firebase from 'firebase';


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSignUp = () => {
        firebase.auth().signInWithEmailAndPassword(email, password)
    }

        return (
                <KeyboardAvoidingView>
                    <ImageBackground style={ styles.logo } 
                        source={require('./image/login.png')}>
                    </ImageBackground>
                    <View style={{paddingTop: 30}}>
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
                            onChangeText={(password) => setPassword(password)}
                            
                        />
                    </View>
                    <View style = {styles.viewButton}>
                        <TouchableOpacity 
                            style = {styles.touchButton}
                            onPress= {() => onSignUp()}>
                            <Text style={styles.buttonText}> Log In </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>

        )
    
}

const styles = StyleSheet.create({
    logo: {
        marginTop: "20%",
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
