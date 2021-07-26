import * as React from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { Thumbnail } from "react-native-thumbnail-video";
import { MediaQuery } from "react-native-responsive";

/**
 * data for youtube resources
 */
const DATA = [
  {
    id: 1,
    url: "https://www.youtube.com/watch?v=betAZeKRpR8",
    caption: "The Story of ASL",
  },
  {
    id: 2,
    url: "https://www.youtube.com/watch?v=u3HoC9_ir3s",
    caption: "The ASL Alphabet: American Sign Language Letters A-Z",
  },
  {
    id: 3,
    url: "https://www.youtube.com/watch?v=v1desDduz5M",
    caption: "Basic Sign Language Phrases for Beginners",
  },
  {
    id: 4,
    url: "https://www.youtube.com/watch?v=pDA_EXFTpxo",
    caption: "Dos and Don'ts of Interacting with the Deaf Community [CC]",
  },
];

/**
 * data for web resources
 */
const BLOGDATA = [
  {
    id: 1,
    banner: require("../assets/collated.jpg"),
    url: "https://drive.google.com/file/d/11-7aaVcr-d8cgzaBrJ9GlZi2bOciqpRy/view?usp=sharing",
    caption: "Collated list of ASL\nAlphabets used in HI Five",
  },
  {
    id: 2,
    banner: require("../assets/lingvano.png"),
    url: "https://www.lingvano.com/asl/blog/",
    caption: "Lingvano\nWebsite teaching ASL beyond finger spelling",
  },
];

/**
 * Render Youtube videos with thumbnail and caption
 * @param {json} item
 * @returns {JSX.Element}
 * @constructor
 */
const Vid = ({ item }) => {
  return (
    <View style={styles.videoDes}>
      <Thumbnail
        style={styles.videoSize}
        iconStyle={styles.play}
        containerStyle={styles.videoShape}
        url={item.url}
      />
      <Text style={styles.des}>{item.caption}</Text>
    </View>
  );
};

/**
 * Render online resources with thumbnail and caption
 * @param {json} item
 * @returns {JSX.Element}
 * @constructor
 */
const Link = ({ item }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        Linking.openURL(item.url);
      }}
    >
      <View style={styles.blogDes}>
        <Image style={styles.banner} source={item.banner} />
        <Text style={styles.des}>{item.caption}</Text>
      </View>
    </TouchableOpacity>
  );
};

function VideosScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#feb157", "#ffd26c"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.top}
      >
        <View style={{ flex: 0.6 }}>
          <MediaQuery maxDeviceHeight={720}>
            <Text style={styles.header720}>RESOURCES</Text>
          </MediaQuery>
          <MediaQuery minDeviceHeight={721}>
            <Text style={styles.header}>RESOURCES</Text>
          </MediaQuery>
          <View style={styles.rectangle} />
          <Text style={styles.prompt}>
            <Text style={{ fontWeight: "bold" }}>
              Videos to aid your ASL learning.
            </Text>
            <Text>{"\n"}Scroll and click on the thumbnail to play!</Text>
          </Text>
          {/*Scrollable flatlist for youtube resources*/}
          <FlatList
            data={DATA}
            renderItem={Vid}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
        <View style={{ flex: 0.5, alignContent: "center" }}>
          <Text style={styles.prompt2}>
            <Text style={{ fontWeight: "bold" }}>
              Other online resources / references.
            </Text>
            <Text>{"\n"}Scroll and click on to be redirected to the site!</Text>
          </Text>
          {/*Scrollable flatlist for web resources*/}
          <FlatList
            data={BLOGDATA}
            renderItem={Link}
            keyExtractor={(item) => item.id.toString()}
          />
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
    backgroundColor: "transparent",
  },
  header720: {
    marginTop: "10%",
    width: "90%",
    marginLeft: 20,
    borderWidth: 0,
    borderColor: "#eaeaea",
    borderRadius: 50,
    backgroundColor: "transparent",
    color: "#20232a",
    textAlign: "left",
    fontSize: 30,
    fontFamily: "FuturaPTDemi",
  },
  header: {
    marginTop: "10%",
    width: "90%",
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
    marginLeft: "-8%",
    width: 250,
    height: 8,
    backgroundColor: "white",
    alignSelf: "flex-start",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
  prompt2: {
    width: 400,
    padding: 10,
    borderWidth: 0,
    borderColor: "#eaeaea",
    borderRadius: 50,
    backgroundColor: "transparent",
    color: "#20232a",
    textAlign: "center",
    fontSize: 15,
    fontFamily: "FuturaPTBook",
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
    fontFamily: "FuturaPTBook",
  },
  top: {
    flex: 1,
    borderWidth: 0,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: "center",
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
    fontFamily: "FuturaPTBook",
  },
  videoDes: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 5,
    marginLeft: 8,
    width: "35%",
  },
  blogDes: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: -28,
    marginLeft: 8,
    width: "35%",
  },
  videoSize: {
    width: 180,
    height: 140,
  },
  play: {
    alignSelf: "center",
    marginTop: 50,
  },
  videoShape: {
    paddingLeft: 5,
  },
  des: {
    paddingLeft: 10,
    fontSize: 15,
    fontFamily: "FuturaPTDemi",
  },
  banner: {
    width: 200,
    height: 250,
    resizeMode: "center",
    marginLeft: "18%",
  },
});

export default VideosScreen;
