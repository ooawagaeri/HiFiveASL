import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Onboarding from './screens/onboarding.js';
import Home from './screens/home.js';
import {useFonts} from "@use-expo/font";
import AppLoading from "expo-app-loading";

const AppStack = createStackNavigator();

export default function App(){

    let [fontsLoaded, error] = useFonts({
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
                    <AppStack.Screen name="Onboarding" component={Onboarding} />
                    <AppStack.Screen name="Home" component={Home} />
                </AppStack.Navigator>
            </NavigationContainer>
        </>
    );
}
