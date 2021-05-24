import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {Image} from 'react-native' ;
import { LinearGradient } from 'expo-linear-gradient';



const Page = ({ title }) => {
    return (
        <LinearGradient
            colors={["#ff7538","#ffd26c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{flex:1}}
        >
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Image source={require('./logo.png')} />
            <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
                    {title}
                </Text>
            </View>
        </View>
        </LinearGradient>
    );
};


export default Page;