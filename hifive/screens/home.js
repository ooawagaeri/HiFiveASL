import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons' ;
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import APITest from './API'
import CameraScreen from "./CameraScreen";
import QuizScreen from "./QuizScreen";
import TranslatorScreen from "./TranslatorScreen";
import PractiseScreen from "./PractiseScreen";
import VideosScreen from "./VideosScreen";

const CamStack = createStackNavigator();
const PracStack = createStackNavigator();
const QuizStack = createStackNavigator();
const TransStack = createStackNavigator();
const VideosStack = createStackNavigator();


function CamStackScreen() {
    return (
        <CamStack.Navigator headerMode="none">
            <CamStack.Screen name="Sign to Text" component={CameraScreen} options={{headerLeft:null,headerStyle:{backgroundColor: '#ffd26c'},}}/>
        </CamStack.Navigator>
    );
}

function QuizStackScreen() {
    return (
        <QuizStack.Navigator>
            <QuizStack.Screen name="Quiz" component={QuizScreen} options={{headerLeft:null,headerStyle:{backgroundColor: '#ffd26c'},}}/>
        </QuizStack.Navigator>
    );
}

function TransStackScreen() {
    return (
        <TransStack.Navigator>
            <TransStack.Screen name="Text to Sign" component={TranslatorScreen} options={{headerLeft:null,headerStyle:{backgroundColor: '#ffd26c'},}}/>
        </TransStack.Navigator>
    );
}

function PracStackScreen() {
    return (
        <PracStack.Navigator>
            <PracStack.Screen name="Gesture Practise" component={PractiseScreen} options={{headerLeft:null,headerStyle:{backgroundColor: '#ffd26c'},}}/>
        </PracStack.Navigator>
    );
}

function VideosStackScreen() {
    return (
        <VideosStack.Navigator>
            <VideosStack.Screen name="Video Resources" component={VideosScreen} options={{headerLeft:null,headerStyle:{backgroundColor: '#ffd26c'},}}/>
        </VideosStack.Navigator>
    );
}

const Tab = createBottomTabNavigator();

const Home = () => {
    return (
            <Tab.Navigator
                initialRouteName="Camera"
                tabBarOptions={{
                    activeTintColor: 'tomato',
                    inactiveTintColor: 'grey',
                }}
            >
                <Tab.Screen
                    name="Practise"
                    component={PracStackScreen}
                    options={{tabBarLabel: 'Practise', tabBarIcon: ({ color, size }) => (
                            <FontAwesome name="hand-paper-o" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Quiz"
                    component={QuizStackScreen}
                    options={{tabBarLabel: 'Quiz', tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="thought-bubble" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Camera"
                    component={CamStackScreen}
                    options={{tabBarLabel: 'Camera', tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="enhance-photo-translate" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Translator"
                    component={TransStackScreen}
                    options={{tabBarLabel: 'Translator', tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="translate" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Videos"
                    component={VideosStackScreen}
                    options={{tabBarLabel: 'Videos', tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="youtube" color={color} size={size} />
                        ),
                    }}
                />
            </Tab.Navigator>
    );
};

export default Home;