import React, { Component } from 'react'
import { View, Image, Text, StyleSheet, Dimensions, Platform } from 'react-native'
import { connect } from 'react-redux'
import { ApiPort } from '../lib/SPORTAPI';


const { width, height } = Dimensions.get("window");
class TabIconContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        let selected = this.props.focused
        let data = {
            home1: {
                title: `首页`,
                icon: selected ? require('./../images/home1.png') : (ApiPort.UserLogin ? require('./../images/home.png') : require('./../images/home3.png')),
                width: selected ? 58 : (ApiPort.UserLogin ? 58 : 22),
                height: 22
            },
            personal: {
                title: `个人`,
                icon: !selected ? require('./../images/user1.png') : require('./../images/user.png'),
                width: 22,
                height: 22,
            },
            promotion: {
                title: `优惠`,
                icon: !selected ? require('./../images/star.png') : require('./../images/starBlue.png'),
                width: 22,
                height: 22,
            },
        }
        let navigationKey = this.props.navigation.state.key

        let param = data[navigationKey]

        return <View style={{
            paddingTop: 6,
            width: width / 2,
            backgroundColor: '#fff',
            alignItems: 'center', height: 66
        }}>
            <Image resizeMode='stretch'
                style={[styles.tabIconImg, {
                    width: param.width,
                    height: param.height
                }]}
                source={param.icon} />
            <Text style={{ color: !selected ? '#999999' : '#00A6FF' }}>{param.title}</Text>
        </View>

    }
}

export default TabIcon = connect(
    (state) => {
        return {

        }
    }, (dispatch) => {
        return {}
    }
)(TabIconContainer)

const styles = StyleSheet.create({
    tabbarContainer: {
        flex: 1,
        width: width / 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 2,
    },
    tabIconImg: {
        marginBottom: 4
    },
})
