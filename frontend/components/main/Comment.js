import React, {useState, useEffect} from 'react'
import {View, Text, FlatList, Button, TextInput, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native'
import firebase  from 'firebase'
require('firebase/firestore')
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler'

function Comment(props) {
    //sekcja komentarzy
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    //text to komentarz ktory uzytkownik wprowadza
    const [text, setText] = useState("")
    const [refresh, setRefresh] = useState(false)


    useEffect(() => {
        getComments();
    }, [props.route.params.postId, props.users, refresh])

    const matchUserToComment = (comments) => {
        for (let i = 0; i < comments.length; i++){
            if(comments[i].hasOwnProperty('user')){
                continue;
            }

            const user = props.users.find(x => x.uid === comments[i].creator)
                
            if(user == undefined){
                props.fetchUsersData(comments[i].creator, false)
            } else {
                 comments[i].user = user 
            }
         }
        setComments(comments)
        setRefresh(false)

    }
    const getComments = () => {
        if(props.route.params.postId !== postId || refresh){
            firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            //dokument z uid uzytkownika
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .get()
            .then((snapshot)=>{
                let comments = snapshot.docs.map(doc =>{
                    const data = doc.data();
                    const id = doc.id;
                    return {id, ...data}
                })
                matchUserToComment(comments)
               
            })
            setPostId(props.route.params.postId)
        } else{
            matchUserToComment(comments)
        }
    }


    const onCommentSend = () =>{
        firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .add({
                creator: firebase.auth().currentUser.uid,
                text
            }).then(() => {
                setRefresh(true)
            })
    }

    return (
        <View style={{flex: 1}}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}} keyboardVerticalOffset={60}>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({ item }) =>(
                    <View>
                        <TouchableOpacity onPress={() => props.navigation.navigate("Profile", {uid: item.user.uid})}>
                        {item.user !== undefined ? 
                            <View style={styles.icons}>
                                {item.user.image == 'default' ?
                                    (
                                        <FontAwesome5
                                            name="user-circle" size={35} color="black" />
                                    )
                                    :
                                    (
                                        <FontAwesome5
                                            name="user-circle" size={35} color="black" />
                                    )
                                }
                                <View>
                                    <Text>
                                        
                                        <Text style={styles.userText}> 
                                            {item.user.name}
                                        </Text>
                                        {item.text}
                                    </Text>
                                </View>
                            </View>
                            : null }
                            </TouchableOpacity>
                    </View>
                )}

            />
                    <TextInput 
                        style={styles.inputText}
                        placeholder='comments...'
                        multiline={true}
                        onChangeText={(text) => setText(text)}/>
                    <Button 
                        onPress={() => onCommentSend()}
                        title="Send"
                    />
            </KeyboardAvoidingView>

        </View>
    )
}

const styles = StyleSheet.create({
    icons:{
        flexDirection: 'row'
    },
    userText:{
        fontSize: 14,
        fontWeight: "bold",
    },
    inputText: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        paddingBottom: 10
    }
})

const mapStateToProps = (store) => ({
    users: store.usersState.users
})

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUsersData}, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);
