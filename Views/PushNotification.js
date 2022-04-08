import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Keyboard,
    Modal,
    Dimensions,
    Platform,
    ScrollView,
} from "react-native";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ImageViewer from 'react-native-image-zoom-viewer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "../constants/styles";
import Color from "../constants/Colors";
import API from '../APIs/APIs';
import Fire from "../constants/images/fire.png"
import FEP from "../constants/images/fire_escape_plan.jpeg"
import test from "../constants/images/test.png"

export default ({ route }) => {
    const detectedData = route.params;
    const URL = "http://15.164.227.45:3000";

    useEffect(() => {
        async function getDetectInfo() {
            // 알림창으로 들어온 경우
            if (detectedData == null || undefined) {
                const getData = await AsyncStorage.getItem('notify', (err, result) => { });
                if (getData != null || undefined) {
                    const notificationData = JSON.parse(getData);

                    const searchLocation = await API.serviceInfo(Number(notificationData.service_index));

                    var splitContent;
                    if (notificationData.content.includes(']')) {
                        splitContent = notificationData.content.split(']')
                        splitContent[1] = splitContent[1].split('/');
                        setContent(splitContent[0] + ']\n' + splitContent[1][0] + '\n' + splitContent[1][1])
                    }

                    setImage(URL + '/' + notificationData.image_path)
                    setImage2(URL + searchLocation[0].evacuation_guide)
                    setDetectedThing(notificationData.isFire === "0" ? "연기 감지" : "화재 감지");
                    setDetectedThingStyle(notificationData.isFire === "0" ? smokeStyle : fireStyle)

                    AsyncStorage.setItem('notifySetting', JSON.stringify({
                        'notification': 0,
                        'openNotification': 0,
                        'usePhoneNow': 0,
                        'inPushNotification': 0
                    }));
                } else {
                    console.log("메시지 설정 에러");
                    AsyncStorage.setItem('notifySetting', JSON.stringify({
                        'notification': 0,
                        'openNotification': 0,
                        'usePhoneNow': 0,
                        'inPushNotification': 0
                    }));
                }

                // 서비스 페이지에서 들어온 경우
            } else {
                const searchLocation2 = await API.serviceInfo(Number(detectedData[0]));

                setContent('[' + detectedData[2] + ']\n' + detectedData[3] + '\n' + detectedData[4] + detectedData[5]);
                setImage(URL + '/' + detectedData[6])
                setImage2(URL + searchLocation2[0].evacuation_guide)
                setDetectedThing(detectedData[1] === 0 ? "연기 감지" : "화재 감지");
                setDetectedThingStyle(detectedData[1] === 0 ? smokeStyle : fireStyle)
            }

            setInterval(async () => {
                // 감지 알림 페이지에서 다른 알림을 눌러 최신화하는 경우
                const getData = await AsyncStorage.getItem('notify', (err, result) => { });
                const getData2 = await AsyncStorage.getItem('notifySetting', (err, result) => { });
                // console.log("notify : ", getData);
                // console.log("notifySetting : ", getData2);
                // console.log("\n/////////////////////////////////////\n");
                // console.log(getData);
                // console.log(getData2);

                if (getData != null || undefined || {}) {
                    const notificationData = JSON.parse(getData);
                    const notificationData2 = JSON.parse(getData2);
                    if (notificationData2.notification == 1 && notificationData2.openNotification == 1 && notificationData2.usePhoneNow == 0 && notificationData2.inPushNotification == 0) {
                        var splitContent;
                        if (notificationData.content.includes(']')) {
                            splitContent = notificationData.content.split(']');
                            splitContent[1] = splitContent[1].split('/');
                            setContent(splitContent[0] + ']\n' + splitContent[1][0] + '\n' + splitContent[1][1]);
                        }

                        const searchLocation = await API.serviceInfo(Number(notificationData.service_index));

                        setImage(URL + '/' + notificationData.image_path);
                        setImage2(URL + searchLocation[0].evacuation_guide);
                        setDetectedThing(notificationData.isFire === "0" ? "연기 감지" : "화재 감지");
                        setDetectedThingStyle(notificationData.isFire === "0" ? smokeStyle : fireStyle);

                        AsyncStorage.setItem('notifySetting', JSON.stringify({
                            'notification': 0,
                            'openNotification': 0,
                            'usePhoneNow': 0,
                            'inPushNotification': 0
                        }));
                    }
                    // 감지 페이지에서 다른 알림을 누른 경우
                    else if (notificationData2.notification == 1 && notificationData2.openNotification == 1 && notificationData2.usePhoneNow == 1 && notificationData2.inPushNotification == 0) {
                        var splitContent;
                        if (notificationData.content.includes(']')) {
                            splitContent = notificationData.content.split(']');
                            splitContent[1] = splitContent[1].split('/');
                            setContent(splitContent[0] + ']\n' + splitContent[1][0] + '\n' + splitContent[1][1]);
                        }

                        const searchLocation = await API.serviceInfo(Number(notificationData.service_index));

                        setImage(URL + '/' + notificationData.image_path);
                        setImage2(URL + searchLocation[0].evacuation_guide);
                        setDetectedThing(notificationData.isFire === "0" ? "연기 감지" : "화재 감지");
                        setDetectedThingStyle(notificationData.isFire === "0" ? smokeStyle : fireStyle);

                        AsyncStorage.setItem('notifySetting', JSON.stringify({
                            'notification': 0,
                            'openNotification': 0,
                            'usePhoneNow': 0,
                            'inPushNotification': 0
                        }));
                    }
                }
            }, 100)
        }
        getDetectInfo();
    }, [])

    useEffect(() => {
        async function getImageStatus() {
          const status = await API.testImageURL(image);
          //console.log("status : ", status);
          setImageStatus(status)
        }
        getImageStatus();
    }, [image])
    
    useEffect(() => {
        async function getImageStatus2() {
            const status2 = await API.testImageURL(image2);
            //console.log("status2 : ", status2);
          setImageStatus2(status2)
        }
        getImageStatus2();
      }, [image2])

    var fireStyle = styles.fireStyle;
    var smokeStyle = styles.smokeStyle;


    const [modalVisible, setModalVisible] = useState(false);
    const [content, setContent] = useState("[2021-11-12 20:01:35]\n경상북도 경산시 하양읍 하양로 13-13\nUPSITE 102호");
    const [detectedThing, setDetectedThing] = useState("화재 감지");
    const [detectedThingStyle, setDetectedThingStyle] = useState(fireStyle);

    const [imageOrder, setImageOrder] = useState(0);
    // 감지된 사진
    const [image, setImage] = useState(URL);
    // 대피도
    const [image2, setImage2] = useState(URL);
    const dimensions = Dimensions.get('window');
    const [imageWidth, setImageWidth] = useState(Math.round(dimensions.width));
    const [imageHeight, setImageHeight] = useState(Math.round(Platform.OS === 'android' ? dimensions.height / 2 : dimensions.height / 2));
    // 이미지 Status Check
  const [imageStatus, setImageStatus] = useState("");
  const [imageStatus2, setImageStatus2] = useState("");

    return (
        <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={Keyboard.dismiss}>

            <ScrollView style={{ flex: 1, backgroundColor: '#ffffff' }}>


                <View style={styles.serviceContainer}>

                    <View style={{ display: Platform.OS === "ios" ? "flex" : "none", backgroundColor: "#000000", width: "100%", height: getStatusBarHeight() }}>
                    </View>

                    <View style={detectedThingStyle}>

                        <Text style={styles.detectedTitle}>{detectedThing}</Text>

                    </View>

                    <View style={{ width: "100%", backgroundColor: Color.itemColor, padding: 10 }}>
                        {/* <Text style={styles.pNTitle}>{detectedData[1]}</Text> */}
                        <Text numberOfLines={3} style={styles.pNTitle2}>{content}</Text>
                    </View>

                    <View>

                        <TouchableOpacity style={{ marginTop: "2%" }} onPress={() => {
                            setImageOrder(0)
                            setModalVisible(true)
                        }}>

                            <Image
                                style={{ width: imageWidth, height: imageHeight / 2 }}
                                resizeMode="contain"
                                // source={{ uri: image }} />
                                source={test} />

                        </TouchableOpacity>

                    </View>

                    <View style={styles.serviceDetectedNList}>
                        <Text style={styles.headerTitle}>대피도</Text>
                    </View>

                    <TouchableOpacity onPress={() => {
                        setImageOrder(1)
                        setModalVisible(true)
                    }}>

                        <Image
                            style={{ width: imageWidth, height: imageHeight / 2 }}
                            resizeMode="contain"
                            // source={{ uri: image2 }} />
                            source={FEP} />

                    </TouchableOpacity>

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onShow={()=>{
                            console.log(image);
                            console.log(image2);
                        }}>
                        <View style={{ flex: 1, width: '100%', height: "100%", backgroundColor: 'rgba(0,0,0,0.5)', alignContent: 'center' }} >

                            <ImageViewer
                                imageUrls={[{
                                    url: imageOrder === 0 ? image : image2,
                                    width: Math.round(Platform.OS === 'android' ? dimensions.width : dimensions.width),
                                    height: Math.round(Platform.OS === 'android' ? dimensions.height / 3 : dimensions.height / 2.5),
                                    props: {
                                        resizeMode: 'contain'
                                      },
                                }]}
                                onDoubleClick={() => {
                                    setModalVisible(false)
                                }}
                                onSwipeDown={()=>{
                                    setModalVisible(false)
                                }}
                                enableSwipeDown={true}
                                style={{ width: "100%", height: "100%", resizeMode: 'contain' }}
                                backgroundColor='rgba(0,0,0,0.0)'
                                // 이미지 개수 표시
                                renderIndicator={() => null} />

                        </View>
                    </Modal>

                </View>
            </ScrollView>

        </TouchableWithoutFeedback>
    )
};