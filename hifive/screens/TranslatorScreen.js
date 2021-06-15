import * as React from 'react';
import { Alert, Text, View, StyleSheet, Image, TextInput, Button, ImageStore, FlatList} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";
import {useState} from "react";
import './Global.js'

function TranslatorScreen() {
    const [ans, setAns] = useState(null)
    const [image, setImage] = useState([])
    

    // POST user response and return is_correct
    function checkAns() {
        fetch(TRANSLATOR_API + ans,{
            method:"GET"
        })
        .then(response => response.json())
        .then(responseJson => {
            setImage(responseJson)
        })
        .catch(error => Alert.alert("error", error.message))
    }

    // Display multiple Images from API
    function showImage() {
        return image.map((img, index) => (
            <Image source={{uri: img.image}} style={{width:300,height:300}} key={index}/>
        ));
    }

    const renderData = (item, index) => {
        return (
            <Image source={{uri: item.image}} style={{width:300,height:300}} key={index}/>
        )
      }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#feb157","#ffd26c"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.top}>
                <Text style={styles.header}>Dictionary Look Up</Text>
                <Text style={styles.prompt}>Key in the letter to translate into ASL!</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setAns}
                    value={ans}
                    placeholder="Letter/Word"
                />
                <View style={styles.submitButton}>
                    <Button title="Submit" onPress={() => checkAns()}/>
                </View>
                <FlatList
                    data = {image}
                    keyExtractor={(item, index)=> item.id.toString()}
                    renderItem={({item})=>{
                        return renderData(item);
                    }}
                />
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
        fontWeight: "bold",
    },
    rectangle: {
        marginTop:10,
        width:240,
        height:10,
        backgroundColor:'white',
        alignSelf:'flex-start',
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,

    },
    prompt: {
        width: 350,
        padding: 30,
        borderWidth: 0,
        borderColor: "#eaeaea",
        borderRadius: 50,
        backgroundColor: "transparent",
        color: "#20232a",
        textAlign: "center",
        fontSize: 15,
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
    },
})

export default TranslatorScreen