import * as React from 'react';
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect} from 'react';
import { Alert, StyleSheet, Text, View, TextInput, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { useIsFocused } from "@react-navigation/native";
import Spinner from 'react-native-loading-spinner-overlay';
import './Global.js'


function QuizScreen() {
    const [marking, setMarking] = useState(null)
    const photo = require('./A.jpg')
    
    const [qns, setQns] = useState(null);
    const [ans, setAns] = useState(null);
    const [choices, setChoices] = useState([]);

    useEffect(() => {
        getQns();
    }, []);


    // GET quiz
    function getQns() {
        fetch(QUIZ_QNS_API, {
            method:"GET"
        }).
        then(response => response.json()).
        then(responseJson => {

            // Get random question from json array
            let question = responseJson[getRandNumber(0, responseJson.length - 1)];
            let gesture = question.gestures;

            console.log('Name: ' + question.question_name);
            console.log('Choices: ' + question.choice);
            console.log(gesture);
            console.log(MEDIA_URL + gesture[0].image); // image url

            setQns(question.id);
            setChoices(question.choice.split(','));
        }).
        catch(error => {
            Alert.alert("error", error.message)
        });    
    }

    // POST user response and return is_correct
    function postAns(ans, qns) {            
        // Force ans and qns to load before sending (published issue)
        console.log(qns);
        console.log(ans);

        const uploadData = new FormData();
        uploadData.append('response', ans);
        uploadData.append('quiz', qns);

        fetch(QUIZ_ANS_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: uploadData
        }).
        then(response => {
            if(response.ok) return response.json();
            throw new Error(JSON.stringify(response));
        }).
        then(responseJson => {
            console.log(responseJson.is_correct);
            setMarking(responseJson.is_correct);
        }).
        catch(error => {
            setMarking(false); // When answer is not in possible answer
        });
    }

    
    function checkAns() {
        //if ans is correct to picture
        postAns(ans, qns);
    }

    function nextQn() {
        // setImage(null)
        // setAns(null)
        // new question
    }

    function getRandNumber(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#feb157","#ffd26c"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.top}>
                <Text style={styles.header}>QUIZ</Text>
                <View style={styles.rectangle}/>
                <Text style={styles.prompt}>Key in the letter corresponding to this sign!</Text>
                <Image style={{width:300,height:300}} source={photo}/>
                <TextInput
                    style={styles.input}
                    onChangeText={setAns}
                    value={ans}
                    placeholder="Your answer"
                />
                <Button titleStyle={styles.butText} title="Submit" onPress={() => checkAns()}/>
                { marking === null ? (<Text style={styles.markingNull}>No answer submitted</Text>)
                    : marking === false ? (<Text style={styles.markingFalse}>Wrong!{"\n"}Please try again!</Text>)
                        : (<Text style={styles.markingTrue}>Correct!</Text>)}
                { marking === true ? (
                    <View style={styles.next}>
                    <Button title="Next Question" onPress={() => nextQn()}/></View>) : null}
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
        width:120,
        height:10,
        backgroundColor:'white',
        alignSelf:'flex-start',
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,

    },
    prompt: {
        width: 350,
        padding: 23,
        borderWidth: 0,
        borderColor: "#eaeaea",
        borderRadius: 50,
        backgroundColor: "transparent",
        color: "#20232a",
        textAlign: "center",
        fontSize: 17,
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
        marginTop: 30,
        width: 350,
        padding: 10,
        borderWidth: 4,
        borderColor: "#eaeaea",
        borderRadius: 50,
        backgroundColor: "#eaeaea",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontFamily:"FuturaPTDemi",
    },
    next: {
        marginTop:10
    },
    markingNull: {
        marginTop: 20,
        width: 250,
        padding: 8,
        borderWidth: 0,
        borderColor: "#eaeaea",
        borderRadius: 50,
        backgroundColor: "#eaeaea",
        color: "#20232a",
        textAlign: "center",
        fontSize: 20,
        fontFamily:"FuturaPTDemi",
    },
    markingTrue: {
        marginTop: 20,
        width: 200,
        padding: 8,
        borderWidth: 0,
        borderColor: "#90EE90",
        borderRadius: 50,
        backgroundColor: "#90EE90",
        color: "#20232a",
        textAlign: "center",
        fontSize: 20,
        fontFamily:"FuturaPTDemi",
    },
    markingFalse: {
        marginTop: 20,
        width: 200,
        padding: 8,
        borderWidth: 0,
        borderColor: "#ff3232",
        borderRadius: 50,
        backgroundColor: "#ff3232",
        color: "#eaeaea",
        textAlign: "center",
        fontSize: 20,
        fontFamily:"FuturaPTDemi",
    },
    butText:{
        fontFamily:"FuturaPTDemi",
    }
})

export default QuizScreen
