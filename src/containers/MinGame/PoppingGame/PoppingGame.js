import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, ScrollView, ActivityIndicator, Platform, ImageBackground } from 'react-native';
import Modals from 'react-native-modal';
import Touch from 'react-native-touch-once';
import { Actions } from 'react-native-router-flux';
import Popping from './Popping'
import { Toast } from "antd-mobile-rn";


const {
    width,
    height
} = Dimensions.get('window')


const prizeList = {
    'CN_Freebet-18': require("../../../images/minGame/prizes/CN_Freebet-18.png"),
    'CN_Freebet-28': require("../../../images/minGame/prizes/CN_Freebet-28.png"),
    'CN_Freebet-58': require("../../../images/minGame/prizes/CN_Freebet-58.png"),
    'CN_Freebet-88': require("../../../images/minGame/prizes/CN_Freebet-88.png"),
    'CN_Freebet-128': require("../../../images/minGame/prizes/CN_Freebet-128.png"),
    'CN_Freebet-188': require("../../../images/minGame/prizes/CN_Freebet-188.png"),
    'CN_Freebet-288': require("../../../images/minGame/prizes/CN_Freebet-288.png"),
    'CN_Freebet-588': require("../../../images/minGame/prizes/CN_Freebet-588.png"),
    'CN_RewardPts-28': require("../../../images/minGame/prizes/CN_RewardPts-28.png"),
    'CN_RewardPts-58': require("../../../images/minGame/prizes/CN_RewardPts-58.png"),
    'CN_RewardPts-88': require("../../../images/minGame/prizes/CN_RewardPts-88.png"),
    'CN_RewardPts-128': require("../../../images/minGame/prizes/CN_RewardPts-128.png"),
    'CN_RewardPts-188': require("../../../images/minGame/prizes/CN_RewardPts-188.png"),
    'CN_RewardPts-288': require("../../../images/minGame/prizes/CN_RewardPts-288.png"),
    'CN_RewardPts-588': require("../../../images/minGame/prizes/CN_RewardPts-588.png"),
    'CN_MysteryGift': require("../../../images/minGame/prizes/CN_MysteryGift.png"),
}

