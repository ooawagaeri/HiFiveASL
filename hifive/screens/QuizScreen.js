import * as React from 'react';
import { Text, View, StyleSheet} from 'react-native';

function QuizScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Quiz!</Text>
        </View>
    )}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaeaea'
    },
})

export default QuizScreen