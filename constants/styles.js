import { StyleSheet } from "react-native";
import Color from "./Colors";

const styles = StyleSheet.create({

    headerTitle: {
      color: "#ffffff",
      fontWeight: "bold",
      fontSize: 20,
      textAlign: "center"
    },
    mainContainer: {
        flex: 1,
        backgroundColor: "#ffffff"
    },
    mainItem: {
        backgroundColor: Color.itemColor,
        borderColor : "#ffffff",
        borderRadius : 10,
        margin: "2%",
        padding: "5%"
    },
    mainTitle: {
        color: "#000000",
        fontSize: 15
    },
    mainTitle2: {
        color: "#000000",
        fontWeight: "bold",
        fontSize: 20,
    },
    serviceContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
        alignItems: "center"
    },
    serviceTitle: {
        color: "#000000",
        fontSize: 15,
        textAlign: "center"
    },
    serviceTitle2: {
        color: "#000000",
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center"
    },
    serviceDetectedNList: {
        width: "90%",
        backgroundColor: Color.stackHeader,
        borderColor : "#ffffff",
        borderRadius : 10,
        margin: "2%",
        padding: "6%",
    },
    serviceDetectedNListItem: {
        backgroundColor: "#ffffff",
        borderColor: "#000000",
        borderBottomWidth: 1,
        padding: "5%"
    },
    pNTitle: {
        color: "#000000",
        fontSize: 15,
    },
    pNTitle2: {
        color: "#000000",
        fontWeight: "bold",
        fontSize: 18,
    },
    detectedTitle: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 40,
        textAlign: "center"
      },
      fireStyle: {
        width: "100%",
        padding: "5%",
        backgroundColor: "#9E3834"
      },
      smokeStyle: {
        width: "100%",
        padding: "5%",
        backgroundColor: "#787878"
      }
});

export default styles;