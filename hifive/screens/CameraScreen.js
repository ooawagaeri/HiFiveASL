import React, {useState, useEffect} from 'react';
import { Alert, StyleSheet, Text, View, Image} from 'react-native';
import { Button } from 'react-native-elements';
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import './Global.js'
import { Ionicons } from '@expo/vector-icons';

function CameraScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [name, setName] = useState('Answer')
    const [type, setType] = useState(Camera.Constants.Type.front);
    const [loading,setLoading] = useState(false)
    const isFocused = useIsFocused();

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted'); 
        })();
    }, []);

    const takePicture = async () => {
        if (camera) {
            if (!previewVisible) {
                setPreviewVisible(true);
            }
            console.log('snip');
            setLoading(true);
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
            if (responseJson.name === '') throw new Error('No letter');
            setName(responseJson.name);
            setLoading(false);
        })
        .catch(error => {
            console.error(error);
            takePicture()
        });
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
                <Text style={styles.header}>SIGN-TO-TEXT</Text>
                <View style={styles.rectangle}/>
                <Text style={styles.prompt}>Show us the sign language to translate!</Text>
            </LinearGradient>
                <View style={styles.cameraContainer}>
                    <Spinner visible={loading} textContent={'Loading...'}/>
                    {isFocused && <Camera ref={ref => setCamera(ref)} style={styles.fixedRatio} type={type}>
                        <View style={styles.flip}>
                            <Button icon={<Ionicons name="md-camera-reverse-outline" size={40} color="black" />}
                                    type={"clear"}
                                    buttonStyle={{ justifyContent: 'flex-start' }}
                                    onPress={() => {
                                        setType(
                                            type === Camera.Constants.Type.back
                                                ? Camera.Constants.Type.front
                                                : Camera.Constants.Type.back
                                        );
                            }}>
                            </Button>
                        </View>
                    </Camera>}
                    <View style={styles.shutter}>
                        <Button icon={<Ionicons name="camera-outline" size={40} color="black" />}
                                type={"clear"}
                                buttonStyle={{ justifyContent: 'center' }}
                                onPress={() => takePicture()}/>
                    </View>
                </View>
                <LinearGradient
                    colors={["#feb157","#ffd26c"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.bottom}>
                    <Text style={styles.ansText}>{name}</Text>
                </LinearGradient>
        </View>
        );
    }


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    ansText: {
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
        padding: 23,
        borderWidth: 0,
        borderColor: "#eaeaea",
        borderRadius: 50,
        backgroundColor: "transparent",
        color: "#20232a",
        textAlign: "center",
        fontSize: 15,
    },
    bottom: {
        flex: 0.45,
        borderWidth: 0,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems:'center',
    },
    top: {
        flex: 0.7,
        borderWidth: 0,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        alignItems:'center',
    },
});

export default CameraScreen