import React from 'react';
import { StyleSheet, WebView, Text, View, TouchableOpacity, PanResponder, Dimensions, Image, Platform, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Carousel, WhiteSpace, WingBlank, Flex, Toast, InputItem, ActivityIndicator, List } from 'antd-mobile-rn';
import Orientation from 'react-native-orientation';
import Touch from 'react-native-touch-once';
// import WebViewIOS from 'react-native-webview';

const {
    width, height
} = Dimensions.get('window')


var _previousLeft = 150;
var _previousTop = 350;

var lastLeft = 150;
var lastTop = 280;

const CIRCLE_SIZE = 100;


class IconDrag extends React.Component {


    constructor(props) {
        super(props);
        // this.navigateToScene = this.navigateToScene.bind(this);
        // this._onOrientationChange = this._onOrientationChange.bind(this)
        this.state = {
            loadD: false,
            widthS: width,
            heightS: Platform.OS === "android" ? height - 69 : height - 63,
            menuOpen: true,
            gametype: this.props.gametype,
            payHtml: this.props.GameOpenUrl,
            style: { tintColor: 'blue' },
            userName: '',
            userMoney: false,
            loadone: 1,
            pageTop: 0,
            gameKey: Math.random(),
            moneyBox: '',
            widthBigH: false,
            Noreload: true,
            //pageTop:Platform.OS === "android" ? 0 :31, 
        }

        this.onStartShouldSetPanResponder = this.onStartShouldSetPanResponder.bind(this);
        this.onMoveShouldSetPanResponder = this.onMoveShouldSetPanResponder.bind(this);
        this.onPanResponderGrant = this.onPanResponderGrant.bind(this);
        this.onPanResponderMove = this.onPanResponderMove.bind(this);
        this.onPanResponderEnd = this.onPanResponderEnd.bind(this);
        // this.resetMoner = this.resetMoner.bind(this);

    }


    componentWillMount(props) {


        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this.onStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: this.onMoveShouldSetPanResponder,
            onPanResponderGrant: this.onPanResponderGrant,
            onPanResponderMove: this.onPanResponderMove,
            onPanResponderRelease: this.onPanResponderEnd,
            onPanResponderTerminate: this.onPanResponderEnd,
            onStartShouldSetPanResponderCapture: this.onStartShouldSetPanResponderCapture,
            onMoveShouldSetPanResponderCapture: this.onMoveShouldSetPanResponderCapture,
        });
        this.changePosition();

    }

    componentWillUnmount() {  //?????????????????? 

    }


    _onOrientationChange(curOrt) {
        Orientation.unlockAllOrientations();
        //console.log('???????????????????????????1111') 
    }

    widthHeight() {  //??????????????????
        const {
            width, height
        } = Dimensions.get('window')
        //	//console.log('???????????????')
        if (this.state.widthS != width) {

            ////console.log(width,height)
            if (width > height) {
                this.setState({
                    widthBigH: true,
                    widthS: width,
                    heightS: Platform.OS === "android" ? height - 69 : height - 45,
                })

                _previousLeft = width / 2 + 50;
                _previousTop = 30;
                lastLeft = width / 2 + 50;
                lastTop = 30;
                this.changePosition();
                this.setState({
                    pageTop: 0
                })

            } else {


                if (Platform.OS === "ios") {
                    //console.log(height)
                    if (height >= 812) {
                        this.setState({
                            widthS: width,
                            heightS: height - 88,
                        })
                    } else {
                        this.setState({
                            widthS: width,
                            heightS: Platform.OS === "android" ? height - 69 : height - 63,
                        })
                    }

                } else {
                    this.setState({
                        widthS: width,
                        heightS: Platform.OS === "android" ? height - 69 : height - 63,
                    })

                }

                _previousLeft = 150;
                _previousTop = 80;

                lastLeft = 150;
                lastTop = 80;
                let topse = Platform.OS === "android" ? 0 : 31;
                this.setState({
                    pageTop: 0,
                    widthBigH: false,
                })
                this.changePosition();
            }

        }


    }

    closeModal() {  //????????????
        Actions.pop();
    }



    //??????????????????????????????????????????????????????????????????
    onStartShouldSetPanResponder(evt, gestureState) {
        return true;
    }
    //???????????????????????????????????????????????????????????????????????????????????????
    onMoveShouldSetPanResponder(evt, gestureState) {
        //	//console.log(gestureState)
        if (
            (gestureState.dx < 2 && gestureState.dx > -2)
            && (gestureState.dy < 2 && gestureState.dy > -2)
        ) {
            return false;
        }

        return true;
    }
    // ??????????????????????????????????????????????????????????????????????????????????????????
    onPanResponderGrant(evt, gestureState) {
        ////console.log('onPanResponderGrant...');
        const { dx, dy } = gestureState

        this.setState({
            style: {
                left: _previousLeft,
                top: _previousTop,
            }
        });
    }
    // ??????????????????????????????gestureState.move{X,Y}
    onPanResponderMove(evt, gestureState) {

        let widthS = this.state.widthS;
        let heightS = this.state.heightS;
        _previousLeft = lastLeft + gestureState.dx;
        _previousTop = lastTop + gestureState.dy;

        if (_previousLeft <= 0) {
            _previousLeft = 0;
        }
        if (_previousTop <= 0) {
            _previousTop = 0;
        }
        if (_previousLeft >= widthS - CIRCLE_SIZE) {
            _previousLeft = widthS - CIRCLE_SIZE;
        }
        if (_previousTop >= heightS - CIRCLE_SIZE) {
            _previousTop = heightS - CIRCLE_SIZE;
        }

        //????????????
        this.setState({
            style: {
                left: _previousLeft,
                top: _previousTop,
            }
        });
    }
    // ??????????????????????????????????????????????????????????????????????????????
    // ???????????????????????????????????????????????????????????????
    onPanResponderEnd(evt, gestureState) {

        lastLeft = _previousLeft;
        lastTop = _previousTop;

        this.changePosition();
    }

    /**
     ??????????????????????????????
    **/
    changePosition() {

        let widthS = this.state.widthS;
        let heightS = this.state.heightS;


        if (_previousLeft + CIRCLE_SIZE / 2 <= widthS / 2) {
            //left
            _previousLeft = lastLeft = 0;

            this.setState({
                style: {
                    left: _previousLeft,
                    top: _previousTop,
                }
            });
        } else {
            _previousLeft = lastLeft = widthS - CIRCLE_SIZE;

            this.setState({
                style: {
                    left: _previousLeft,
                    top: _previousTop,
                }
            });
        }

    }

    OpenMenu() {
        //console.log('???menu???')
        this.setState({
            menuOpen: this.state.menuOpen ? false : true,
        })
    }



    render() {

        return (

            <View {...this._panResponder.panHandlers} style={[styles.circle, this.state.style]}>

                <Touch style={{ position: 'absolute', top: -5, right: 5, zIndex: 9999, padding: 10 }} onPress={() => this.props.OpenMenu()}>
                    <Image resizeMode='stretch' source={require('../images/close.png')} style={{ width: 18, height: 18 }} />
                </Touch>

                <Touch style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE + 45 }} onPress={() => this.props.chickButton()}>
                    <Image defaultSource={require('../images/loding.png')} source={{ uri: this.props.iconUrls }} resizeMode={'contain'} style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE + 45 }} />
                </Touch>

            </View>

        )
    }
}

