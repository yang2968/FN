import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import styles from "../constants/styles";
import API from '../APIs/APIs';

export default ({ route, navigation }) => {

    useEffect(() => {
        async function getLocations() {
            const locationData = await API.getServiceList();
            console.log(locationData);
            var splitLocationData = [];
            if (locationData != "error") {
                for (var i = 0; i < locationData.length; i++) {
                    if (locationData[i].location.includes('/')) {
                        var splitLocation = locationData[i].location.split('/');
                        splitLocationData.push({ 'location': splitLocation, 'service_index': locationData[i].service_index });
                    }
                }
                setLocations(splitLocationData);
            }


            // 5초마다 위치 업데이트
            setInterval(async () => {

                Geolocation.getCurrentPosition(
                    async (position) => {
                        const getData = await AsyncStorage.getItem('userInfo', (err, result) => { });
                        const getUserIndex = JSON.parse(getData);
                        const updateLocationData = await API.setPosition(getUserIndex.userIndex, position.coords.latitude, position.coords.longitude);
                        console.log("업데이트 위치", updateLocationData);

                    },
                    (error) => {
                        // See error code charts below.
                        console.log(error.code, error.message);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
                console.log("5초마다 업데이트");


            }, 5000)

            // 앱을 사용하고 있는 경우, 1초마다 알림 체크
            setInterval(async () => {
                const getData = await AsyncStorage.getItem('notifySetting', (err, result) => { });
                if (getData != null || undefined || {}) {
                    const notificationData = JSON.parse(getData);
                    // 앱이 현재 실행되고 있을 때 메시지가 온 경우
                    if (notificationData.notification == 1 && notificationData.openNotification == 0 && notificationData.usePhoneNow == 0 && notificationData.inPushNotification == 0) {
                        console.log("앱이 완전히 종료되었다가 실행된 경우", route.name);
                        navigation.navigate("PushNotification");
                    }
                    // 앱이 현재 실행되고 있을 때 메시지가 온 경우
                    else if (notificationData.notification == 1 && notificationData.openNotification == 1 && notificationData.usePhoneNow == 0 && notificationData.inPushNotification == 0) {
                        console.log("앱이 현재 실행되고 있을 때 메시지가 온 경우", route.name);
                        if (route.name != 'PushNotification') {
                            navigation.navigate("PushNotification");
                        }
                    }
                    // 앱이 백그라운드 상태에 있을 때 메시지가 온 경우
                    else if (notificationData.notification == 1 && notificationData.openNotification == 1 && notificationData.usePhoneNow == 1 && notificationData.inPushNotification == 0) {
                        console.log("앱이 백그라운드 상태에 있을 때 메시지가 온 경우", route.name);
                        if (route.name != 'PushNotification') {
                            navigation.navigate("PushNotification");
                        }
                    }
                }
            }, 100)
        }
        getLocations();
    }, [])

    const [locations, setLocations] = useState([]);

    // Flatlist에 렌더링될 아이템 설정
    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.mainItem}
                onPress={() => {
                    navigation.navigate("Service", [item.location[0], item.location[1], item.service_index]);
                }}>

                <Text style={styles.mainTitle}>{item.location[0]}</Text>
                <Text numberOfLines={1} style={styles.mainTitle2}>{item.location[1]}</Text>

            </TouchableOpacity>
        )
    };

    return (
        <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={Keyboard.dismiss}>
            <View style={styles.mainContainer}>

                {
                    locations.length === 0 ?
                        (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: "#000000", fontSize: 20 }}>등록된 장소 없음</Text>
                            </View>
                        ) :
                        (
                            <FlatList
                                style={{ paddingTop: "2%" }}
                                data={locations}
                                renderItem={renderItem}
                                keyExtractor={item => item.service_index} />
                        )
                }

            </View>

        </TouchableWithoutFeedback>
    )
};