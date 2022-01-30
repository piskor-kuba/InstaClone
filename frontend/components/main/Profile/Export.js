import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import firebase from 'firebase'
import * as Updates from 'expo-updates';
import { connect } from 'react-redux'
import { ImageBackground, View, Text, StyleSheet, TouchableOpacity } from 'react-native'

import ProfileSc from './Profile'

const Drawer = createDrawerNavigator();


export default function Export(props) {
    const logout = () => {
        firebase.auth().signOut();
        Updates.reloadAsync()
        if(props.currentUser == null){
            return(
                <View/>
            )
        }
    }
    

    return (
        
            <Drawer.Navigator >
                <Drawer.Screen name="Profile" component={ProfileSc} initialParams={{ uid: firebase.auth().currentUser.uid }} />
                <Drawer.Screen name="Logout" component={logout} />
            </Drawer.Navigator>
        
    )
}





