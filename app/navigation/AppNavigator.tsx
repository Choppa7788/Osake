import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyBar from '../pages/myBar';
import AddDrink from '../pages/addDrink';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="MyBar">
                <Stack.Screen name="MyBar" component={MyBar} />
                <Stack.Screen name="AddDrink" component={AddDrink} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
