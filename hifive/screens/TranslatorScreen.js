import * as React from 'react';
import { Alert, Text, View, StyleSheet, Image, TextInput, Button} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";
import {useState} from "react";
import './Global.js'

function TranslatorScreen() {
    const [ans, setAns] = useState(null)
    const [marking, setMarking] = useState(null)

    const [image, setImage] = useState(null)
    var photo = './a.gif'

    // function checkAns() {
    //     //if ans is correct to picture,
    //     setMarking(null) // else false
    // }

    // POST user response and return is_correct
    function checkAns() {
        fetch(TRANSLATOR_API + ans,{
            method:"GET"
        })
        .then(response => response.json())
        .then(responseJson => {
            console.log(responseJson[0].image);
            setImage(responseJson[0].image);
        })
        .catch(error => Alert.alert("error", error.message))
    }


    function nextQn() {
        setImage(null)
        setAns(null)
        // new question
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#feb157","#ffd26c"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.top}>
                <Text style={styles.prompt}>Key in the letter to translate into ASL!</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setAns}
                    value={ans}
                    placeholder="Your answer"
                />
                <View style={styles.submitButton}>
                    <Button title="Submit" onPress={() => checkAns()}/>
                </View>
                <Image style={{width:300,height:300}} source={require(photo)}/>
                <Image source={{ uri: 'http://192.168.1.56:8000/media/get_images/A.png', }} style={{ width: 40, height: 40 }}/>
                <Image source={{image}} style={{ width: 40, height: 40 }}/>
            </LinearGradient>
        </View>
    )}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaeaea'
    },
    prompt: {
        marginTop: 20,
        marginBottom:0,
        width: 350,
        padding: 10,
        borderWidth: 0,
        borderColor: "#eaeaea",
        borderRadius: 50,
        backgroundColor: "transparent",
        color: "#20232a",
        textAlign: "center",
        fontSize: 15,
        fontWeight: "bold",
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
        fontWeight: "bold",
    },
    submitButton: {
        marginBottom:20
    }
})

export default TranslatorScreen