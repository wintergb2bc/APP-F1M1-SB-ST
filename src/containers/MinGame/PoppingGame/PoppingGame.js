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
            poppingGameActive: false,//默认活动未开始
            howToModal: false,
            noPrizes: false,
            noPrizesMsg: '未中奖',
            myPrizesModal: false,
            myPrizeList: 'default',
            popingActive: false,
            onPrizes: false,
            PrizeName: '奖品',
            PrizeImg: 'CN_Freebet-18',
            onPrizesMsg: '中奖',
            PrizeBG: false,
            UserLogin: ApiPort.UserLogin,
            MemberProgress: '',//已存款状态，次数
            backModalBtn: '',//返回，我知道了
            nextModalBtn: '',//立即存款,继续自动获取
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
    //获取活动开始时间，id
    getMiniGames() {
        Toast.loading("加载中,请稍候...", 20);
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
            Toasts.fail('系统出现错误，请联系客服', 2)
            Toast.hide();
        });
	}

    //是否开始，结束
    isPoppingGameStart() {
        const startTime = this.state.ActiveGame.eventStartDate.replace('T', ' ').replace(/\-/g, '/') + ' +08:00' //开始时间
        const endTime = this.state.ActiveGame.eventEndDate.replace('T', ' ').replace(/\-/g, '/') + ' +08:00' //结束时间

        let startNow = parseInt(new Date(startTime).getTime() - new Date().getTime())
        let startEnd = parseInt(new Date(startTime).getTime() - new Date(endTime).getTime())
        let nowEnd = parseInt(new Date(endTime).getTime() - new Date().getTime())
        let times = false
        if (startNow > 0) {
            //活动未开赛
            times = startNow
        } else if (nowEnd > 0) {
            //活动未结束
            times = nowEnd
            this.setState({ poppingGameActive: true, popingActive: true })
        }
        this.Countdown(times)
    }

    //倒计时处理
    Countdown(time) {
        if (!time) { return }

        // let time = 300;
        //结束时间戳,防止app后台setInterval没有执行，
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
        return result.prizeType == 4 ? '神秘惊喜' : result.actualPrizeValue + ' ' + result.prizeTypeDesc
    }

    //抽奖api
    SnatchPrize() {
        PiwikEvent('Engagement_Event', 'Claim', 'GrabLuckyGift_ 14thAnniversary')
        if (!this.UserLogin()) { return }

        Toast.loading("开奖中,请稍候...", 20);
        fetchRequest(`${ApiPort.SnatchPrize}promoId=${this.state.ActiveGame.promoId}&`, "POST")
            .then(res => {
                
                let backModalBtn = ''
                let nextModalBtn = ''
                if (res.isSuccess) {
                    //中奖
                    let result = res.result
                    let onPrizesMsg = '中奖'

                    if (result.remainingGrabFromCurrentTier > 0) {
                        onPrizesMsg = `今天剩余 ${result.remainingGrabFromCurrentTier} 活动次数。`
                        backModalBtn = '返回'
                        nextModalBtn = '继续自动获取'

                    } else if (result.remainingGrabFromHighestTier > 0) {
                        onPrizesMsg = `您的活动次数已用完，请存款后再试。`
                        backModalBtn = '返回'
                        nextModalBtn = '立即存款'

                    } else if (result.remainingGrabFromHighestTier == 0) {
                        onPrizesMsg = `您今天的活动次数已用完，请明天再试。`
                        backModalBtn = '我知道了'
                    }

                    if (result.prizeType == 1 || result.prizeType == 3 || result.prizeType == 4) {
                        //1 免费彩金，3 乐币，4 神秘奖
                        // 图片CN_Freebet-18  CN_RewardPts-28 CN_MysteryGift

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
                        //空奖
                        backModalBtn = '我知道了'
                        this.setState({
                            noPrizes: true,
                            noPrizesMsg: `很遗憾您的奖励是空的，请再接再厉！`,
                        })

                    } else if (result.prizeType == 2) {
                        //免费旋转

                    }

                } else {
                    //未中奖
                    let errorCode = res.errors ? res.errors[0].errorCode : ''
                    let noPrizesMsg = '未中奖'

                    if (errorCode == 'MG00012') {
                        noPrizesMsg = `存款 300 元即可获取 1 次参与活动的机会！\n存得越多，机会越多`
                        backModalBtn = '返回'
                        nextModalBtn = '立即存款'

                    } else if (errorCode == 'MG00004') {
                        noPrizesMsg = `您今日的存款不足 300 元， \n请先存款后再次参与活动。`
                        backModalBtn = '返回'
                        nextModalBtn = '立即存款'

                    } else if (errorCode == 'MG00001') {
                        noPrizesMsg = `抱歉，您目前还不能参加游戏，\n请等待您的存款通过审核。`
                        backModalBtn = '我知道了'


                    } else if (errorCode == 'MG00002') {
                        noPrizesMsg = `您的活动次数已用完，请存款后再试。`
                        backModalBtn = '返回'
                        nextModalBtn = '立即存款'

                    } else if (errorCode == 'MG00003') {
                        noPrizesMsg = `您今天的活动次数已用完，请明天再试。`
                        backModalBtn = '我知道了'

                    } else if (errorCode == 'MG00009') {
                        // 需要判断remainingGrabFromCurrentTier，remainingGrabFromHighestTier
                        this.MemberProgress('MG00009')
                        return
                    } else if (errorCode == 'MG00005') {
                        noPrizesMsg = `抱歉，来晚一步，奖品被抢完了`
                        backModalBtn = '我知道了'

                    } else if (errorCode == 'MG99998') {
                        noPrizesMsg = `抱歉，该活动已结束，\n请期待我们的下一个活动`
                        backModalBtn = '我知道了'

                    } else {
                        noPrizesMsg = `系统出现错误，请联系客服`
                        backModalBtn = '我知道了'

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
                Toasts.fail('系统出现错误，请联系客服', 2)
            });

    }

    //  获取我的奖品
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
                            //去除空奖prizeType == 5
                            myPrizeList.push(item)
                        }
                    })
                    this.setState({ myPrizeList })
                } else {
                    //错误提示
                    this.setState({ myPrizesModal: false })
                    Toasts.fail('系统出现错误，请联系客服', 2)
                }
            })
            .catch(err => {
                Toasts.fail('系统出现错误，请联系客服', 2)
            });
    }

    //获取存款次数，金额，抽奖次数
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
                        let noPrizesMsg = '未中奖'
                        let backModalBtn = ''
                        let nextModalBtn = ''
                        if (result.remainingGrabFromCurrentTier > 0) {
                            noPrizesMsg = `很遗憾您的奖励是空的，请再接再厉！\n今天剩余 -${result.remainingGrabFromCurrentTier}- 次参与活动的机会。`
                            backModalBtn = '返回'
                            nextModalBtn = '继续自动获取'

                        } else if (result.remainingGrabFromCurrentTier == 0 && result.remainingGrabFromHighestTier > 0) {
                            noPrizesMsg = `很遗憾您的奖励是空的，请再接再厉！\n您参与活动的次数已用完，请存款后再试。`
                            backModalBtn = '返回'
                            nextModalBtn = '立即存款'

                        } else if (result.remainingGrabFromCurrentTier == 0 && result.remainingGrabFromHighestTier == 0) {
                            noPrizesMsg = `很遗憾您的奖励是空的，请再接再厉！\n您今日参与活动的次数已用完，请明天再试。`
                            backModalBtn = '我知道了'

                        }
                        this.setState({ noPrizes: true, noPrizesMsg, nextModalBtn, backModalBtn })
                    }
                }
            })
            .catch(err => {
                Toasts.fail('系统出现错误，请联系客服', 2)
            });
    }

    nextModalBtn(key) {
        if (key == '立即存款') {
            Actions.pop()
            Actions.DepositCenter()
            PiwikEvent('Deposit_Nav', 'Click', 'Deposit_14thAnniversary ')
        } else {
            //自动获取
            this.setState({ onPrizes: false, noPrizes: false, PrizeBG: false })
            this.SnatchPrize()
            PiwikEvent('Engagement_Event​', 'Click', 'GrabMore_14thAnniversary')
        }
    }

    //  日期处理
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
            Toasts.fail('请先登录', 2)
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
                {/* 规则与条款 */}
                <Modals
                    isVisible={howToModal}
                    backdropColor={'#000'}
                    backdropOpacity={0.7}
                    style={{ justifyContent: 'center', margin: 30 }}
                >
                    <View style={styles.rulesModal}>
                        <View style={styles.modalTitle}>
                            <Text style={{ color: '#0C2274', fontSize: 15, fontWeight: 'bold' }}>规则与条款</Text>
                            <Touch onPress={() => { this.setState({ howToModal: false }) }}>
                                <Image resizeMode='stretch' source={require('../../../images/minGame/closeIcon.png')}
                                    style={{ width: 25, height: 25 }} />
                            </Touch>
                        </View>
                        <ScrollView style={{ padding: 10, }}>
                            <Text style={styles.rulesTxt}>1. 此活动开放给所有乐天堂会员</Text>
                            <Text style={styles.rulesTxt}>活动时间： 2022年6月18日 00:00:01 至2022年6月20日 23:59:59。 (北京时间）  </Text>
                            <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>2. 参加方式:</Text>
                            <Text style={styles.rulesTxt}>- 游戏次数将以会员当天累计存款总额为标准，最低存款为300元，如下图:</Text>
                            <View>
                                <View style={styles.tableHeader}>
                                    <Text style={styles.headerTh}>存款等级</Text>
                                    <Text style={styles.headerTHMin}>游戏次数</Text>
                                    <Text style={styles.headerTHMin}>会员级别</Text>
                                    <Text style={styles.headerTHMin}>累积次数</Text>
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
                                            <Text style={{ color: '#FFFFFF', fontSize: 10 }}>10,000 以上</Text>
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
                                        <Text style={{ color: '#FFFFFF', fontSize: 10 }}>所有会员</Text>
                                    </View>
                                    <View style={[styles.tableThMin, { height: 125 }]}>
                                        <Text style={{ color: '#FFFFFF', fontSize: 10 }}>一天5次</Text>
                                    </View>

                                </View>
                            </View>
                            <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>例:</Text>
                            <Text style={styles.rulesTxt}>会员于6月18日完成第一笔300元存款，即刻获取一次游戏机会。会员其后再存款2,700元，当日总存款累积至3,000元，便可进行剩余的游戏次数。</Text>
                            <Text style={styles.rulesTxt}>- 会员点击跳出的“游戏产品”以激活奖品。</Text>
                            <Text style={styles.rulesTxt}>- 未进行的游戏次数不会累计至次日。</Text>
                            <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>3. 此活动将以乐币, 免费彩金与周年大惊喜为奖品。</Text>
                            <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>4. 派彩时间：</Text>
                            <Text style={styles.rulesTxt}>免费彩金（主钱包）：得奖后30分钟内。 乐币（天王俱乐部）：得奖后30分钟内。 周年大惊喜（礼品）：确认收货信息之后的30天内。</Text>
                            <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>5. 乐币：</Text>
                            <Text style={styles.rulesTxt}>乐币自动计入会员账号后，可在天王俱乐部查询。使用有效期为30天。</Text>
                            <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>6. 免费彩金：</Text>
                            <Text style={styles.rulesTxt}>彩金自动记入会员主钱包后，有效期为30天。1倍流水方可提款。</Text>
                            <Text style={[styles.rulesTxt, { paddingTop: 10 }]}>7. 周年大惊喜（礼品）：</Text>
                            <Text style={styles.rulesTxt}>- 礼品将随机派发，该礼品将不会透露直到会员收件。</Text>
                            <Text style={styles.rulesTxt}>- 天使客服将在活动结束后7天之内联系中奖会员，索取收件信息。</Text>
                            <Text style={styles.rulesTxt}>- 若礼品已出库，因收件信息不完整，物流公司无法联系会员而被退回，乐天堂有权撤销该礼品。</Text>
                            <Text style={styles.rulesTxt}>- 礼品不可兑换成现金、彩金、乐币、免费旋转。</Text>
                            <Text style={[styles.rulesTxt, { paddingTop: 10, paddingBottom: 40 }]}>8. 须遵守乐天堂条款。</Text>
                        </ScrollView>
                    </View>
                </Modals>
                {/* 我的奖品 */}
                <Modals
                    isVisible={myPrizesModal}
                    backdropColor={'#000'}
                    backdropOpacity={0.7}
                    style={{ justifyContent: 'center', margin: 10 }}
                >
                    <View style={styles.myPrizesModal}>
                        <View style={styles.modalTitle}>
                            <Text style={{ color: 'transparent' }}>奖品</Text>
                            <Text style={{ color: '#0C2274', fontSize: 15, fontWeight: 'bold' }}>我的奖品</Text>
                            <Touch onPress={() => { this.setState({ myPrizesModal: false, myPrizeList: 'default' }) }}>
                                <Image resizeMode='stretch' source={require('../../../images/minGame/closeIcon.png')}
                                    style={{ width: 25, height: 25 }} />
                            </Touch>
                        </View>
                        <ScrollView style={{ padding: 15, }}>
                            <View style={[styles.myPrizeList, { marginBottom: 6 }]}>
                                <Text style={styles.myPrizesTime}>日期</Text>
                                <Text style={styles.myPrizes}>奖品</Text>
                                <Text style={styles.myPrizesStatus}>状态</Text>
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
                                    <Text style={styles.myPrizesTime}>没有获奖记录</Text>
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
                {/* 没有中奖 */}
                <Modals
                    isVisible={noPrizes}
                    backdropColor={'#000'}
                    backdropOpacity={0.7}
                    style={{ justifyContent: 'center', margin: 30 }}
                >
                    <View style={styles.noPrizesModal}>
                        <View style={styles.modalTitle}>
                            <Text style={{ color: '#0C2274', fontSize: 15, fontWeight: 'bold' }}>温馨提示</Text>
                            <Touch onPress={() => { this.setState({ noPrizes: false }) }}>
                                <Image resizeMode='stretch' source={require('../../../images/minGame/closeIcon.png')}
                                    style={{ width: 25, height: 25 }} />
                            </Touch>
                        </View>
                        {
                            //文字中间有其他颜色
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
                {/* 中奖 */}
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
                                    <Text style={{ color: '#003380', fontSize: 15, fontWeight: 'bold', paddingBottom: 8 }}>奖品</Text>
                                    <Image resizeMode='stretch' source={prizeList[PrizeImg]}
                                        style={{ width: 100, height: 100, marginBottom: 10 }} />
                                    <Text style={styles.onPrizesMsg}>恭喜您获得  <Text style={{ color: '#003CFF', fontWeight: 'bold' }}>{PrizeName}</Text> ! </Text>
                                    {
                                        //文字中间有其他颜色
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
                                <Text style={styles.title}>6月18日至6月20日 FUN肆迎战</Text>
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
                                <Text style={styles.countdownFoot}>天</Text>
                                <Text style={[styles.timeSeparator, { color: 'transparent' }]}>:</Text>
                                <Text style={styles.countdownFoot}>时</Text>
                                <Text style={[styles.timeSeparator, { color: 'transparent' }]}>:</Text>
                                <Text style={styles.countdownFoot}>分</Text>
                                <Text style={[styles.timeSeparator, { color: 'transparent' }]}>:</Text>
                                <Text style={styles.countdownFoot}>秒</Text>
                            </View>
                            <View style={styles.portalView}>
                                <Popping
                                    popingActive={popingActive}
                                    SnatchPrize={() => { this.SnatchPrize() }}
                                />
                            </View>
                            <View style={styles.activityTime}>
                                <Text style={{ color: '#0A2EA9', fontSize: 12 }}>活动时间：6月18日 00:00 至 6月20日 23:59 (北京时间)</Text>
                            </View>
                            <View style={styles.activeAmount}>
                                <Touch onPress={() => { this.MemberProgress('click') }} style={styles.resetAmount}>
                                    <Text style={styles.resetAmountTxt}>今日累计有效存款</Text>
                                    {
                                        (MemberProgress == '' && UserLogin) ?
                                            <ActivityIndicator color="#FFEB9C" />
                                            :
                                            <View style={styles.activeAmount}>
                                                <Text style={styles.resetAmountTxt}>{MemberProgress? ( MemberProgress.totalDepositedDaily || '0'): '0'}元</Text>
                                                <Image resizeMode='stretch' source={require('../../../images/minGame/reset.png')}
                                                    style={{ width: 18, height: 18, marginLeft: 5 }} />
                                            </View>
                                    }
                                </Touch>
                                <View style={styles.resetAmount}>
                                    <Text style={styles.resetAmountTxt}>累计次数</Text>
                                    <Text style={styles.resetAmountTxt}>{MemberProgress ? (MemberProgress.remainingGrabFromCurrentTier || '0') : '0'}次</Text>
                                </View>
                            </View>
                        </ImageBackground>
                        <ImageBackground
                            style={styles.howToBG}
                            resizeMode="stretch"
                            source={require("../../../images/minGame/howToBG.png")}
                        >
                            <Text style={styles.howTitle}>如何参与?</Text>
                            <Text style={{ color: '#A6B6EE' }}>轻松三步，幸运不断！</Text>
                            <View style={styles.howStep}>
                                <View style={styles.howStepList}>
                                    <Image resizeMode='stretch' source={require('../../../images/minGame/step1.png')}
                                        style={{ width: 60, height: 60 }} />
                                    <Text style={{ color: '#E5EBFF', fontWeight: 'bold', padding: 8, }}>步骤一</Text>
                                    <Text style={{ color: '#E5EBFF', fontSize: 11 }}>注册或登入您的账户</Text>
                                </View>
                                <View style={styles.howStepList}>
                                    <Image resizeMode='stretch' source={require('../../../images/minGame/step2.png')}
                                        style={{ width: 60, height: 60 }} />
                                    <Text style={{ color: '#E5EBFF', fontWeight: 'bold', padding: 8, }}>步骤二</Text>
                                    <Text style={{ color: '#E5EBFF', fontSize: 11 }}>存款最低 300元 至您的账户</Text>
                                </View>
                                <View style={styles.howStepList}>
                                    <Image resizeMode='stretch' source={require('../../../images/minGame/step3.png')}
                                        style={{ width: 60, height: 60 }} />
                                    <Text style={{ color: '#E5EBFF', fontWeight: 'bold', padding: 8, }}>步骤三</Text>
                                    <Text style={{ color: '#E5EBFF', fontSize: 11 }}>FUN肆迎战夺奖励!</Text>
                                </View>
                            </View>
                            <Touch onPress={() => {
                                this.setState({ howToModal: true })
                                PiwikEvent('Engagement_Event', 'View', 'TnC_14thAnniversary')
                            }} style={styles.howBtn}>
                                <Text style={{ color: '#0A2EA9', fontWeight: 'bold', fontSize: 15 }}>了解更多</Text>
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
                                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>活动奖品</Text>
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
                                <Text style={{ color: '#0A2EA9', fontWeight: 'bold', fontSize: 15 }}>查看我的奖品</Text>
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




