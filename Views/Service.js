import React, { useState, useEffect } from "react";
import {
    Image,
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Keyboard,
    Platform,
    FlatList,
    Modal,
    Dimensions
} from "react-native";
import ImageViewer from 'react-native-image-zoom-viewer';
import styles from "../constants/styles";
import API from '../APIs/APIs';

export default ({ route, navigation }) => {

    const placeInfo = route.params;
    const URL = "http://15.164.227.45:3000";

    useEffect(() => {
        async function getDetectInfo() {
            const searchLocation = await API.serviceInfo(placeInfo[2]);
            const detectLocation = await API.detectInfo(placeInfo[2]);
            setImage(URL + searchLocation[0].evacuation_guide)
            setDetectInfo(detectLocation);
        }
        getDetectInfo();
    }, [])

    const dimensions = Dimensions.get('window');
    const [detectInfo, setDetectInfo] = useState([]);
    const [image, setImage] = useState(URL);
    const [imageWidth, setImageWidth] = useState(Math.round(dimensions.width));
    const [imageHeight, setImageHeight] = useState(Math.round(Platform.OS === 'android' ? dimensions.height / 3 : dimensions.height / 2));
    const [modalVisible, setModalVisible] = useState(false);

    // Flatlist에 렌더링될 아이템 설정
    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.serviceDetectedNListItem}
                onPress={() => {
                    navigation.navigate("PushNotification", [item.service_index, item.isFire, item.detect_time, placeInfo[0], placeInfo[1], item.area, item.image_path]);
                }}>

                <Text style={styles.mainTitle}>{item.detect_time}</Text>
                <Text numberOfLines={1} style={styles.mainTitle2}>{item.area}</Text>

            </TouchableOpacity>
        )
    };

    return (
        <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={Keyboard.dismiss}>


            <View style={styles.serviceContainer}>

                <View style={{ margin: "5%" }}>
                    <Text style={styles.serviceTitle}>{placeInfo[0]}</Text>
                    <Text numberOfLines={2} style={styles.serviceTitle2}>{placeInfo[1]}</Text>
                </View>

                <View>

                    <TouchableOpacity onPress={() => { setModalVisible(true) }}>

                        <Image
                            style={{ width: imageWidth, height: Platform.OS === 'android' ? dimensions.height / 3 : dimensions.height / 2 - 100 }}
                            resizeMode="contain"
                            source={{ uri: image }} />

                    </TouchableOpacity>

                    <View>
                        <Text style={styles.serviceTitle}>대피도</Text>
                    </View>


                </View>

                <View style={styles.serviceDetectedNList}>
                    <Text style={styles.headerTitle}>화재 감지 내역</Text>
                </View>

                {
                    detectInfo.length === 0 ?
                        (
                            <View>
                                <Text style={{ color: "#000000", fontSize: 20 }}>내역 없음</Text>
                            </View>
                        ) :
                        (
                            <FlatList
                                style={{ width: "90%" }}
                                data={detectInfo}
                                renderItem={renderItem}
                                keyExtractor={item => item.idx} />
                        )
                }

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}>
                    <View style={{ flex: 1, width: dimensions.width, height: dimensions.height, backgroundColor: 'rgba(0,0,0,0.5)', alignContent: 'center' }} >

                        <ImageViewer
                            imageUrls={[{
                                url: image,
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
                            backgroundColor='rgba(0,0,0,0.0)'
                            // 이미지 개수 표시
                            renderIndicator={() => null} />

                    </View>
                </Modal>

            </View>

        </TouchableWithoutFeedback>
    )
};