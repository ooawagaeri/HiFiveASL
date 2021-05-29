import * as React from 'react';
import {useState, useEffect, useRef} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {Camera} from "expo-camera";
import {useIsFocused} from "@react-navigation/native";
import {LinearGradient} from "expo-linear-gradient";

function PracticeScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [ans, setAns] = useState(true)
    const isFocused = useIsFocused();

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (camera) {
            const data = await camera.takePictureAsync(null);
            console.log(data.uri)
            setPreviewVisible(true)
            setImage(data.uri)
        }
    }

    function nextQn() {
        setImage(null)
        setAns(null)
        // new question
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
                <Text style={styles.qnText}>Question</Text>
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
                { ans === true ? <Button title="Next Question" onPress={() => nextQn()}/> : null}
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
        flex: 0.25,
        borderWidth: 0,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems:'center',
        flexDirection:'row',
        paddingLeft: 10,
        justifyContent: 'space-around',
    },
    top: {
        flex: 0.50,
        borderWidth: 0,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        alignItems:'center',
    },
});

export default PracticeScreen