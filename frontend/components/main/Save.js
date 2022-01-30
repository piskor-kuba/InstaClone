import React, { useState } from 'react'
import { View, TextInput, Image, Button, StyleSheet, Text, KeyboardAvoidingView } from 'react-native'
import firebase from 'firebase'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
//import { ScrollView } from 'react-native-gesture-handler'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUserPosts } from '../../redux/actions/index';

require("firebase/firestore")
require("firebase/firebase-storage")
 
function Save(props) {
    //console.log(props.route.params.image)
    const [caption, setCaption] = useState("")
    const imgDisp = props.route.params.image;

    const uploadImage = async() => {
        const uri = props.route.params.image;
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
        console.log(childPath)
        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);
        const taskProgres = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgres, taskError, taskCompleted);
    }

     const savePostData = (downloadURL) => {
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadURL,
                caption,
                likesCount: 0,
                creation: firebase.firestore.FieldValue.serverTimestamp()

            }).then((function () {
                props.fetchUserPosts()
                props.navigation.popToTop()
            }))
     }
    return (
            <SafeAreaView>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={80}>
                    
                        {imgDisp ?
                            (
                                <View>
                                    <ScrollView contentContainerStyle={styles.contentContainer}>
                                        {imgDisp && <Image source={{uri: imgDisp}} style={styles.fixedRatio}/>}
                                        <TextInput
                                            multiline
                                            placeholder="Description.."
                                            style={styles.input}
                                            onChangeText={(caption) => setCaption(caption)}
                                        />
                                        <TouchableOpacity 
                                            style={styles.touchButton} 
                                            onPress={() => uploadImage()}>
                                            <Text style={styles.buttonText}> Dodaj zdjęcie </Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            )
                            :
                            (
                                <View style={styles.textView}>
                                    <Text> NO PHOTO, BACK AND TAKE OR CHOOSE PHOTO</Text>
                                </View>
                            )

                        }
                    
                </KeyboardAvoidingView>
            </SafeAreaView>
    )
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
    input: {
        height: 80,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderColor: 'pink'
    },
    textView: {
        alignSelf: 'center',
        justifyContent:'center',
        paddingTop: "50%"
    },
    touchButton: {
        backgroundColor: "#8b008b",
        padding: 10,
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 2,        
        width: "50%",
        height: 50,
        alignSelf: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 19,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        justifyContent: "center",

    },
    contentContainer:{
        paddingVertical: 20,

    },
});

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUserPosts }, dispatch);


export default connect(mapStateToProps, mapDispatchProps)(Save);
