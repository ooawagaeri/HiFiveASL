import * as React from 'react';
import { Button } from 'react-native-elements';
import { LinearGradient } from "expo-linear-gradient";
import {useCallback, useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, Image, Alert, FlatList, TouchableOpacity } from 'react-native';
import { MediaQueryStyleSheet } from "react-native-responsive";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import './Global.js'


function QuizScreen() {
    const [letters, setLetters] = useState([])
    const [question, setQn] = useState("")
    const [ans, setAns] = useState(null)
    const [currentOption, setCurrentOption] = useState(null);
    const [next, setNext] = useState(false);
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [choicesArr, setChoices] = useState([])
    const [marking, setMarking] = useState(null)

    let holdLetters =[]
    let holdImage = []
    let multipleC = []
    let holdMultiple= []

    /**
     * Upon render, load question.
     */
    useEffect(() => {
        getQns();
    }, []);

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
     * GET question from API in the form of a json file.
     * json sorts images by alphabetical order so we need to sort to the order of letters in the question.
     * Multiple choice option also derived from json file.
     */
    function getQns() {
        fetch(QUIZ_CHOICE, {
            method:"GET"
        }).
        then(response => response.json()).
        then(responseJson => {
            // Get random question from json array
            let rand = getRandNumber(0, responseJson.length - 1)
            let {gestures} = responseJson[rand];
            let {question_name} = responseJson[rand];
            let {choice} = responseJson[rand];
            holdImage = gestures
            multipleC = choice.split(`,`)
            setQn(question_name)
            arrangeChoices(multipleC)
            sortLetter(question_name, holdImage)
            setNext(false)
            setIsOptionDisabled(false)
            setCurrentOption(null)
            setMarking(null)
        }).
        catch(error => {
            setLoading(false);
            Alert.alert("error", error.message)
        });
    }

    /**
     * Sort alphabetically sorted response json to order specified in question.
     * @param {string} ans
     * @param {array} image
     */
    function sortLetter(ans,image) {
        holdLetters=[]
        let i;
        let j;
        for (i = 0; i < ans.length; i++) {
            for (j = 0; j < image.length; j++) {
                if (ans[i].toUpperCase() === image[j].name){
                    holdLetters.push({id:i,title: image[j].name, url: MEDIA + image[j].image})
                }
            }
        }
        setLetters(holdLetters)
    }

    /**
     * Add multiple choice options to array for use in flatlist
     * @param {array} choices
     */
    function arrangeChoices(choices) {
        holdMultiple=[]
        let i;
        for (i=0; i<choices.length; i++) {
            holdMultiple.push({id:i,choice:choices[i]})
        }
        setChoices(holdMultiple)
    }

    /**
     * Return ASL image with its letter as title.
     * @param {array} data
     * @returns {JSX.Element}
     * @constructor
     */
    function Slide({ data }) {
        return (
            <View
                style={{
                    height:350,
                    width:300,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Image resizeMode={"cover"} source={{ uri: data.url }} style={QStyles.carouselImage}/>

            </View>
        );
    }

    /**
     * Pagination dot that updates according to the slide of images.
     * @param index
     * @returns {JSX.Element}
     * @constructor
     */
    function Pagination({ index }) {
        return (
            <View style={styles.pagination} pointerEvents="none">
                {letters.map((_, i) => {
                    return (
                        <View
                            key={i}
                            style={[
                                styles.paginationDot,
                                index === i
                                    ? styles.paginationDotActive
                                    : styles.paginationDotInactive,
                            ]}
                        />
                    );
                })}
            </View>
        );
    }

    /**
     * Calculation of index of the current state of slideshow.
     * Returns a scrollable flatlist of images with its title and pagination dot.
     * @returns {JSX.Element}
     * @constructor
     */
    function Carousel() {
        const [index, setIndex] = useState(0);
        const indexRef = useRef(index);
        indexRef.current = index;
        const onScroll = useCallback((event) => {
            const slideSize = event.nativeEvent.layoutMeasurement.width;
            const index = event.nativeEvent.contentOffset.x / slideSize;
            const roundIndex = Math.round(index);
            const distance = Math.abs(roundIndex - index);
            const isNoMansLand = distance > 0.4;
            if (roundIndex !== indexRef.current && !isNoMansLand) {
                setIndex(roundIndex);
            }
        }, []);
        return (
            <View style={QStyles.carousel}>
                <FlatList data={letters}
                          keyExtractor={(item, _)=> item.id.toString()}
                          style={{ flex: 1 }}
                          renderItem={renderItem}
                          horizontal
                          pagingEnabled
                          showsHorizontalScrollIndicator={false}
                          onScroll={onScroll}
                />
                <Pagination index={index}/>
            </View>
        )}

    /**
     * To render slide function for flatlist.
     * @type {function({item: *})}
     */
    const renderItem = useCallback(function renderItem({ item }) {
        return <Slide data={item}/>;
    }, []);

    /**
     * Marking of user input
     * @param {string} selectedOption
     */
    const validateAns = (selectedOption) => {
        setCurrentOption(selectedOption);
        setAns(question);
        setIsOptionDisabled(true);
        setNext(true);
        if (selectedOption == question) {
            setMarking(true)
        }
        else setMarking(false)
    }

    /**
     * To render choices for multiple choice flatlist.
     * @param {json} item
     * @returns {JSX.Element}
     */
    const renderChoice = ({ item }) => (
        <Choice option={item.choice} />
    );

    /**
     * Multiple choice option which will indicate the correct answer after user complete the question.
     * @param {string} option
     * @returns {JSX.Element}
     * @constructor
     */
    const Choice = ({ option }) => (
        <TouchableOpacity
            onPress={()=> validateAns(option)}
            disabled={isOptionDisabled}
            style={{
                borderWidth: 3,
                borderColor: currentOption!=null && option == ans
                    ? "#90EE90"
                    : option == currentOption
                        ? "#ff3232"
                        : "#eaeaea",
                backgroundColor: currentOption!=null && option == ans
                    ? "#90EE90" +'20'
                    : option ==currentOption
                        ? "#ff3232" +'20'
                        : null,
                height: 60, borderRadius: 20,width:140,
                flexDirection: 'row',
                alignItems: 'center', justifyContent: 'space-between',
                paddingHorizontal: 30,
                marginVertical: 4,
                marginHorizontal:4,
            }}>
            <Text style={styles.butText}>{option}  </Text>
            {currentOption!=null && option==question
                ? (<View style={{
                        width: 30, height: 30, borderRadius: 30/2,
                        backgroundColor: "#90EE90",
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        <MaterialCommunityIcons name="check" style={{
                            color: "#eaeaea",
                            fontSize: 20
                        }} />
                    </View>
                ): option == currentOption ? (
                    <View style={{
                        width: 30, height: 30, borderRadius: 30/2,
                        backgroundColor: "#ff3232",
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        <MaterialCommunityIcons name="close" style={{
                            color: "#eaeaea",
                            fontSize: 20
                        }} />
                    </View>
                ) : (
                    <View style={{
                        width: 30, height: 30, borderRadius: 30/2,
                        backgroundColor: "transparent",
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        <MaterialCommunityIcons name="close" style={{
                            color: "transparent",
                            fontSize: 20
                        }} />
                    </View>
                )
            }
        </TouchableOpacity>)


    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#feb157","#ffd26c"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.top}>
                <Text style={styles.header}>QUIZ</Text>
                <View style={styles.rectangle}/>
                <Text style={QStyles.prompt}>Choose in the letter corresponding to this sign!</Text>
                <View style={{alignItems:"center"}}>
                    {/*Generate question images*/}
                    <Carousel styles={QStyles.carousel}/>
                    {/*To indicate if question comes with slide of images*/}
                    {question.length===1
                        ? null
                        : <MaterialCommunityIcons name="gesture-swipe-horizontal" size={24} color="black" />
                    }
                    {/*Generate options*/}
                    <FlatList
                        data={choicesArr}
                        horizontal={false}
                        renderItem={renderChoice}
                        keyExtractor={option => option.id}
                        numColumns={2}
                    />
                    {/*Indicates whether user answer is correct/wrong*/}
                    <View style={QStyles.correct}>
                        {marking === false ? (<Text style={styles.markingFalse}>Wrong answer!</Text>)
                                    : marking === true ? (<Text style={styles.markingTrue}>Correct!</Text>)
                                        : null
                        }
                    </View>
                    {/*Next question button*/}
                    <View style={QStyles.bottom}>
                        {next === true
                        ? <Button titleStyle={styles.butText} title="Next Question" onPress={() => getQns()}/>
                    : null}
                    </View>
                </View>
            </LinearGradient>
        </View>
    )}

/**
 * Stylesheet
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent'
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
        width: "35%",
        height: 8,
        backgroundColor:'white',
        alignSelf:'flex-start',
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
    },
    prompt: {
        width: 350,
        padding: 10,
        marginTop:10,
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
    },
    markingTrue: {
        marginTop: "-40%",
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
        marginTop: "-40%",
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
});

const QStyles = MediaQueryStyleSheet.create(
    {
        prompt: {
            width: 350,
            padding: 10,
            marginTop:10,
            borderWidth: 0,
            borderColor: "#eaeaea",
            borderRadius: 50,
            backgroundColor: "transparent",
            color: "#20232a",
            textAlign: "center",
            fontSize: 17,
            fontFamily:"FuturaPTBook",
        },
        carousel: {
            flex: 1,
            height:300,
            width:300
        },
        carouselImage: {
            height:300,
            width:300
        },
        correct: {
            position: "absolute",
            bottom: "22%"
        },
        bottom: {
            position: "absolute",
            bottom: "20%"
        }
    },
    {
        "@media (max-device-height: 720)": {
            prompt: {
                width: 350,
                padding: 10,
                marginTop:10,
                borderWidth: 0,
                borderColor: "#eaeaea",
                borderRadius: 50,
                backgroundColor: "transparent",
                color: "#20232a",
                textAlign: "center",
                fontSize: 15,
                fontFamily:"FuturaPTBook",
            },
            carousel: {
                flex: 1.2,
                height:220,
                width:300,
                marginTop: -50
            },
            carouselImage: {
                height:220,
                width:220
            },
            correct: {
                position: "absolute",
                bottom: "25.5%"
            },
            bottom: {
                position: "absolute",
                bottom: "24%"
            }
        },
        "@media (min-device-width: 320) and (max-device-height: 680)": {
            correct: {
                position: "absolute",
                bottom: "25%"
            },
            bottom: {
                position: "absolute",
                bottom: "24%"
            }
        },
        "@media (min-device-width: 360) and (max-device-height: 600)": {
            botButton: {
                marginTop: 1,
                flexDirection:'row',
                alignContent: 'space-around',
            },
            correct: {
                position: "absolute",
                bottom: "24.5%"
            },
            bottom: {
                position: "absolute",
                bottom: "24.5%"
            }
        }
    }
);

export default QuizScreen