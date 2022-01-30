import React, { Component } from 'react';
import {getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from 'firebase';
import {View, ImageBackground } from 'react-native';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'


import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'
import CommentScreen from './components/main/Comment'
import ProfileScreen from './/components/main/Profile/Profile'

const store = createStore(rootReducer, applyMiddleware(thunk))


const firebaseConfig = {
  apiKey: "*********",
  authDomain: "*********",
  projectId: "*********",
  storageBucket: "*********",
  messagingSenderId: "*********",
  appId: "*********",
};



if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig)
}

const Stack = createStackNavigator();


export class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      }else {
        this.setState({
        loggedIn: true,
        loaded: true,
      })
      }
    })
  
  }



  render() {
    const { loggedIn , loaded } = this.state;
    if(!loaded){
      return(
        <View style = {{ flex :1, justifyContent: 'center', alignItems:'center'}}>
          <ImageBackground style={{width: "100%", height: "100%"}} 
            source={require('./logo.png')}>
          </ImageBackground>
        </View>
      )
    }
    if (!loggedIn){
      return(
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return(
    
      <Provider store = {store}>
        <NavigationContainer>
          <View style={{flex: 1, backgroundColor: '#000'}}>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen key={Date.now()} name="Main" component={MainScreen} navigation={this.props.navigation} options={({ route }) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';
                switch (routeName) {
                  case 'Profile': {
                    return {
                      //headerTitle: 'Profile',
                      headerShown: false
                    };
                  }
                  case 'Search': {
                    return {
                      headerTitle: 'Search',
                    };
                  }
                  case 'Feed': {
                    return {
                      headerTitle: 'Instagram'
                    }
                  }
                  default: {
                    return {
                      //headerTitle: 'Instagram',
                      headerShown: false
                    };
                  }
                }
              }}
              />
            <Stack.Screen key={Date.now()} name="Add" component={AddScreen} navigation={this.props.navigation}/>
            <Stack.Screen key={Date.now()} name="Save" component={SaveScreen} navigation={this.props.navigation}/>
            <Stack.Screen key={Date.now()} name="Comment" component={CommentScreen} navigation={this.props.navigation}/>
            <Stack.Screen key={Date.now()} name="Profile" component={ProfileScreen} navigation={this.props.navigation}/>
          </Stack.Navigator>
          </View>
        </NavigationContainer>
      </Provider>
      
    );


  }
}

export default App