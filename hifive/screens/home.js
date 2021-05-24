import * as React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons' ;
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import APITest from './API'

function CameraScreen() {
    return (
        <APITest/>
        // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        //     <Text> Translation!</Text>
            
        // </View>
    );
}

function QuizScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Quiz!</Text>
        </View>
    );
}

function TranslatorScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Translator!</Text>
        </View>
    );
}

function PracticeScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Practice!</Text>
        </View>
    );
}

function VideosScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Videos!</Text>
        </View>
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
                    name="Practice"
                    component={PracticeScreen}
                    options={{tabBarLabel: 'Practice', tabBarIcon: ({ color, size }) => (
                            <FontAwesome name="hand-paper-o" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Quiz"
                    component={QuizScreen}
                    options={{tabBarLabel: 'Quiz', tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="thought-bubble" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Camera"
                    component={CameraScreen}
                    options={{tabBarLabel: 'Camera', tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="enhance-photo-translate" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Translator"
                    component={TranslatorScreen}
                    options={{tabBarLabel: 'Translator', tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="translate" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Videos"
                    component={VideosScreen}
                    options={{tabBarLabel: 'Videos', tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="youtube" color={color} size={size} />
                        ),
                    }}
                />
            </Tab.Navigator>
    );
};

export default Home;