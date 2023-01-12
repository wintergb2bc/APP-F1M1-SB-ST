import Toast from 'react-native-tiny-toast'
import React from "react";

export const Toasts = {
    success: (msg) => {
        Toast.show(msg || '', {
            position: DeviceInfoIos? 45: 20,
            containerStyle: { backgroundColor: '#daffe3', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
            textStyle: { color: '#34c759',  paddingLeft: 5, fontSize: 13 },
            imgSource: require('../images/icon-done.png'),
            imgStyle: { height: 18, width: 18 },
        })
    },

    fail: (msg) => {
        Toast.show(msg || '', {
            position: DeviceInfoIos? 45: 20,
            containerStyle: { backgroundColor: '#ffdada', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
            textStyle: { color: '#eb2121', paddingLeft: 5, fontSize: 13 },
            imgSource: require('../images/Error.png'),
            imgStyle: { height: 18, width: 18 },
        })
    },
    error: (msg) => {
        Toast.show(msg || '', {
            position: DeviceInfoIos? 45: 20,
            containerStyle: { backgroundColor: '#ffdada', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
            textStyle: { color: '#eb2121',  paddingLeft: 5, fontSize: 13 },
            imgSource: require('../images/Error.png'),
            imgStyle: { height: 18, width: 18 },
        })
    },

    info: (msg) => {
        Toast.show(msg || '', {
            position: DeviceInfoIos? 45: 20,
        })
    },

}