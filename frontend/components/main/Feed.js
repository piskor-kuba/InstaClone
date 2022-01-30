import React, { useState, useEffect } from 'react'
import {StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import firebase from 'firebase';
import { Entypo, Feather, FontAwesome5 } from '@expo/vector-icons';
require("firebase/firestore")

import { connect } from 'react-redux'

function Feed(props) {
    const [posts, setPosts] = useState([]);
    const [currentUserLike, setCurrentUserLike] = useState(false)


    useEffect(() => {
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0){

            props.feed.sort(function (x, y) {
                return x.creation - y.creation;
            })
            setPosts(props.feed);
        }
        console.log(posts)
    },[props.usersFollowingLoaded, props.feed])

    const onLikePress = (userId, postId, item) => {
        item.likesCount += 1;
        setCurrentUserLike(true)
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
    }

    const onDislikePress = (userId, postId, item) => {
        item.likesCount -= 1;
        setCurrentUserLike(false)
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
    }

    return(
        <View style={styles.container}>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({ item }) => (
                        <View style={styles.containerImage}>    
                            <TouchableOpacity style={styles.icons} onPress={() => props.navigation.navigate("Profile", {uid: item.user.uid})}>
                                {item.user.image == 'default'?
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
                                <View style={{ alignSelf: 'center' }}>
                                    <Text style={styles.userText}>{item.user.name}</Text>
                                </View>
                            </TouchableOpacity>                       
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL}}
                            />
                            <View style={styles.icons}>
                                { item.currentUserLike ?
                                    (
                                        <Entypo name="heart" size={30} color="red" onPress={() => onDislikePress(item.user.uid, item.id, item)} />
                                    )
                                    :
                                    (
                                        <Feather name="heart" size={30} color="black" onPress={() => onLikePress(item.user.uid, item.id, item)}/>

                                    )
                                }
                                <Feather name="message-circle" size={30} color="black" onPress={() => props.navigation.navigate('Comment', {postId: item.id, uid: item.user.uid})} />
                            </View>
                            <Text>
                                {item.likesCount} likes
                            </Text>
                        </View>
                    )}

                
                />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    image: {
        flex: 1,
        aspectRatio: 1/1
    },
    containerImage: {
        flex: 1/3
    },
    icons:{
        flexDirection: 'row'
    },
    userText:{
        fontSize: 18,
        fontWeight: "bold",
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,

})

export default connect(mapStateToProps, null)(Feed);