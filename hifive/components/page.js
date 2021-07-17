import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Image } from 'react-native';


const Page = ({ title }) => {
    return (
        <LinearGradient
            colors={["#feb157","#ffd26c"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{flex:1}}
        >
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Image source={require('../assets/logo.png')} />
            <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 24, color: 'white', textAlign: "center", fontFamily:"FuturaPTDemi" }}>
                    {title}
                </Text>
            </View>
        </View>
        </LinearGradient>
    );
};


export default Page;