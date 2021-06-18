import * as React from 'react';
import {Text, View, StyleSheet, Image, TextInput, Button, SafeAreaView} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";
import {useState} from "react";
import {Thumbnail} from "react-native-thumbnail-video";

function VideosScreen() {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#feb157","#ffd26c"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.top}>
                <Text style={styles.header}>VIDEOS</Text>
                <View style={styles.rectangle}/>
                <Text style={styles.prompt}>Here are some videos to aid our ASL learning.{"\n"}Click on the thumbnail to play!  </Text>
                <View style={styles.videoDes}>
                    <Thumbnail style={styles.videoSize} iconStyle={styles.play} containerStyle={styles.videoShape}
                               url={'https://www.youtube.com/watch?v=betAZeKRpR8'}/>
                    <Text style={styles.des}>The Story of ASL </Text>
                </View>
                <View style={styles.videoDes}>
                    <Thumbnail style={styles.videoSize} iconStyle={styles.play} containerStyle={styles.videoShape}
                               url={'https://www.youtube.com/watch?v=u3HoC9_ir3s'}/>
                    <Text style={styles.des}>The ASL Alphabet: {"\n"}American Sign Language{"\n"}Letters A-Z</Text>
                </View>
                <View style={styles.videoDes}>
                    <Thumbnail style={styles.videoSize} iconStyle={styles.play} containerStyle={styles.videoShape}
                               url={'https://www.youtube.com/watch?v=v1desDduz5M'}/>
                    <Text style={styles.des}>Basic Sign Language{"\n"}Phrases for Beginners </Text>
                </View>
                <View style={styles.videoDes}>
                    <Thumbnail style={styles.videoSize} iconStyle={styles.play} containerStyle={styles.videoShape}
                               url={'https://www.youtube.com/watch?v=pDA_EXFTpxo'}/>
                    <Text style={styles.des}>Dos and Don'ts of{"\n"}Interacting with the{"\n"}Deaf Community [CC]
                    </Text>
                </View>
            </LinearGradient>
        </View>
    )}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    header: {
        marginTop: 50,
        width: 350,
        padding: 0,
        borderWidth: 0,
        borderColor: "#eaeaea",
        borderRadius: 50,
        backgroundColor: "transparent",
        color: "#20232a",
        textAlign: "left",
        fontSize: 30,
        fontFamily:"FuturaPTDemi",
    },
    rectangle: {
        marginTop:10,
        width:150,
        height:10,
        backgroundColor:'white',
        alignSelf:'flex-start',
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,

    },
    prompt: {
        width: 350,
        padding: 10,
        borderWidth: 0,
        borderColor: "#eaeaea",
        borderRadius: 50,
        backgroundColor: "transparent",
        color: "#20232a",
        textAlign: "center",
        fontSize: 15,
        fontFamily:"FuturaPTBook",
    },
    top: {
        flex: 1,
        borderWidth: 0,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        alignItems:'center',
    },
    input: {
        marginTop: 10,
        marginBottom: 0,
        width: 350,
        padding: 10,
        borderWidth: 4,
        borderColor: "#eaeaea",
        borderRadius: 50,
        backgroundColor: "#eaeaea",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontFamily:"FuturaPTBook",
    },
    videoDes: {
        flexDirection:'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom:5,
        marginLeft:8
    },
    videoSize: {
        width:180,
        height:140
    },
    play: {
        alignSelf:'center',
        marginTop:50
    },
    videoShape:{
        paddingLeft:5
    },
    des: {
        paddingLeft:10,
        fontSize: 15,
        fontFamily:"FuturaPTDemi",
    }
})

export default VideosScreen