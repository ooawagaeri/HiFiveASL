import * as React from 'react';
import {useState, useEffect, useRef} from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import {Camera} from "expo-camera";
import {useIsFocused} from "@react-navigation/native";
import {LinearGradient} from "expo-linear-gradient";
import './Global.js'

function PractiseScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [type, setType] = useState(Camera.Constants.Type.front);
    const isFocused = useIsFocused();
    
    const [ans, setAns] = useState(null);
    const [qns, setQns] = useState(null);
    const [dictonary, setDictonary] = useState(null); // Array of possible answers

    
    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
        getQns();
    }, []);

    const takePicture = async () => {
        if (camera) {
            if (!previewVisible) {
                setPreviewVisible(true);
            }
            console.log('snip');
            const data = await camera.takePictureAsync(null);
            postASL(data);
        }
    }

    const postASL = (result) => {
        let localUri = result.uri;
        let filename = localUri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        const uploadData = new FormData();
        uploadData.append('image', { uri: localUri, name: filename, type });
        
        fetch(ASL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: uploadData
        })
        .then(response => {
            if(response.ok) return response.json();
            throw new Error('Network response was not ok');
        })
        .then(responseJson => {  
            const answer = responseJson.name; 
            // Get question no.   
            const question = dictonary.findIndex(obj => obj.answer === qns) + 1;
            // Send user response to server to validate ans
            postAns(answer, question);
        })
        .catch(error => {
            console.error(error);
        })
        ;
    }

    // POST user response and return is_correct
    function postAns(ans, qns) {
        const uploadData = new FormData();
        uploadData.append('response', ans);
        uploadData.append('practise_question', qns);

        fetch(PRACTICE_ANS_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: uploadData
        })
        .then(response => {
            if(response.ok) return response.json();
            throw new Error('Network response was not ok');
        })
        .then(responseJson => {
            setAns(responseJson.is_correct);
        })
        .catch(error => {
            // When answer is not in possible answer
            setAns(false);
        })
        ;
    }

    function getRandNumber(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // GET practise 
    function getQns() {
        fetch(PRACTICE_QNS_API, {
            method:"GET"
        })
        .then(response => response.json())
        .then(responseJson => {
            // Get random question from json array
            var answer = responseJson[getRandNumber(0, responseJson.length - 1)].answer;
            
            setDictonary(responseJson); // Store possible answers
            setQns(answer); // Set question
        })
        .catch(error => Alert.alert("error", error.message))
    }


    if (hasPermission === null) {
        return <View/>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#feb157","#ffd26c"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.top}>
                <Text style={styles.prompt}>Show us the sign language to this letter!</Text>
                <Text style={styles.qnText}>{qns}</Text>
            </LinearGradient>
            <View style={styles.cameraContainer}>
                {isFocused && <Camera ref={ref => setCamera(ref)} style={styles.fixedRatio} type={type}>
                    <View>
                        <Button title="Flip Camera" onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}/>
                    </View>
                </Camera>}
                <View style={styles.fixToText}>
                    <Button title="Take picture" onPress={() => takePicture()}/>
                </View>
            </View>
            <LinearGradient
                colors={["#feb157","#ffd26c"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.bottom}>
                { ans === null ? (<Text style={styles.markingNull}>No answer submitted</Text>)
                    : ans === false ? (<Text style={styles.markingFalse}>Wrong!</Text>)
                    : (<Text style={styles.markingTrue}>Correct!</Text>)}
                <Button title="Next Question" onPress={() => getQns()}/>
            </LinearGradient>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaeaea'
    },
    cameraContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
    },
    fixedRatio : {
        flex: 1,
        aspectRatio:3/4,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    fixToText: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        paddingLeft: 150,
        justifyContent: 'space-between'
    },
    previewBox:{
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        textAlign: "center"
    },
    ansContainer: {
        flex: 1,
        padding: 24,
        backgroundColor: "#eaeaea",
        alignItems:'center',
        justifyContent:'center',
    },
    qnText: {
        marginTop: 3,
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
    markingNull: {
        marginTop: 10,
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
        marginTop: 10,
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
        marginTop: 10,
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
    prompt: {
        marginTop: 0,
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
    bottom: {
        flex: 0.3,
        borderWidth: 0,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems:'center',
        flexDirection:'row',
        paddingLeft: 10,
        justifyContent: 'space-around',
    },
    top: {
        flex: 0.55,
        borderWidth: 0,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        alignItems:'center',
    },
});

export default PractiseScreen