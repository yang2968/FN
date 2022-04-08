import React, { useEffect, useState } from "react";
import { AppState, TouchableOpacity, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from 'react-native-vector-icons/dist/Ionicons';
import Color from "../constants/Colors";
import styles from "../constants/styles";
import Main from "../Views/Main";
import Service from "../Views/Service";
import PushNotification from "../Views/PushNotification";


const Stack = createStackNavigator();
// 헤더 이름
const LogoTitle = () => {

    return (
        <View>
            <Text style={styles.headerTitle}>FIAS</Text>
        </View>
    );
}

export default () => {
    return (
        <Stack.Navigator
            initialRouteName={"PushNotification"}
            screenOptions={({ navigation, route }) => ({
                headerTitle: props => <LogoTitle {...props} />,
                // 뒤로가기 버튼에 전 스택스크린이름표시여부
                headerBackTitleVisible: false,
                headerStyle: {
                    backgroundColor: Color.stackHeader
                },
                headerTitleAlign: "center",
                headerLeft: () => {
                    let iconName = Platform.OS === "ios" ? "ios-" : "md-";

                    if (route.name != "Main") {
                        iconName += "chevron-back";
                        return (
                            // 뒤로가기 버튼
                            <TouchableOpacity
                                style={{ marginLeft: 10 }}
                                onPress={() => navigation.goBack()}>
                                <Icon
                                    name={iconName}
                                    size={30}
                                    color={"#ffffff"} />
                            </TouchableOpacity>
                        )
                    }
                }
            })}>

            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Service" component={Service} />
            <Stack.Screen name="PushNotification" component={PushNotification} options={{ headerShown: false }} />

        </Stack.Navigator>
    )
}