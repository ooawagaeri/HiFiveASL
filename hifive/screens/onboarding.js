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
                        backgroundColor1="#ffd26c"
                        backgroundColor2="#feb157"
                        title="Welcome to Hi Five!"
                    />
                    <Footer
                        backgroundColor="#ffd26c"
                        rightButtonLabel="Next"
                        rightButtonPress={() => {handlePageChange(1);}}
                    />
                </View>
                <View key="2">
                    <Page
                        backgroundColor1="#ffd26c"
                        backgroundColor2="#feb157"
                        title="Get started on our camera translator!"
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
