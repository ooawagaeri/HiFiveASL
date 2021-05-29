import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Onboarding from './screens/onboarding.js';
import Home from './screens/home.js';

const AppStack = createStackNavigator();

export default function App(){
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
