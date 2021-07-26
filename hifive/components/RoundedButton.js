import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

/**
 * Rounded button used in the footer page
 * @param {string} label
 * @param {function} onPress
 * @returns {JSX.Element}
 * @constructor
 */
const RoundedButton = ({ label, onPress }) => {
    return (
        <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center' }}
            onPress={onPress}
        >
            <Text style={{ fontSize: 22, color: 'white', fontFamily:"FuturaPTDemi" }}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

export default RoundedButton;