class PoppingGame extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            poping1: 0,
            poping2: 0,
            poping3: 0,
            poping4: 0,
            poping5: 0,
            poping6: 0,
            Countdown: '00:00:00:00',
            poppingGameActive: false,//?????????????????????
            howToModal: false,
            noPrizes: false,
            noPrizesMsg: '?????????',
            myPrizesModal: false,
            myPrizeList: 'default',
            popingActive: false,
            onPrizes: false,
            PrizeName: '??????',
            PrizeImg: 'CN_Freebet-18',
            onPrizesMsg: '??????',
            PrizeBG: false,
            UserLogin: ApiPort.UserLogin,
            MemberProgress: '',//????????????????????????
            backModalBtn: '',//?????????????????????
            nextModalBtn: '',//????????????,??????????????????
            ActiveGame: '',
        }


    }
    componentWillMount() {
        this.getMiniGames()
    }
    componentWillUnmount() {
        this.clearIntervals()
    }

    clearIntervals() {
        this.Countdowns && clearInterval(this.Countdowns);
    }
    //???????????????????????????id
    getMiniGames() {
        Toast.loading("?????????,?????????...", 20);
		fetchRequest(ApiPort.MiniGamesActiveGame, "GET")
		.then(res => {
            Toast.hide();
			if(res.isSuccess && res.result) {
				this.setState({ActiveGame: res.result}, () => {
                    this.isPoppingGameStart()
                    if (this.state.UserLogin) {
                        this.MemberProgress()
                    }
                })
			}
		})
		.catch(err => {
            Toasts.fail('????????????????????????????????????', 2)
            Toast.hide();
        });
	}

    //?????????????????????
    isPoppingGameStart() {
        const startTime = this.state.ActiveGame.eventStartDate.replace('T', ' ').replace(/\-/g, '/') + ' +08:00' //????????????
        const endTime = this.state.ActiveGame.eventEndDate.replace('T', ' ').replace(/\-/g, '/') + ' +08:00' //????????????

        let startNow = parseInt(new Date(startTime).getTime() - new Date().getTime())
        let startEnd = parseInt(new Date(startTime).getTime() - new Date(endTime).getTime())
        let nowEnd = parseInt(new Date(endTime).getTime() - new Date().getTime())
        let times = false
        if (startNow > 0) {
            //???????????????
            times = startNow
        } else if (nowEnd > 0) {
            //???????????????
            times = nowEnd
            this.setState({ poppingGameActive: true, popingActive: true })
        }
        this.Countdown(times)
    }

    //???????????????
    Countdown(time) {
        if (!time) { return }

        // let time = 300;
        //???????????????,??????app??????setInterval???????????????
        let afterMinutes5 = new Date().getTime() + time

        let d, h, m, s, dhms;
        this.Countdowns = setInterval(() => {
            time = parseInt((afterMinutes5 - (new Date().getTime())) / 1000)
            d = parseInt(time / (60 * 60 * 24))
            h = parseInt(time / (60 * 60) % 24)
            m = parseInt(time / 60 % 60)
            s = parseInt(time % 60);
            d = d < 10 ? "0" + d.toString() : d
            h = h < 10 ? "0" + h.toString() : h
            m = m < 10 ? "0" + m.toString() : m
            s = s < 10 ? "0" + s.toString() : s

            dhms = d + ":" + h + ":" + m + ":" + s;

            this.setState({ Countdown: dhms });

            if (d < 1 && h < 1 && m < 1 && s < 1) {
                this.setState({ poppingGameActive: false, popingActive: false })
                this.clearIntervals()
            }
        }, 1000);
    }


    getPrizeName(result) {
        return result.prizeType == 4 ? '????????????' : result.actualPrizeValue + ' ' + result.prizeTypeDesc
    }

    //??????api
    SnatchPrize() {
        PiwikEvent('Engagement_Event', 'Claim', 'GrabLuckyGift_??14thAnniversary')
        if (!this.UserLogin()) { return }

        Toast.loading("?????????,?????????...", 20);
        fetchRequest(`${ApiPort.SnatchPrize}promoId=${this.state.ActiveGame.promoId}&`, "POST")
            .then(res => {
                
                let backModalBtn = ''
                let nextModalBtn = ''
                if (res.isSuccess) {
                    //??????
                    let result = res.result
                    let onPrizesMsg = '??????'

                    if (result.remainingGrabFromCurrentTier > 0) {
                        onPrizesMsg = `???????????? ${result.remainingGrabFromCurrentTier} ???????????????`
                        backModalBtn = '??????'
                        nextModalBtn = '??????????????????'

                    } else if (result.remainingGrabFromHighestTier > 0) {
                        onPrizesMsg = `???????????????????????????????????????????????????`
                        backModalBtn = '??????'
                        nextModalBtn = '????????????'

                    } else if (result.remainingGrabFromHighestTier == 0) {
                        onPrizesMsg = `??????????????????????????????????????????????????????`
                        backModalBtn = '????????????'
                    }

                    if (result.prizeType == 1 || result.prizeType == 3 || result.prizeType == 4) {
                        //1 ???????????????3 ?????????4 ?????????
                        // ??????CN_Freebet-18  CN_RewardPts-28 CN_MysteryGift

                        let imgs = ['', 'Freebet', '', 'RewardPts', 'MysteryGift']
                        let PrizeImg = 'CN_' + imgs[result.prizeType] + (result.prizeType != 4 ? ('-' + result.actualPrizeValue) : '')
                        let PrizeName = this.getPrizeName(result)

                        this.setState({
                            PrizeName,
                            PrizeImg,
                            onPrizes: true,
                            onPrizesMsg,
                        }, () => {
                            setTimeout(() => {
                                this.setState({ PrizeBG: true })
                            }, 1200);
                        })
                    } else if (result.prizeType == 5) {
                        //??????
                        backModalBtn = '????????????'
                        this.setState({
                            noPrizes: true,
                            noPrizesMsg: `???????????????????????????????????????????????????`,
                        })

                    } else if (result.prizeType == 2) {
                        //????????????

                    }

                } else {
                    //?????????
                    let errorCode = res.errors ? res.errors[0].errorCode : ''
                    let noPrizesMsg = '?????????'

                    if (errorCode == 'MG00012') {
                        noPrizesMsg = `?????? 300 ??????????????? 1 ???????????????????????????\n???????????????????????????`
                        backModalBtn = '??????'
                        nextModalBtn = '????????????'

                    } else if (errorCode == 'MG00004') {
                        noPrizesMsg = `???????????????????????? 300 ?????? \n????????????????????????????????????`
                        backModalBtn = '??????'
                        nextModalBtn = '????????????'

                    } else if (errorCode == 'MG00001') {
                        noPrizesMsg = `??????????????????????????????????????????\n????????????????????????????????????`
                        backModalBtn = '????????????'


                    } else if (errorCode == 'MG00002') {
                        noPrizesMsg = `???????????????????????????????????????????????????`
                        backModalBtn = '??????'
                        nextModalBtn = '????????????'

                    } else if (errorCode == 'MG00003') {
                        noPrizesMsg = `??????????????????????????????????????????????????????`
                        backModalBtn = '????????????'

                    } else if (errorCode == 'MG00009') {
                        // ????????????remainingGrabFromCurrentTier???remainingGrabFromHighestTier
                        this.MemberProgress('MG00009')
                        return
                    } else if (errorCode == 'MG00005') {
                        noPrizesMsg = `??????????????????????????????????????????`
                        backModalBtn = '????????????'

                    } else if (errorCode == 'MG99998') {
                        noPrizesMsg = `??????????????????????????????\n?????????????????????????????????`
                        backModalBtn = '????????????'

                    } else {
                        noPrizesMsg = `????????????????????????????????????`
                        backModalBtn = '????????????'

                    }
                    this.setState({
                        noPrizes: true,
                        noPrizesMsg,
                    })

                }
                this.setState({
                    backModalBtn,
                    nextModalBtn,
                })
                Toast.hide();
                this.MemberProgress()
            })
            .catch(err => {
                Toast.hide();
                Toasts.fail('????????????????????????????????????', 2)
            });

    }

    //  ??????????????????
    PrizeHistory() {
        PiwikEvent('Engagement_Event', 'View', 'MyPrize_14thAnniversary')
        if (!this.UserLogin()) { return }

        this.setState({ myPrizesModal: true })

        fetchRequest(`${ApiPort.PrizeHistory}promoId=${this.state.ActiveGame.promoId}&`, "GET")
            .then(res => {
                if (res.isSuccess && res.result) {
                    let myPrizeList = []
                    res.result.forEach((item) => {
                        if(item.prizeType != 5) {
                            //????????????prizeType == 5
                            myPrizeList.push(item)
                        }
                    })
                    this.setState({ myPrizeList })
                } else {
                    //????????????
                    this.setState({ myPrizesModal: false })
                    Toasts.fail('????????????????????????????????????', 2)
                }
            })
            .catch(err => {
                Toasts.fail('????????????????????????????????????', 2)
            });
    }

    //??????????????????????????????????????????
    MemberProgress(errCode = '') {
        if (!this.UserLogin()) { return }

        errCode == 'click' && this.setState({ MemberProgress: '' })

        fetchRequest(`${ApiPort.MemberProgress}promoId=${this.state.ActiveGame.promoId}&`, "GET")
            .then(res => {
                let result = res.result || ''
                if (res.isSuccess && result) {
                    this.setState({
                        MemberProgress: result,
                    })
                    if (errCode == 'MG00009') {
                        Toast.hide();
                        let noPrizesMsg = '?????????'
                        let backModalBtn = ''
                        let nextModalBtn = ''
                        if (result.remainingGrabFromCurrentTier > 0) {
                            noPrizesMsg = `???????????????????????????????????????????????????\n???????????? -${result.remainingGrabFromCurrentTier}- ???????????????????????????`
                            backModalBtn = '??????'
                            nextModalBtn = '??????????????????'

                        } else if (result.remainingGrabFromCurrentTier == 0 && result.remainingGrabFromHighestTier > 0) {
                            noPrizesMsg = `???????????????????????????????????????????????????\n?????????????????????????????????????????????????????????`
                            backModalBtn = '??????'
                            nextModalBtn = '????????????'

                        } else if (result.remainingGrabFromCurrentTier == 0 && result.remainingGrabFromHighestTier == 0) {
                            noPrizesMsg = `???????????????????????????????????????????????????\n????????????????????????????????????????????????????????????`
                            backModalBtn = '????????????'

                        }
                        this.setState({ noPrizes: true, noPrizesMsg, nextModalBtn, backModalBtn })
                    }
                }
            })
            .catch(err => {
                Toasts.fail('????????????????????????????????????', 2)
            });
    }

    nextModalBtn(key) {
        if (key == '????????????') {
            Actions.pop()
            Actions.DepositCenter()
            PiwikEvent('Deposit_Nav', 'Click', 'Deposit_14thAnniversary ')
        } else {
            //????????????
            this.setState({ onPrizes: false, noPrizes: false, PrizeBG: false })
            this.SnatchPrize()
            PiwikEvent('Engagement_Event???', 'Click', 'GrabMore_14thAnniversary')
        }
    }

    //  ????????????
    applyDate(applyDate) {
        if (!applyDate) {
            return '00-00-00 00:00 AM'
        }
        let dates = applyDate.split('T')
        return (dates[0] + ' ' + dates[1].split(':')[0] + ':' + dates[1].split(':')[1])

    }

    UserLogin() {
        if (!this.state.UserLogin) {
            Actions.Login()
            Toasts.fail('????????????', 2)
            window.getMiniGames = true
            return false
        }
        return true
    }


    render() {
        const {
            Countdown,
            howToModal,
            noPrizes,
            noPrizesMsg,
            myPrizesModal,
            myPrizeList,
            popingActive,
            onPrizes,
            PrizeName,
            PrizeImg,
            PrizeBG,
            onPrizesMsg,
            MemberProgress,
            backModalBtn,
            nextModalBtn,
            UserLogin,
        } = this.state

        return (
            <View style={{ flex: 1, backgroundColor: '#000a41' }}>
                {/* ??????????????? */}
                <Modals
                    isVisible={howToModal}
                    backdropColor={'#000'}
                    backdropOpacity={0.7}
                    style={{ justifyContent: 'center', margin: 30 }}
                >
                    <View style={styles.rulesModal}>
                        <View style={styles.modalTitle}>
                            <Text style={{ color: '#0C2274', fontSize: 15, fontWeight: 'bold' }}>???????????????</Text>
                            <Touch onPress={() => { this.setState({ howToModal: false }) }}>
                                <Image resizeMode='stretch' source={require('../../../images/minGame/closeIcon.png')}
                                    style={{ width: 25, height: 25 }} />
                            </Touch>
                        </View>
                        <ScrollView style={{ padding: 10, }}>
                            <Text style={styles.rulesTxt}>1. ???????????????????????????????????????</Text>
                            <Text style={styles.rulesTxt}>??????????????? 2022???6???18??? 00:00:01 ???2022???6???20??? 23:59:59??? (???????????????  </Text>
                            <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>2. ????????????:</Text>
                            <Text style={styles.rulesTxt}>- ???????????????????????????????????????????????????????????????????????????300???????????????:</Text>
                            <View>
                                <View style={styles.tableHeader}>
                                    <Text style={styles.headerTh}>????????????</Text>
                                    <Text style={styles.headerTHMin}>????????????</Text>
                                    <Text style={styles.headerTHMin}>????????????</Text>
                                    <Text style={styles.headerTHMin}>????????????</Text>
                                </View>
                                <View style={styles.tableBody}>
                                    <View>
                                        <View style={styles.tableTh}>
                                            <Text style={{ color: '#FFFFFF', fontSize: 10 }}>300 - 999</Text>
                                        </View>
                                        <View style={styles.tableTh}>
                                            <Text style={{ color: '#FFFFFF', fontSize: 10 }}>1,000 - 2,499</Text>
                                        </View>
                                        <View style={styles.tableTh}>
                                            <Text style={{ color: '#FFFFFF', fontSize: 10 }}>2,500 - 4,999</Text>
                                        </View>
                                        <View style={styles.tableTh}>
                                            <Text style={{ color: '#FFFFFF', fontSize: 10 }}>5,000 - 9,999</Text>
                                        </View>
                                        <View style={styles.tableTh}>
                                            <Text style={{ color: '#FFFFFF', fontSize: 10 }}>10,000 ??????</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <View style={styles.tableThMin}>
                                            <Text style={{ color: '#FFFFFF', fontSize: 10 }}>1</Text>
                                        </View>
                                        <View style={styles.tableThMin}>
                                            <Text style={{ color: '#FFFFFF', fontSize: 10 }}>2</Text>
                                        </View>
                                        <View style={styles.tableThMin}>
                                            <Text style={{ color: '#FFFFFF', fontSize: 10 }}>3</Text>
                                        </View>
                                        <View style={styles.tableThMin}>
                                            <Text style={{ color: '#FFFFFF', fontSize: 10 }}>4</Text>
                                        </View>
                                        <View style={styles.tableThMin}>
                                            <Text style={{ color: '#FFFFFF', fontSize: 10 }}>5</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableThMin, { height: 125 }]}>
                                        <Text style={{ color: '#FFFFFF', fontSize: 10 }}>????????????</Text>
                                    </View>
                                    <View style={[styles.tableThMin, { height: 125 }]}>
                                        <Text style={{ color: '#FFFFFF', fontSize: 10 }}>??????5???</Text>
                                    </View>

                                </View>
                            </View>
                            <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>???:</Text>
                            <Text style={styles.rulesTxt}>?????????6???18??????????????????300??????????????????????????????????????????????????????????????????2,700??????????????????????????????3,000??????????????????????????????????????????</Text>
                            <Text style={styles.rulesTxt}>- ?????????????????????????????????????????????????????????</Text>
                            <Text style={styles.rulesTxt}>- ????????????????????????????????????????????????</Text>
                            <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>3. ?????????????????????, ??????????????????????????????????????????</Text>
                            <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>4. ???????????????</Text>
                            <Text style={styles.rulesTxt}>???????????????????????????????????????30???????????? ???????????????????????????????????????30???????????? ?????????????????????????????????????????????????????????30?????????</Text>
                            <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>5. ?????????</Text>
                            <Text style={styles.rulesTxt}>????????????????????????????????????????????????????????????????????????????????????30??????</Text>
                            <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>6. ???????????????</Text>
                            <Text style={styles.rulesTxt}>???????????????????????????????????????????????????30??????1????????????????????????</Text>
                            <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>7. ??????????????????????????????</Text>
                            <Text style={styles.rulesTxt}>- ?????????????????????????????????????????????????????????????????????</Text>
                            <Text style={styles.rulesTxt}>- ?????????????????????????????????7???????????????????????????????????????????????????</Text>
                            <Text style={styles.rulesTxt}>- ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</Text>
                            <Text style={styles.rulesTxt}>- ???????????????????????????????????????????????????????????????</Text>
                            <Text style={[styles.rulesTxt, { paddingTop: 10, paddingBottom: 40 }]}>8. ???????????????????????????</Text>
                        </ScrollView>
                    </View>
                </Modals>
                {/* ???????????? */}
                <Modals
                    isVisible={myPrizesModal}
                    backdropColor={'#000'}
                    backdropOpacity={0.7}
                    style={{ justifyContent: 'center', margin: 10 }}
                >
                    <View style={styles.myPrizesModal}>
                        <View style={styles.modalTitle}>
                            <Text style={{ color: 'transparent' }}>??????</Text>
                            <Text style={{ color: '#0C2274', fontSize: 15, fontWeight: 'bold' }}>????????????</Text>
                            <Touch onPress={() => { this.setState({ myPrizesModal: false, myPrizeList: 'default' }) }}>
                                <Image resizeMode='stretch' source={require('../../../images/minGame/closeIcon.png')}
                                    style={{ width: 25, height: 25 }} />
                            </Touch>
                        </View>
                        <ScrollView style={{ padding: 15, }}>
                            <View style={[styles.myPrizeList, { marginBottom: 6 }]}>
                                <Text style={styles.myPrizesTime}>??????</Text>
                                <Text style={styles.myPrizes}>??????</Text>
                                <Text style={styles.myPrizesStatus}>??????</Text>
                            </View>
                            {
                                myPrizeList == 'default' &&
                                <View style={{ paddingTop: 80 }}>
                                    <ActivityIndicator color="#fff" />
                                </View>
                            }
                            {
                                myPrizeList.length == 0 &&
                                <View style={[styles.myPrizeList, { backgroundColor: '#152E8B', justifyContent: 'center', }]}>
                                    <Text style={styles.myPrizesTime}>??????????????????</Text>
                                </View>

                            }
                            {
                                myPrizeList != 'default' && myPrizeList.length > 0 && myPrizeList.map((item, index) => {
                                    return (
                                        <View style={[styles.myPrizeList, { marginBottom: 3, backgroundColor: index % 2 == 0 ? '#152E8B' : '#2642AA' }]} key={index}>
                                            <Text style={styles.myPrizesTime}>{this.applyDate(item.applyDate)}</Text>
                                            <Text style={styles.myPrizes}>{this.getPrizeName(item)}</Text>
                                            <Text style={styles.myPrizesStatus}>{item.prizeStatusDesc}</Text>
                                        </View>
                                    )
                                })
                            }
                            <View style={{ height: 50, width: 30 }} />
                        </ScrollView>
                    </View>
                </Modals>
                {/* ???????????? */}
                <Modals
                    isVisible={noPrizes}
                    backdropColor={'#000'}
                    backdropOpacity={0.7}
                    style={{ justifyContent: 'center', margin: 30 }}
                >
                    <View style={styles.noPrizesModal}>
                        <View style={styles.modalTitle}>
                            <Text style={{ color: '#0C2274', fontSize: 15, fontWeight: 'bold' }}>????????????</Text>
                            <Touch onPress={() => { this.setState({ noPrizes: false }) }}>
                                <Image resizeMode='stretch' source={require('../../../images/minGame/closeIcon.png')}
                                    style={{ width: 25, height: 25 }} />
                            </Touch>
                        </View>
                        {
                            //???????????????????????????
                            noPrizesMsg.includes('-') ?
                                <Text style={styles.noPrizesMsg}>
                                    {`${noPrizesMsg.split('-')[0]}`}<Text style={{ color: '#EACF7A' }}>{`${noPrizesMsg.split('-')[1]}`}</Text>{`${noPrizesMsg.split('-')[2]}`}
                                </Text>
                                :
                                <Text style={styles.noPrizesMsg}>{`${noPrizesMsg}`}</Text>
                        }
                        <View style={styles.noPrizesBtn}>
                            {
                                backModalBtn != '' &&
                                <Touch style={styles.backBth} onPress={() => { this.setState({ noPrizes: false }) }}>
                                    <Text style={{ color: '#fff' }}>{backModalBtn}</Text>
                                </Touch>
                            }
                            {
                                nextModalBtn != '' &&
                                <Touch onPress={() => { this.nextModalBtn(nextModalBtn) }} style={styles.nextBth}>
                                    <Text style={{ color: '#0C2274' }}>{nextModalBtn}</Text>
                                </Touch>
                            }
                        </View>
                    </View>
                </Modals>
                {/* ?????? */}
                <Modals
                    isVisible={onPrizes}
                    backdropColor={'#000'}
                    backdropOpacity={0.7}
                    style={{ justifyContent: 'center' }}
                >
                    {
                        onPrizes &&
                        <ImageBackground
                            style={styles.PrizeBG}
                            resizeMode="stretch"
                            source={require("../../../images/minGame/PrizeBG.gif")}
                        >
                            {
                                PrizeBG &&
                                <View style={styles.PrizeBG}>
                                    <Text style={{ color: '#003380', fontSize: 15, fontWeight: 'bold', paddingBottom: 8 }}>??????</Text>
                                    <Image resizeMode='stretch' source={prizeList[PrizeImg]}
                                        style={{ width: 100, height: 100, marginBottom: 10 }} />
                                    <Text style={styles.onPrizesMsg}>???????????????  <Text style={{ color: '#003CFF', fontWeight: 'bold' }}>{PrizeName}</Text> ! </Text>
                                    {
                                        //???????????????????????????
                                        onPrizesMsg.includes('-') ?
                                            <Text style={styles.onPrizesMsg}>
                                                {`${onPrizesMsg.split('-')[0]}`}<Text style={{ color: '#003CFF' }}>{`${onPrizesMsg.split('-')[1]}`}</Text>{`${onPrizesMsg.split('-')[2]}`}
                                            </Text>
                                            :
                                            <Text style={styles.onPrizesMsg}>{`${onPrizesMsg}`}</Text>
                                    }
                                    <View style={styles.omPrizesBtn}>
                                        {
                                            backModalBtn != '' &&
                                            <Touch onPress={() => { this.setState({ onPrizes: false, PrizeBG: false }) }}>
                                                <ImageBackground
                                                    style={styles.backBthBG}
                                                    resizeMode="stretch"
                                                    source={require("../../../images/minGame/backBtn.png")}
                                                >
                                                    <Text style={{ color: '#403C01' }}>{backModalBtn}</Text>
                                                </ImageBackground>
                                            </Touch>
                                        }
                                        {
                                            nextModalBtn != '' &&
                                            <Touch onPress={() => { this.nextModalBtn(nextModalBtn) }}>
                                                <ImageBackground
                                                    style={styles.nextBthBG}
                                                    resizeMode="stretch"
                                                    source={require("../../../images/minGame/nextBtn.png")}
                                                >
                                                    <Text style={{ color: '#403C01' }}>{nextModalBtn}</Text>
                                                </ImageBackground>
                                            </Touch>
                                        }
                                    </View>
                                </View>
                            }
                        </ImageBackground>
                    }
                </Modals>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View>
                        <ImageBackground
                            style={styles.headerBG}
                            resizeMode="stretch"
                            source={require("../../../images/minGame/BG.png")}
                        >
                            <Image resizeMode='stretch' source={require('../../../images/minGame/title.png')}
                                style={{ width: width * 0.9, height: width * 0.9 * 0.38 }} />
                            <View style={styles.titleView}>
                                <Text style={styles.title}>6???18??????6???20??? FUN?????????</Text>
                            </View>

                            <View style={styles.countdown}>
                                <ImageBackground
                                    style={{ width: 32, height: 45 }}
                                    resizeMode="stretch"
                                    source={require("../../../images/minGame/countdown.png")}
                                >
                                    <Text style={styles.countdownTime}>{Countdown.split(':')[0][0]}</Text>
                                </ImageBackground>
                                <ImageBackground
                                    style={{ width: 32, height: 45, marginLeft: 3 }}
                                    resizeMode="stretch"
                                    source={require("../../../images/minGame/countdown.png")}
                                >
                                    <Text style={styles.countdownTime}>{Countdown.split(':')[0][1]}</Text>
                                </ImageBackground>
                                <Text style={styles.timeSeparator}>:</Text>
                                <ImageBackground
                                    style={{ width: 32, height: 45 }}
                                    resizeMode="stretch"
                                    source={require("../../../images/minGame/countdown.png")}
                                >
                                    <Text style={styles.countdownTime}>{Countdown.split(':')[1][0]}</Text>
                                </ImageBackground>
                                <ImageBackground
                                    style={{ width: 32, height: 45, marginLeft: 3 }}
                                    resizeMode="stretch"
                                    source={require("../../../images/minGame/countdown.png")}
                                >
                                    <Text style={styles.countdownTime}>{Countdown.split(':')[1][1]}</Text>
                                </ImageBackground>
                                <Text style={styles.timeSeparator}>:</Text>
                                <ImageBackground
                                    style={{ width: 32, height: 45 }}
                                    resizeMode="stretch"
                                    source={require("../../../images/minGame/countdown.png")}
                                >
                                    <Text style={styles.countdownTime}>{Countdown.split(':')[2][0]}</Text>
                                </ImageBackground>
                                <ImageBackground
                                    style={{ width: 32, height: 45, marginLeft: 3 }}
                                    resizeMode="stretch"
                                    source={require("../../../images/minGame/countdown.png")}
                                >
                                    <Text style={styles.countdownTime}>{Countdown.split(':')[2][1]}</Text>
                                </ImageBackground>
                                <Text style={styles.timeSeparator}>:</Text>
                                <ImageBackground
                                    style={{ width: 32, height: 45 }}
                                    resizeMode="stretch"
                                    source={require("../../../images/minGame/countdown.png")}
                                >
                                    <Text style={styles.countdownTime}>{Countdown.split(':')[3][0]}</Text>
                                </ImageBackground>
                                <ImageBackground
                                    style={{ width: 32, height: 45, marginLeft: 3 }}
                                    resizeMode="stretch"
                                    source={require("../../../images/minGame/countdown.png")}
                                >
                                    <Text style={styles.countdownTime}>{Countdown.split(':')[3][1]}</Text>
                                </ImageBackground>
                            </View>
                            <View style={[styles.countdown, { marginTop: 5 }]}>
                                <Text style={styles.countdownFoot}>???</Text>
                                <Text style={[styles.timeSeparator, { color: 'transparent' }]}>:</Text>
                                <Text style={styles.countdownFoot}>???</Text>
                                <Text style={[styles.timeSeparator, { color: 'transparent' }]}>:</Text>
                                <Text style={styles.countdownFoot}>???</Text>
                                <Text style={[styles.timeSeparator, { color: 'transparent' }]}>:</Text>
                                <Text style={styles.countdownFoot}>???</Text>
                            </View>
                            <View style={styles.portalView}>
                                <Popping
                                    popingActive={popingActive}
                                    SnatchPrize={() => { this.SnatchPrize() }}
                                />
                            </View>
                            <View style={styles.activityTime}>
                                <Text style={{ color: '#0A2EA9', fontSize: 12 }}>???????????????6???18??? 00:00 ??? 6???20??? 23:59 (????????????)</Text>
                            </View>
                            <View style={styles.activeAmount}>
                                <Touch onPress={() => { this.MemberProgress('click') }} style={styles.resetAmount}>
                                    <Text style={styles.resetAmountTxt}>????????????????????????</Text>
                                    {
                                        (MemberProgress == '' && UserLogin) ?
                                            <ActivityIndicator color="#FFEB9C" />
                                            :
                                            <View style={styles.activeAmount}>
                                                <Text style={styles.resetAmountTxt}>{MemberProgress? ( MemberProgress.totalDepositedDaily || '0'): '0'}???</Text>
                                                <Image resizeMode='stretch' source={require('../../../images/minGame/reset.png')}
                                                    style={{ width: 18, height: 18, marginLeft: 5 }} />
                                            </View>
                                    }
                                </Touch>
                                <View style={styles.resetAmount}>
                                    <Text style={styles.resetAmountTxt}>????????????</Text>
                                    <Text style={styles.resetAmountTxt}>{MemberProgress ? (MemberProgress.remainingGrabFromCurrentTier || '0') : '0'}???</Text>
                                </View>
                            </View>
                        </ImageBackground>
                        <ImageBackground
                            style={styles.howToBG}
                            resizeMode="stretch"
                            source={require("../../../images/minGame/howToBG.png")}
                        >
                            <Text style={styles.howTitle}>?????????????</Text>
                            <Text style={{ color: '#A6B6EE' }}>??????????????????????????????</Text>
                            <View style={styles.howStep}>
                                <View style={styles.howStepList}>
                                    <Image resizeMode='stretch' source={require('../../../images/minGame/step1.png')}
                                        style={{ width: 60, height: 60 }} />
                                    <Text style={{ color: '#E5EBFF', fontWeight: 'bold', padding: 8, }}>?????????</Text>
                                    <Text style={{ color: '#E5EBFF', fontSize: 11 }}>???????????????????????????</Text>
                                </View>
                                <View style={styles.howStepList}>
                                    <Image resizeMode='stretch' source={require('../../../images/minGame/step2.png')}
                                        style={{ width: 60, height: 60 }} />
                                    <Text style={{ color: '#E5EBFF', fontWeight: 'bold', padding: 8, }}>?????????</Text>
                                    <Text style={{ color: '#E5EBFF', fontSize: 11 }}>???????????? 300??? ???????????????</Text>
                                </View>
                                <View style={styles.howStepList}>
                                    <Image resizeMode='stretch' source={require('../../../images/minGame/step3.png')}
                                        style={{ width: 60, height: 60 }} />
                                    <Text style={{ color: '#E5EBFF', fontWeight: 'bold', padding: 8, }}>?????????</Text>
                                    <Text style={{ color: '#E5EBFF', fontSize: 11 }}>FUN??????????????????!</Text>
                                </View>
                            </View>
                            <Touch onPress={() => {
                                this.setState({ howToModal: true })
                                PiwikEvent('Engagement_Event', 'View', 'TnC_14thAnniversary')
                            }} style={styles.howBtn}>
                                <Text style={{ color: '#0A2EA9', fontWeight: 'bold', fontSize: 15 }}>????????????</Text>
                            </Touch>
                        </ImageBackground>
                        <ImageBackground
                            style={styles.prizeBG}
                            resizeMode="stretch"
                            source={require("../../../images/minGame/BGfood.png")}
                        >
                            <ImageBackground
                                style={styles.PrizeTitle}
                                resizeMode="stretch"
                                source={require("../../../images/minGame/PrizeTitle.png")}
                            >
                                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>????????????</Text>
                            </ImageBackground>
                            <View style={styles.prizeView}>
                                {
                                    Object.values(prizeList).map((item, index) => {
                                        return (
                                            <Image key={index} resizeMode='stretch' source={item}
                                                style={{ width: (width - 78) / 4, height: (width - 78) / 4, margin: 2, }} />
                                        )
                                    })
                                }
                            </View>
                            <Touch onPress={() => { this.PrizeHistory() }} style={styles.howBtn}>
                                <Text style={{ color: '#0A2EA9', fontWeight: 'bold', fontSize: 15 }}>??????????????????</Text>
                            </Touch>
                        </ImageBackground>
                    </View>
                </ScrollView>
            </View>
        )
    }

}

