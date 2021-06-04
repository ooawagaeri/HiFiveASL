import * as React from 'react';
import {Text, View, StyleSheet, Image, TextInput, Button} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";
import {useState} from "react";

function QuizScreen() {
    const [ans, setAns] = useState(null)
    const [marking, setMarking] = useState(null)
    const [image, setImage] = useState('./a.gif')
    var photo = './a.gif'

    function checkAns() {
        //if ans is correct to picture,
        setMarking(null) // else false
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
                <Text style={styles.prompt}>Key in the letter corresponding to this sign!</Text>
                <Image style={{width:300,height:300}} source={require(photo)}/>
                <TextInput
                    style={styles.input}
                    onChangeText={setAns}
                    value={ans}
                    placeholder="Your answer"
                />
                <Button title="Submit" onPress={() => checkAns()}/>
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
        backgroundColor: '#eaeaea'
    },
    prompt: {
        marginTop: 20,
        marginBottom:20,
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
        fontWeight: "bold",
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
        fontWeight: "bold",
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
        fontWeight: "bold",
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
        fontWeight: "bold",
    },
})

export default QuizScreen