const styles = StyleSheet.create({
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        // borderRadius: CIRCLE_SIZE / 2,
        //backgroundColor: 'green',
        position: 'absolute',
        paddingTop: 15,
    },
    menu: {
        left: 0,
        top: 0,
        width: width - 60,
        height: height,
        backgroundColor: '#012c1f',
        position: 'absolute',

    },
    container: {
        flex: 1,
        padding: 0

    },

    button: {
        height: 30,
    },

    buttonB: {
        paddingTop: 15,
        paddingBottom: 15,
        borderLeftWidth: 1,
        backgroundColor: '#00633c',
        borderColor: '#013626'
    },
    widthSome: {
        width: width - (13 + 42 + 5 + 45 + 11 + 18 + 10),
    },
    fontText: {
        textAlign: 'center',
        color: "#fff",
        fontSize: 16,
    },

    fontText2: {
        textAlign: 'left',
        paddingLeft: 13,
        color: "#fff",
        fontSize: 14,
    },
    fontText3: {
        textAlign: 'center',
        color: "#fff",
        fontSize: 14,
    },

    MoneyBg: {
        opacity: 0,
        backgroundColor: '#000',
        position: 'absolute',
    },
    MenuXbox: {

        borderBottomWidth: 1,
        borderColor: '#012c1f',
        backgroundColor: '#013626',

    },
    MenuXd: {
        flex: 0.9,
        paddingTop: 10,
        paddingBottom: 10,
    },
    MenuXdIcon: {
        flex: 0.1,

    },
    MenuXc: {

        borderBottomWidth: 1,
        borderColor: '#013626'

    },
    MenuXb: {   //??????????????????
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        borderColor: '#485d57',
        borderBottomWidth: 1,
        backgroundColor: '#001f16'

    },

    iconMenu: {
        width: 10,
        height: 10,
        borderRadius: 80,
        marginTop: 4,
        backgroundColor: '#f6e4a6'
    },
    navHeader: {
        backgroundColor: '#00633c',
        paddingLeft: 8,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderColor: '#012c1f'
    },

    navMenu: {
        backgroundColor: '#012c1f',
    },


    dowButton: {
        backgroundColor: '#00633c',

        borderBottomWidth: 1,
        borderColor: '#00633c'
    },

    dowButton2: {
        backgroundColor: '#013626',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 5,
        paddingRight: 15,
        borderBottomWidth: 1,
        borderColor: '#012c1f'
    },


    NoticeText: {

    },
    userMoney: {  //menu ??????
        width: width - 60,
        position: 'absolute',
        zIndex: 999,
        top: Platform.OS === "android" ? 25 : 35,
        left: 0,
        borderRadius: 4,
        backgroundColor: "#fff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        shadowColor: "#666",
        //??????????????????????????????????????????????????????
        elevation: 4,

    },


    userMoneyBox: {
        padding: 7,
        borderBottomWidth: 1,
        borderColor: '#444444',

    },
    userMoneyText: {
        fontSize: 13,
        color: "#2D2D2D"
    },



    userMoneybox1: {
        flex: 0.4,
    },
    userMoneybox2: {
        flex: 0.4,
        top: 6,
    },
    userReload: {
        flex: 0.1,
        top: 1,
        borderLeftWidth: 1,
        borderColor: '#012c1f'
    },
    oneT: { //????????????
        flex: 0.4,
        paddingTop: 2,
        paddingLeft: 4,
        paddingRight: 4,
        paddingBottom: 2,
        borderRadius: 12,
        marginLeft: 5,
        backgroundColor: '#10906D',
    },
    oneT2: {
        flex: 0.4,
        paddingTop: 2,
        paddingLeft: 4,
        paddingRight: 4,
        paddingBottom: 2,
        borderRadius: 12,
        marginLeft: 5,
    }

});

export default (IconDrag);



