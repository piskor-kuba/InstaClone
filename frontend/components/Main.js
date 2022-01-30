import React, { useEffect } from 'react'
import {View, Text } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reload } from '../redux/actions/index';
import {fetchUser, fetchUserPosts, fetchUserFollowing, clearData} from '../redux/actions/index'
import { createMaterialBottomTabNavigator  } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { StatusBar } from 'expo-status-bar';
import firebase from 'firebase'

import FeedScreen from './main/Feed'
import Export from './main/Profile/Export'
import SearchScreen from './main/Search'

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () =>{
    return(null)
}

function Main(props) {
    if(props.currentUser == null){
        props.reload();
    }
        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <Tab.Navigator initialRouteName='Feed' labeled={false} barStyle={{ backgroundColor: '#ffffff' }}>
                    <Tab.Screen name="Feed" component={FeedScreen} 
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="home" color={color} size={26}/>
                            )
                        }}/>
                    <Tab.Screen name="Search" component={SearchScreen} navigation={props.navigation}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="magnify" color={color} size={26}/>
                            )
                        }}/>
                    <Tab.Screen name="AddContainer" component={EmptyScreen} navigation={props.navigation}
                        listeners={({ navigation }) => ({
                            tabPress: event =>{
                                event.preventDefault();
                                navigation.navigate("Add")
                            }
                        })}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="plus-box" color={color} size={26}/>
                            )
                        }}/>
                    <Tab.Screen name="MyProfile" component={Export} navigation={props.navigation}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="account-circle" color={color} size={26}/>
                            ),
                            headerShown: false
                        }}/>
                </Tab.Navigator>
                <StatusBar style="dark"/>      
            </View>
        )
    
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch) => bindActionCreators({reload}, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);
