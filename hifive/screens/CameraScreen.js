import React, { useState, useEffect, useRef } from "react";
import { Camera } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Root, Popup } from 'popup-ui'
import { Alert, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Button } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import { MediaQueryStyleSheet } from "react-native-responsive";
import "./Global.js";

function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [name, setName] = useState("Press to start");
  const [type, setType] = useState(Camera.Constants.Type.front);

  const [loading, setLoading] = useState(false);
  const [buttonIcon, setButtonIcon] = useState("play");
  const iconPosition = useRef(false);

  const isFocused = useIsFocused();

  /**
   * Upon render, request camera permissions.
   */
  useEffect(() => {
    if (isFocused) {
      (async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === "granted");
      })();
    }

    setName('Press "Play" to start');
    setButtonIcon("play");
    setLoading(false);
    iconPosition.current = false;
  }, [isFocused]);

  /**
   * Play/Stop button for live translation.
   * @returns {Promise<void>}
   */
  const takePicture = async () => {
    if (camera) {
      if (!previewVisible) {
        setPreviewVisible(true);
      }
      if (iconPosition.current) {
        setButtonIcon("stop");
        const data = await camera.takePictureAsync(null);
        setLoading(true);
        postASL(data);
      } else {
        setButtonIcon("play");
        setLoading(false);
        return;
      }
    }
  };

  /**
   * POST user image.
   * GET response from API (corresponding letter)
   * @param result (photo data)
   */
  const postASL = (result) => {
    let localUri = result.uri;
    let filename = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    const uploadData = new FormData();
    uploadData.append("image", { uri: localUri, name: filename, type });

    fetch(ASL_API, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: uploadData,
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Network response was not ok");
      })
      .then((responseJson) => {
        if (responseJson.name === "nothing")
          responseJson.name = "No Hand Detected";

        setName(responseJson.name);
      })
      .then(() => {
        setLoading(false);
        setTimeout(function () {
          if (iconPosition.current)
            takePicture().catch(() => {
              iconPosition.current = false;
            });
        }, 500);
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("error", error.message);
      });
  };

  // Checks for camera permission
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Root>
    <View style={styles.container}>
      <LinearGradient
        colors={["#feb157", "#ffd26c"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.top}
      >
        <Text style={styles.header}>SIGN-TO-TEXT</Text>
        <View style={styles.rectangle} />
        <TouchableOpacity
            style={{position: "absolute", marginTop: "12%", right: "7%"}}
            onPress={() =>
              Popup.show({
                type: 'Warning',
                title: 'Tips for Best Accuracy',
                textBody:
                 'A well-light room,\nSteady image,\nEmpty background, &nFollow the gestures closely!',
                buttontext: 'Continue',
                callback: () => Popup.hide(),
              })
            }>
             <FontAwesome5 name="question-circle" size={30} color={'white'}/>
          </TouchableOpacity>
        <Text style={QStyles.prompt}>
          Take a picture showing us the sign language{"\n"}letter to translate!
          Use your right hand and begin!
        </Text>
      </LinearGradient>
      <View style={styles.cameraContainer}>
        {/*isFocused prevents camera feed from not rendering upon navigating other screens*/}
        {isFocused && (
          <Camera
            ref={(ref) => setCamera(ref)}
            style={styles.fixedRatio}
            type={type}
          >
            {/*Button for flip camera*/}
            <View style={styles.flip}>
              <Button
                icon={
                  <Ionicons
                    name="md-camera-reverse-outline"
                    size={40}
                    color="white"
                  />
                }
                type={"clear"}
                buttonStyle={{ justifyContent: "flex-start" }}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              />
            </View>
          </Camera>
        )}
        {/*Show "Translating..."*/}
        {loading && (
          <View style={QStyles.loading}>
            <ActivityIndicator size="large" color="#f2f2f2" />
            <Text style={QStyles.loadingtText}>Translating . . .</Text>
          </View>
        )}
        {/*Render play/stop button*/}
        <View style={styles.shutter}>
          <Button
            icon={<FontAwesome5 name={buttonIcon} size={40} color="white" />}
            type={"clear"}
            buttonStyle={{ justifyContent: "center" }}
            onPress={() => {
              iconPosition.current = !iconPosition.current;
              takePicture();
            }}
          />
        </View>
      </View>
      <View style={styles.whitebox} />
      <LinearGradient
        colors={["#feb157", "#ffd26c"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.bottom}
      >
        <Text style={styles.ansText}>{name}</Text>
      </LinearGradient>
    </View>
    </Root>
  );
}

/**
 * Stylesheet
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 3 / 4,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  flip: {
    bottom: 0,
    flexDirection: "row",
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
  },
  shutter: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    flex: 1,
    width: "100%",
    paddingBottom: "1%",
    justifyContent: "center",
  },
  previewBox: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    textAlign: "center",
  },
  ansContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: "#eaeaea",
    alignItems: "center",
    justifyContent: "center",
  },
  ansText: {
    marginTop: "5%",
    marginBottom: 0,
    width: "90%",
    padding: "2%",
    borderWidth: 4,
    borderColor: "#eaeaea",
    borderRadius: 50,
    backgroundColor: "#eaeaea",
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontFamily: "FuturaPTDemi",
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
    fontFamily: "FuturaPTDemi",
  },
  rectangle: {
    marginTop: "1%",
    marginBottom: "1%",
    width: "65%",
    height: 8,
    backgroundColor: "white",
    alignSelf: "flex-start",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
  bottom: {
    flex: 0.5,
    borderWidth: 0,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: "center",
  },
  top: {
    flex: 1,
    borderWidth: 0,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: "center",
  },
  loading: {
    width: 150,
    position: "absolute",
    top: "25%",
    left: "50%",
    marginLeft: -75,
  },
  loadingtText: {
    paddingTop: "25%",
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  whitebox: {
    position: "absolute",
    width: "100%",
    height: "10%",
    backgroundColor: "#f2f2f2",
    bottom: 0,
  },
});

const QStyles = MediaQueryStyleSheet.create(
  {
    prompt: {
      width: 350,
      padding: 10,
      marginTop: 10,
      borderWidth: 0,
      borderColor: "#eaeaea",
      borderRadius: 50,
      backgroundColor: "transparent",
      color: "#20232a",
      textAlign: "center",
      fontSize: 17,
      fontFamily: "FuturaPTBook",
    },
    loading: {
      width: 150,
      position: "absolute",
      top: "25%",
      left: "50%",
      marginLeft: -75,
    },
    loadingtText: {
      paddingTop: "25%",
      textAlign: "center",
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
  },
  {
    "@media (max-device-height: 720)": {
      prompt: {
        width: 350,
        padding: 10,
        marginTop: 0,
        borderWidth: 0,
        borderColor: "#eaeaea",
        borderRadius: 50,
        backgroundColor: "transparent",
        color: "#20232a",
        textAlign: "center",
        fontSize: 15,
        fontFamily: "FuturaPTBook",
      },
      loading: {
        width: 150,
        position: "absolute",
        top: "11%",
        left: "50%",
        marginLeft: -75,
      },
    },
  }
);

export default CameraScreen;
