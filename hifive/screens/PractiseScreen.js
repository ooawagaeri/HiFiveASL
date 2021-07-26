import * as React from 'react';
import { Camera } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef} from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { useIsFocused } from "@react-navigation/native";
import { MediaQuery, MediaQueryStyleSheet } from "react-native-responsive";
import Spinner from 'react-native-loading-spinner-overlay';
import './Global.js'


function PractiseScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [type, setType] = useState(Camera.Constants.Type.front);
    const isFocused = useIsFocused();
    const [loading,setLoading] = useState(false)

    const [qnLen, setQnLen] = useState(null)
    const [wordLen, setWordLen] = useState(0)
    const word = useRef("");

    const [marking, setMarking] = useState(null);
    const [wrong, setWrong] = useState([])
    const [qns, setQns] = useState(null);
    const [dictonary, setDictonary] = useState(null); // Array of possible answers

    /**
     * Upon render, request camera permissions.
     */
    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
        getQns();
        word.current = "";
    }, []);

    /**
     * Take photo and post image
     * @returns {Promise<void>}
     */
    const takePicture = async () => {
        if (camera) {
            if (!previewVisible) {
                setPreviewVisible(true);
            }
            setMarking(null)
            setLoading(true)
            const data = await camera.takePictureAsync(null);
            postASL(data);
        }
    }

    /**
     * POST user image.
     * GET response from API (corresponding letter)
     * @param result (photo data)
     */
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
        }).
        then(response => {
            if(response.ok) return response.json();
            throw new Error('Network response was not ok');
        }).
        then(responseJson => {
            if (responseJson.name === 'nothing') {responseJson.name = "1"}
            setLoading(false);

            word.current += responseJson.name
            setWordLen(word.current.length)

            return ((word.current.length) >= qnLen) 
        }).
        then((len) => {
            if (len)
                ansToPost()
        }).
        catch(error => Alert.alert("error", error.message));
    }

    function ansToPost() {
        // Get question no.
        const question = dictonary.findIndex(obj => obj.answer === qns) + 1;
        // Send user response to server to validate ans
        postAns(word.current, question);
        
        setWordLen(0)
        word.current = "";
    }

    /**
     * POST user response and return is_correct
     * @param {string} ans
     * @param {string} qns
     */
    function postAns(ans, qns) {
        // Force ans and qns to load before sending (published issue)
        console.log(ans);
        console.log(qns);

        const uploadData = new FormData();
        uploadData.append('response', ans);
        uploadData.append('practise_question', qns);

        fetch(PRACTICE_ANS_API, {
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
            setMarking(responseJson.is_correct);
            setWrong(responseJson.wrong_letters);
        }).
        catch(() => {
            setMarking(false); // When answer is not in possible answer
        })
        ;
    }

    /**
     * To derive a random number (for randomising question)
     * @param {int} min
     * @param {int} max
     * @returns {int} random number
     */
    function getRandNumber(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


    /**
     * GET practise question
     */
    function getQns() {
        setMarking(null)
        // setLetter("")
        fetch(PRACTICE_QNS_API, {
            method:"GET"
        }).
        then(response => response.json()).
        then(responseJson => {
            // Get random question from json
            let {answer} = responseJson[getRandNumber(0, responseJson.length - 1)];
            setDictonary(responseJson); // Store possible answers
            setQns(answer); // Set question
            setQnLen(answer.length)
        }).
        catch(error => {
            setLoading(false);
            Alert.alert("error", error.message)
        });
    }

    // Checks for camera permission
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
                <Text style={styles.header}> PRACTISE </Text>
                <View style={styles.rectangle}/>
                <Text style={QStyles.prompt}>Take pictures of the corresponding ASL to this question, 1 letter at a time. Press 'circle' to snap!</Text>
                <Text style={styles.qnText}>{qns}</Text>
            </LinearGradient>
            <View style={QStyles.cameraContainer}>
                <Spinner visible={loading} textStyle={styles.loadingtText} textContent={'Translating...'}/>
                {/*isFocused prevents camera feed from not rendering upon navigating other screens*/}
                {isFocused && <Camera ref={ref => setCamera(ref)} style={QStyles.fixedRatio} type={type}>
                    {/*Button for flip camera*/}
                    <View style={styles.flip}>
                        <Button icon={<Ionicons name="md-camera-reverse-outline" size={40} color="white" />}
                                type={"clear"}
                                buttonStyle={{ justifyContent: 'flex-start' }}
                                onPress={() => {
                                    setType(
                                        type === Camera.Constants.Type.back
                                            ? Camera.Constants.Type.front
                                            : Camera.Constants.Type.back
                                    );
                        }}/>
                    </View>
                    <MediaQuery minDeviceWidth={360} maxDeviceHeight={600}>
                        <Text style={styles.qnText600}>{qns}</Text>
                    </MediaQuery>
                </Camera>}
                {/*Render shutter button*/}
                <View style={styles.shutter}>
                    <Button icon={marking !== null ? <FontAwesome5 name="circle" size={40} color="transparent" />
                        : <FontAwesome5 name="circle" size={40} color="white" />}
                            type={"clear"}
                            buttonStyle={{ justifyContent: 'center' }}
                            disabled={marking !== null}
                            onPress={() => takePicture()}/>
                </View>
            </View>
            <View style={styles.whitebox} />
            <LinearGradient
                colors={["#feb157","#ffd26c"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.bottom}>
                {/*Reset and Clear Buttons*/}
                <View style={QStyles.botButton}>
                    <Button 
                            buttonStyle={{paddingLeft:30, paddingRight:30}}
                            onPress={() => {word.current = ""; setMarking(null); setWordLen(0)} }
                            titleStyle={styles.butText}
                            title={"Reset"}/>
                    <Button buttonStyle={{marginLeft:20}}
                            title="Next Question"
                            titleStyle={styles.butText}
                            onPress={() => getQns()}/>
                    
                </View>
                {/*Indicator of number of images completed and marking of user input*/}
                <View style={QStyles.bottom}>
                    { marking === null  ? (<Text style={styles.markingNull}>{wordLen} of {qnLen} completed</Text>)
                        : marking === false ? (<Text style={styles.markingFalse}>{wrong} is incorrect</Text>)
                        : marking === true ? (<Text style={styles.markingTrue}>Correct!</Text>)
                                : null
                    }
                </View>
            </LinearGradient>
        </View>
    );
}