export default PoppingGame;


const styles = StyleSheet.create({
    PrizeBG: {
        width: width * 0.95,
        height: width * 0.95,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noPrizesMsg: {
        color: '#fff',
        lineHeight: 22,
        paddingTop: 25,
        paddingBottom: 25,
        fontSize: 13,
        textAlign: 'center',
    },
    backBth: {
        width: width * 0.35,
        marginRight: 15,
        backgroundColor: '#1285F5',
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
    },
    nextBth: {
        width: width * 0.35,
        backgroundColor: '#EACF7A',
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
    },
    backBthBG: {
        width: width * 0.32,
        marginRight: 15,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
    },
    nextBthBG: {
        width: width * 0.32,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
    },
    noPrizesBtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    omPrizesBtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10
    },
    onPrizesMsg: {
        color: '#003380',
        fontSize: 11,
        lineHeight: 18,
    },
    headerTh: {
        width: (width - 80) * 0.4,
        lineHeight: 25,
        textAlign: 'center',
        fontSize: 10,
        color: '#0C2274',
    },
    headerTHMin: {
        width: (width - 80) * 0.2,
        lineHeight: 25,
        textAlign: 'center',
        fontSize: 10,
        color: '#0C2274',
    },
    tableTh: {
        width: (width - 80) * 0.4,
        height: 25,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EACF7A'
    },
    tableThMin: {
        width: (width - 80) * 0.2,
        height: 25,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EACF7A'
    },
    tableHeader: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#EACF7A',
        flexDirection: 'row',
        marginTop: 10,
    },
    tableBody: {
        borderWidth: 1,
        borderColor: '#EACF7A',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    rulesTxt: {
        fontSize: 12,
        color: '#fff',
        lineHeight: 20,
    },
    rulesModal: {
        width: width - 60,
        backgroundColor: '#0C2274',
        height: height * 0.7,
        paddingBottom: 5,
    },
    myPrizesModal: {
        width: width - 20,
        backgroundColor: '#0C2274',
        height: height * 0.5,
        paddingBottom: 5,
    },
    myPrizeList: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#2642AA',
    },
    myPrizesTime: {
        width: width * 0.35,
        color: '#fff',
        textAlign: 'center',
        fontSize: 9,
        lineHeight: 18,
        paddingTop: 3,
        paddingBottom: 3,
    },
    myPrizes: {
        width: width * 0.25,
        color: '#fff',
        textAlign: 'center',
        fontSize: 9,
        lineHeight: 12,
        paddingTop: 3,
        paddingBottom: 3,
    },
    myPrizesStatus: {
        width: width * 0.3,
        color: '#fff',
        textAlign: 'center',
        fontSize: 9,
        lineHeight: 12,
        paddingTop: 3,
        paddingBottom: 3,
    },
    noPrizesModal: {
        width: width - 60,
        backgroundColor: '#0C2274',
        paddingBottom: 20,
    },
    modalTitle: {
        backgroundColor: '#EACF7A',
        height: 45,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
    },
    prizeView: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: width - 60,
        paddingTop: 30,
        paddingBottom: 70,
    },
    prizeBG: {
        height: width * 1.9,
        width: width,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 40,
    },
    PrizeTitle: {
        width: 180,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    howBtn: {
        backgroundColor: '#EACF7A',
        borderRadius: 14,
        width: 160,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    howStep: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 35,
        paddingBottom: 35,
    },
    howStepList: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    howToBG: {
        width: width,
        height: width,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    howTitle: {
        color: '#FFEB9C',
        fontSize: 20,
        paddingBottom: 10
    },
    headerBG: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: width,
        height: width * 2.56,
        paddingTop: 35,
    },
    countdown: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 30,
    },
    countdownTime: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 45,
    },
    timeSeparator: {
        width: 18,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    countdownFoot: {
        width: 67,
        textAlign: 'center',
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    titleView: {
        width: width * 0.5,
        borderWidth: 1,
        borderColor: '#EACF7A',
        backgroundColor: '#0A2EA9',
        borderRadius: 50,
        marginTop: 10,
    },
    title: {
        lineHeight: 32,
        textAlign: 'center',
        fontSize: 11,
        color: '#E5EBFF'
    },
    portalView: {
        width: width,
        height: 450,
    },
    activityTime: {
        padding: 10,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: '#FFEB9C',
        borderRadius: 50,
        marginBottom: 50,
    },
    activeAmount: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    resetAmount: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 140,
        height: 50,
        borderWidth: 1,
        borderColor: '#FFEB9C',
        borderRadius: 8,
        margin: 8,
        paddingTop: 3,
        paddingBottom: 3,
    },
    resetAmountTxt: {
        color: '#FFEB9C',
        fontSize: 13,
        lineHeight: 20,
    },
});




