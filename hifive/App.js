import React from 'react';
import AppLoading from "expo-app-loading";
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from "@use-expo/font";
import Home from './screens/HomeNavigator.js';
import Onboarding from './screens/WelcomeScreen.js';

const AppStack = createStackNavigator();

export default function App(){

    let [fontsLoaded] = useFonts({
        'FuturaPTDemi':require('./assets/fonts/FuturaPT-Demi.otf'),
        'FuturaPTBook':require('./assets/fonts/FuturaPT-Book.otf')
    });

    if (!fontsLoaded){
        return <AppLoading/>
    }

    return (
        <>
            <StatusBar style="dark" />
            <NavigationContainer>
                <AppStack.Navigator headerMode="none">
                    <AppStack.Screen name="Welcome" component={Onboarding} />
                    <AppStack.Screen name="Home" component={Home} />
                </AppStack.Navigator>
            </NavigationContainer>
        </>
    );
}