/**
 * Stylesheet
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    cameraContainer: {
        flex: 0.8,
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
        padding: 0,
        backgroundColor: "#eaeaea",
        alignItems:'center',
        justifyContent:'center',
    },
    qnText: {
        width: 350,
        padding: "1%",
        borderWidth: 4,
        borderColor: "#eaeaea",
        borderRadius: 50,
        backgroundColor: "#eaeaea",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontFamily:"FuturaPTDemi",
        margin: "2%"
    },
    qnText600: {
        width: 350,
        padding: "1%",
        borderWidth: 4,
        borderColor: "#eaeaea",
        borderRadius: 50,
        backgroundColor: "#eaeaea",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontFamily:"FuturaPTDemi",
        position: 'absolute',
        top: "-7%",
        left: "50%",
        marginLeft: -175
    },
    markingNull: {
        marginTop: "1%",
        width: 250,
        padding: "2%",
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
        marginTop: "1%",
        width: 200,
        padding: "2%",
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
        marginTop: "1%",
        width: 200,
        padding: "2%",
        borderWidth: 0,
        borderColor: "#ff3232",
        borderRadius: 50,
        backgroundColor: "#ff3232",
        color: "#eaeaea",
        textAlign: "center",
        fontSize: 20,
        fontFamily:"FuturaPTDemi",
    },
    bottom: {
        flex: 0.3,
        borderWidth: 0,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        alignItems:'center'
    },
    top: {
        flex: 0.8,
        borderWidth: 0,
        alignItems:'center',
    },
    header: {
        marginTop: "10%",
        width: "90%",
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
        marginTop:"1%",
        marginBottom:"1%",
        width: "50%",
        height: 8,
        backgroundColor:'white',
        alignSelf:'flex-start',
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
    },
    flip: {
        bottom: 0,
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start'
    },
    shutter: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        justifyContent: 'center'
    },
    butText:{
        fontFamily:"FuturaPTDemi",
    },
    loadingtText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    whitebox: {
        position: 'absolute',
        width: "100%",
        height: "10%",
        backgroundColor: "#f2f2f2",
        bottom: 0,
    },
});

const QStyles = MediaQueryStyleSheet.create(
    {
        cameraContainer: {
            flex: 0.8,
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
        },
        fixedRatio : {
            flex: 1,
            aspectRatio:3/4,
            marginTop: "-10%"
        },
        botButton: {
            marginTop:"5%",
            marginBottom:"1%",
            flexDirection:'row',
            alignContent: 'space-around',
        },
        prompt: {
            width: "95%",
            marginTop:"1%",
            borderWidth: 0,
            borderColor: "#eaeaea",
            borderRadius: 50,
            backgroundColor: "transparent",
            color: "#20232a",
            textAlign: "center",
            fontSize: 17,
            fontFamily:"FuturaPTBook",
        },
        bottom: {},
    },
    {
        "@media (min-device-width: 320) and (max-device-height: 720)": {
            cameraContainer: {
                marginTop: 100,
                flex: 0.8,
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
            },
            fixedRatio : {
                flex: 1,
                aspectRatio:3/4,
            },
            botButton: {
                marginTop: "1.5%",
                flexDirection:'row',
                alignContent: 'space-around',
            },
            prompt: {
                width: "95%",
                marginTop:"1%",
                borderWidth: 0,
                borderColor: "#eaeaea",
                borderRadius: 50,
                backgroundColor: "transparent",
                color: "#20232a",
                textAlign: "center",
                fontSize: 15,
                fontFamily:"FuturaPTBook",
            },
        }, 
        "@media (min-device-width: 320) and (max-device-height: 680)": {
            bottom: {
                top: -5,
            },
        },
        "@media (min-device-width: 360) and (max-device-height: 600)": {
            bottom: {
                top: -6,
            },
            botButton: {
                marginTop: 1,
                flexDirection:'row',
                alignContent: 'space-around',
            },
        }
    }
);

export default PractiseScreen
