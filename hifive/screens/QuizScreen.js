import * as React from 'react';
import { Button } from 'react-native-elements';
import { LinearGradient } from "expo-linear-gradient";
import {useCallback, useEffect, useRef, useState} from "react";
import {Text, View, StyleSheet, Image, Alert, FlatList, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons} from "@expo/vector-icons";
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

    useEffect(() => {
        getQns();
    }, []);

    function getRandNumber(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // GET question
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

    function arrangeChoices(choices) {
        holdMultiple=[]
        let i;
        for (i=0; i<choices.length; i++) {
            holdMultiple.push({id:i,choice:choices[i]})
        }
        setChoices(holdMultiple)
    }

    function Slide({ data }) {
        return (
            <View
                style={{
                    height:350,
                    width:300,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Image resizeMode={"contain"} source={{ uri: data.url }} style={{width: 300, height:300}}/>

            </View>
        );
    }

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
            <View style={{flex:4,height:300,width:300}}>
                <FlatList data={letters}
                          keyExtractor={(item, index)=> item.id.toString()}
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

    const renderItem = useCallback(function renderItem({ item }) {
        return <Slide data={item}/>;
    }, []);

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
    const renderChoice = ({ item }) => (
        <Choice option={item.choice} />
    );
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
                height: 60, borderRadius: 20,
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
                <Text style={styles.prompt}>Key in the letter corresponding to this sign!</Text>
                <View style={{alignItems:"center", flex:1}}>
                    <Carousel />
                    {question.length===1
                        ? null
                        : <MaterialCommunityIcons name="gesture-swipe-horizontal" size={24} color="black" />
                    }
                    <FlatList
                    data={choicesArr}
                    horizontal={false}
                    renderItem={renderChoice}
                    keyExtractor={option => option.id}
                    numColumns={2}
                    />
                    <View style={{flex:0.5,marginTop:0}}>
                        <View>
                            {marking === false ? (<Text style={styles.markingFalse}>Wrong answer!</Text>)
                                        : marking === true ? (<Text style={styles.markingTrue}>Correct!</Text>)
                                            : null
                            }
                        </View>
                    {next === true
                        ? <Button buttonStyle={styles.butText} title="Next Question" onPress={() => getQns()}/>
                        : null}
                    </View>
                </View>
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
    },
    markingTrue: {
        marginTop: -50,
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
        marginTop: -50,
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
})

export default QuizScreen