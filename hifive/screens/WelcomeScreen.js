import React, { useRef } from 'react';
import { View } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Footer from '../components/footer.js';
import Page from '../components/page.js';
import PagerView from "react-native-pager-view";

/**
 * Welcome screen
 * @returns {JSX.Element}
 * @constructor
 */
const Onboarding = () => {
    const navigation = useNavigation();
    const pagerRef = useRef(1);

    return (
        <PagerView style={{ flex: 1 }} initialPage={0} ref={pagerRef}>
            <View key="1">
                <Page
                    title="Welcome to Hi Five!"
                />
                <Footer
                    backgroundColor="#feb157"
                    rightButtonLabel="Next"
                    rightButtonPress={() => {
                        navigation.navigate('Home');
                    }}
                />
            </View>
        </PagerView>
    );
};

export default Onboarding;
