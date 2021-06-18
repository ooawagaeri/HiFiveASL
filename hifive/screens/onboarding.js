import React, { useRef } from 'react';
import { View } from 'react-native';

import Page from '../components/page.js';
import PagerView from "react-native-pager-view";
import Footer from '../components/footer.js';
import Home from './home.js';
import { useNavigation } from "@react-navigation/native";

const Onboarding = () => {
    const navigation = useNavigation();
    const pagerRef = useRef(1);
    const handlePageChange = pageNumber => {
        pagerRef.current.setPage(pageNumber);
    };

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
