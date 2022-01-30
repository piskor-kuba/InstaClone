import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export default function Landing({ navigation }) {
    return (
      <View>
        <ImageBackground style={ styles.logo } 
                 //resizeMode='cover' 
                 source={require('./image/logo.png')}>
          <View style={styles.viewButton}>
              <TouchableOpacity
                style = {styles.touchButton}
                onPress = {() => navigation.navigate("Register")}>
                <Text style={styles.buttonText}> Register </Text>
              </TouchableOpacity>
              <View style={styles.space} />
              <TouchableOpacity 
                style = {styles.touchButton}
                onPress = {() => navigation.navigate("Login")}>
                <Text style={styles.buttonText}> Log In </Text>
              </TouchableOpacity>
          </View>
        </ImageBackground>
        <StatusBar style="dark"/> 
      </View>
    )
}

const styles = StyleSheet.create({
  logo: {
    width: '100%',
    height: '90%',
    
  },
  viewButton:{
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: 500
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
    textTransform: "uppercase"
  },
  space: {
    height: 5,
  }
});

