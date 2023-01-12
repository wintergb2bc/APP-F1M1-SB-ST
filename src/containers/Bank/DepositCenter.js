import React from 'react';
import { StyleSheet, WebView, ScrollView, Text, View, Image, Platform, TouchableOpacity, Dimensions, TextInput, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Checkbox, Radio, WhiteSpace, WingBlank, Flex, Toast, InputItem, Picker, List, Slider, Modal, DatePicker } from 'antd-mobile-rn';
import Modals from 'react-native-modal';
import HTMLView from 'react-native-htmlview';
import Carousel, { Pagination } from "react-native-snap-carousel";
import Touch from 'react-native-touch-once';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ModalDropdown from "react-native-modal-dropdown";
import LivechatDragHoliday from '../LivechatDragHoliday'
import DepositCenterPage from './DepositCenterPage'
import { LBPrompt, ALBPrompt, JDPPrompt, UPPrompt, BCPrompt, OAPrompt, WCLBPrompt, WCPrompt, CCPrompt, APPrompt, CTCPrompt, PPBPrompt, QQrompt, SRPrompt } from './depositPrompt'
import ListItems from "antd-mobile-rn/lib/list/style/index.native";
import { PushLayout } from '../Layout'

const newStyle = {};
for (const key in ListItems) {
    if (Object.prototype.hasOwnProperty.call(ListItems, key)) {
        // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
        newStyle[key] = { ...StyleSheet.flatten(ListItems[key]) };
        newStyle[key].opacity = 0;
        newStyle[key].color = "transparent";
        newStyle[key].backgroundColor = "transparent";
        newStyle[key].height = 30
        newStyle[key].width = width
    }
}

const RadioItem = Radio.RadioItem;
const {
    width, height
} = Dimensions.get('window')
const promptList = {
    LB: [
        { title: '步骤1', conter: '打撒打算水水水水', imgs: require('../../images/bank/bankicon/unionpay.png') },
        { title: '步骤3', conter: '打撒打算水水水水', imgs: require('../../images/bank/bankicon/unionpay.png') },
        { title: '步骤4', conter: '打撒打算水水水水', imgs: require('../../images/bank/bankicon/unionpay.png') },
    ],
    AP: [
        { title: '步骤1', conter: '打撒打算水水水水', imgs: require('../../images/bank/bankicon/unionpay.png') },
        { title: '步骤3', conter: '打撒打算水水水水', imgs: require('../../images/bank/bankicon/unionpay.png') },
        { title: '步骤4', conter: '打撒打算水水水水', imgs: require('../../images/bank/bankicon/unionpay.png') },
    ],
    ALB: [
        { title: '步骤1', conter: '打撒打算水水水水', imgs: require('../../images/bank/bankicon/unionpay.png') },
        { title: '步骤3', conter: '打撒打算水水水水', imgs: require('../../images/bank/bankicon/unionpay.png') },
        { title: '步骤4', conter: '打撒打算水水水水', imgs: require('../../images/bank/bankicon/unionpay.png') },
    ],
    UP: [
        { title: '步骤1', conter: '打撒打算水水水水', imgs: require('../../images/bank/bankicon/unionpay.png') },
        { title: '步骤3', conter: '打撒打算水水水水', imgs: require('../../images/bank/bankicon/unionpay.png') },
        { title: '步骤4', conter: '打撒打算水水水水', imgs: require('../../images/bank/bankicon/unionpay.png') },
    ],
}

//存款方式图片
export const bankImage = {
    "JDP": require('../../images/bank/bankicon/JDP.png'),
    "AP": require('../../images/bank/bankicon/AP.png'),
    "BC": require('../../images/bank/bankicon/BC.png'),
    "BCM": require('../../images/bank/bankicon/BCM.png'),
    "BCActive": require('../../images/bank/bankicon/BCActive.png'),
    "CC": require('../../images/bank/bankicon/CC.png'),
    "CCActive": require('../../images/bank/bankicon/CCActive.png'),
    "LB": require('../../images/bank/bankicon/LB.png'),
    "LBActive": require('../../images/bank/bankicon/LBActive.png'),
    "OA": require('../../images/bank/bankicon/OA.png'),
    "UP": require('../../images/bank/bankicon/UP.png'),
    "QQ": require('../../images/bank/bankicon/QQ.png'), //沒圖
    "WC": require('../../images/bank/bankicon/WC.png'),//沒圖
    "QR": require('../../images/bank/icon_lib_basketballcopy.png'), //沒圖
    "Hover": require('../../images/bank/bankIcon1.png'), //選中圖 
    "WCLB": require('../../images/bank/bankicon/WCLB.png'),//沒圖
    "YP": require('../../images/bank/bankicon/LB.png'),
    "ALB": require('../../images/bank/bankicon/ALB.png'),
    "ALBActive": require('../../images/bank/bankicon/ALBActive.png'),
    "PPB": require('../../images/bank/bankicon/PPB.png'),
    "CTC": require('../../images/bank/bankicon/CTC.png'),
    "BTC": require('../../images/bank/bankicon/bitcoin.png'),
    "ETH": require('../../images/bank/bankicon/ethereum.png'),
    "USDT-ERC20": require('../../images/bank/bankicon/tether-erc.png'),
    "USDT-TRC20": require('../../images/bank/bankicon/tether-trc.png'),
    "SR": require('../../images/bank/bankicon/SR.png'),
}
export const bankImageActive = {
    "JDP": require('../../images/bank/bankicon/JDP.png'),
    "AP": require('../../images/bank/bankicon/AP.png'),
    "BC": require('../../images/bank/bankicon/BC.png'),
    "BCM": require('../../images/bank/bankicon/BCM.png'),
    "BCActive": require('../../images/bank/bankicon/BCActive.png'),
    "CC": require('../../images/bank/bankicon/CC.png'),
    "CCActive": require('../../images/bank/bankicon/CCActive.png'),
    "LB": require('../../images/bank/bankicon/LB1.png'),
    "LBActive": require('../../images/bank/bankicon/LBActive.png'),
    "OA": require('../../images/bank/bankicon/OA1.png'),
    "UP": require('../../images/bank/bankicon/UP1.png'),
    "QQ": require('../../images/bank/bankicon/QQ.png'), //沒圖
    "WC": require('../../images/bank/bankicon/WC1.png'),//沒圖
    "QR": require('../../images/bank/icon_lib_basketballcopy.png'), //沒圖
    "Hover": require('../../images/bank/bankIcon1.png'), //選中圖 
    "WCLB": require('../../images/bank/bankicon/WCLB1.png'),//沒圖
    "YP": require('../../images/bank/bankicon/LB.png'),
    "ALB": require('../../images/bank/bankicon/ALB1.png'),
    "ALBActive": require('../../images/bank/bankicon/ALBActive.png'),
    "PPB": require('../../images/bank/bankicon/PPB1.png'),
    "CTC": require('../../images/bank/bankicon/CTC.png'),
    "BTC": require('../../images/bank/bankicon/bitcoin.png'),
    "ETH": require('../../images/bank/bankicon/ethereum.png'),
    "USDT-ERC20": require('../../images/bank/bankicon/tether-erc.png'),
    "USDT-TRC20": require('../../images/bank/bankicon/tether-trc.png'),
    "SR": require('../../images/bank/bankicon/SRActive.png'),
}

const ALBType = [
    {
        code: 'qrcode',
        name: '显示二维码'
    },
    {
        code: 'bank',
        name: '显示银行账户'
    }
]

let DepositList = {
    'LB': 'show',
    'WCLB': 'show',
    'UP': 'show',
    'OA': 'show',
    'WC': 'show',
    'QQ': 'show',
    'BC': 'show',
    'BCM': 'show',
    'ALB': 'show',
    'CTC': 'show',
    'JDP': 'show',
    'AP': 'show',
    'CC': 'show',
    'PPB': 'show',
    'SR': 'show',
};

const mgmtRefNo = 'Fun88P4SB2.0MobileApps'

class DepositCenter extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            ShowDepositorNameField: false,
            PrefillRegisteredName: false,
            lbVisible: false,
            isSmileLBAvailable: false,
            keyboardOpen: true,
            depositList: [],
            activeCode: '',//选中
            activeName: '',
            money: 0,
            SignUpMoney: 0,
            MaxBalShow: '0.00',
            MinBalShow: '0.00',
            DayBalShow: '0.00',
            TransferNumber: '1',
            MaxBal: '0.00',
            MinBal: '0.00',
            APcaredUSD: false,//AP卡美元兑换
            USDRateMoney: '0.00',//AP卡美元
            USDRate: 0,//AP卡美元兑换汇率
            activeBalance: 'SB',
            defaultBalance: '',
            activeBalanceName: '',
            DayBal: '',//每日最高
            allBalance: [],//所有账户
            LBnameTest: '',
            BonusData: '',
            BonusIndex: 0,
            charges: '',//qq支付使用，实际到账 = 存款金额 + API 的 charges
            chargesMoney: 0,//qq支付使用，实际到账 = 存款金额 + API 的 charges
            PayAreadyQQ: false,
            bonusKey: 0,//优惠选择key
            bonusId: 0,
            BonusMSG: '',
            bonusCoupon: '',//优惠卷码
            bonusCouponKEY: 0,//!=0需要优惠卷码
            okPayBtn: true,
            nextBtn: false,//下一步
            depositDetail: '',//存款详情
            ALBTypeActive: ALBType[0].code,
            userMember: '',
            Sliderss: 0,
            SliderssRun: false,
            PayAready: false,
            bonusTitle: '',
            caredNum: '',
            caredNumST: '',
            PINNum: '',
            PINNumST: '',
            monthDate: '月份',
            yearDate: '年份',
            BCBankData: '',
            MemberName: '',
            showPush: false,
            MemberNameTest: '',
            BankNameKey: 0,
            checkWallet: false,
            activeSlide: 0,
            ISpromp: false,
            accountHolderName: '',
            accountHolderNameTest: '',
            FirstName: '',
            LBFirstName: '',
            LBFirstNameTest: '',
            Countdown: '14:59',
            DepositData: '',
            activeDeposit: '',
            okPayModal: false,
            CTCtype: 0,//0极速虚拟币支付和1虚拟币支付
            CTCListtype: 0,//0比特币 (BTC)和1以太坊 (ETH)和2泰达币 (USDT-ERC20)
            CTC_CHANNEL_INVOICE: '',//极速虚拟币支付和虚拟币支付
            CTC_CHANNEL_pay: false,//极速虚拟币支付弹窗
            curBonusTitle: '',//优惠标题
            uniqueAmountStatus: false,//是否尾数部位0
            BC_Deposit: [],
            IsAutoAssign: false, //本地银行  支付宝转账  微信转账  false显示银行卡  true不显示
            moneyST: '',
            paymentchannel: '', //存款渠道選擇
            paymentchannelEND: 'DEFAULT',//存款渠道當前選擇
            OASuggestedAmount: [],  //特殊金額
            depositPageDate: '',
            SuggestedAmounts: [],//小额存款金额list
            SRdisabledErr : false,
            SRAmountsActive: 99999,
            nowActiveDeposit: '',//进入存款传的指定存款方式code
            CTCPromptActive: 1,//虚拟币温馨提示 
            isPopup: false,//存款被锁定
            isIWMM: false,
            isDepositVerificationOTP: false,
            ppbVisible: false,
            ppbVisibleErr: false,
            isQrcodeALB: false,
            moreDepositWithdrawal: false,
            depositErrModal: false,
            FirstNameModal: false,
            isShowRpeatModal: false,
            lastDepositID: '',
            lastDepositAmount: ''
        }
    }

    componentWillMount(props) {
        if(window.GetSelfExclusionRestriction('DisableDeposit')) {
            //自我限制无法进入存款,
            Actions.pop()
            return
        }
        window.bonusState = false
        this.props.froms == 'promotions' && this.getBonus()
        
        window.openOrientation()//开启竖屏
        this.checkMember()
       // this.checkCustomFlag()
        storage.load({
            key: 'depositList',
            id: 'depositList'
        }).then(data => {
            if (data) {
                this.setState({
                    activeCode: data[0].code,
                    activeName: data[0].name,
                    depositList: data,
                })
            }
            this.depositCodeClick(data[0].code, data[0].name)
            //再次刷新钱包
            this.GetPaymentReload()

        }).catch(err => {
            this.GetPaymentReload()
        })
    }
    componentDidMount() { }

    componentWillUnmount() {
        if (window.openOrien == 'orientation') {
            //游戏页面跳转过来,需要解锁横屏
            window.removeOrientation()
        }
        this.Countdowns && clearInterval(this.Countdowns);
    }

    //倒计时处理
    Countdown() {
        let time = 900;
        let m, s, ms;
        this.Countdowns = setInterval(() => {
            time -= 1;
            m = parseInt(time / 60).toString();
            s = time - m * 60;
            if (s < 10) {
                s = "0" + s.toString();
            }
            ms = m + ":" + s;
            if (m < 10) { ms = '0' + m.toString() + ":" + s; }
            this.setState({ Countdown: ms });

            if (m == 0 && s == 0) {
                clearInterval(this.Countdowns);
            }
        }, 1000);
    }

    //存款成功统一清空输入框
    clearData() {
        let allBalance = this.state.allBalance;
        this.setState({
            okPayBtn: this.state.activeCode == 'CTC' ? true : false,
            Sliderss: 0,
            SliderssRun: !this.state.SliderssRun,
            // money: '',
            monthDate: '月份',
            yearDate: '年份',
            caredNum: '',
            PINNum: '',
            APcaredUSD: false,
            bonusCoupon: '',
            chargesMoney: 0,
            BonusMSG: '',
            // allBalance: '',
            bonusId: 0,
            BonusData: '',
        })
        // setTimeout(() => {
        //     this.setState({ allBalance })
        // }, 1000);
    }
    //isDepositVerificationOTP 是否需要验证手机,isIWMM 是否显示开启更多存款和提款方式btn
    //User.js,DepositCenter.js, withdrawal.js都是用到
    checkCustomFlag() {
        
        fetchRequest(ApiPort.CustomFlag + 'flagKey=BankCardVerification&', 'GET')
        .then(data => {
            if (data.isSuccess) {
                let result = data.result
                let isIWMM = result.isIWMM? result.isIWMM: false
                let isDepositVerificationOTP = result.isDepositVerificationOTP? result.isDepositVerificationOTP: false
                this.setState({isIWMM, isDepositVerificationOTP})

                if(!(!this.state.isDepositVerificationOTP && this.state.FirstName.length > 0)) {
                    //需要手机验证，才能存款
                    Actions.pop();
                    Actions.BankCardVerify({isDepositVerificationOTP})
                }
            }
        })
        .catch(() => {})
    }

    //进行姓名银行卡验证添加
    goIWMM() {
        PiwikEvent('Verification', 'Click', 'IWMM_PII_DepositPage')
        this.setState({ moreDepositWithdrawal: true })
    }

    //获取用户信息
    checkMember() {
        //将账户清空，获取默认账户后再加回去
        this.setState({ activeBalanceName: '' })

        fetchRequest(ApiPort.Member, 'GET')
            .then(data => {
                let memberInfo = data.result.memberInfo
                if (memberInfo) {
                    global.storage.save({
                        key: 'memberInfo',
                        id: "memberInfos",
                        data: memberInfo,
                        expires: null
                    });
                    let nameSt = memberInfo.FirstName == '';
                    let IdentityCardSt = memberInfo.IdentityCard? false: true
                    let FirstName = memberInfo.FirstName

                    let phoneData = memberInfo.Contacts.find(v => v.ContactType.toLocaleLowerCase() === 'phone')
					let phoneSt = phoneData ? (phoneData.Status.toLocaleLowerCase() === 'unverified' ? true : false) : true


                    this.setState({ FirstName, LBFirstName: FirstName }, () => {
                        this.checkCustomFlag(FirstName)
                    })

                }
            })
            .catch(() => { })
    }
    //点击下一步
    okPayClick() {
        const st = this.state;
        if(!st.FirstName) {
            //没有姓名无法存款，去个人中心添加
            this.setState({FirstNameModal: true})
            return
        }
        //极速虚拟币支付
        if (st.CTC_CHANNEL_INVOICE == 'CHANNEL' && st.activeCode == 'CTC') {
            if (st.depositDetail.Banks.length == 0) { return }
            // PiwikEvent('Submit_Crypto_deposit')
            PiwikEvent('Deposit', 'Submit', 'Crypto')
            this.setState({ CTC_CHANNEL_pay: true })
            return;
        }

        if (!st.okPayBtn) { return }
        //提交前需要提示显示银行卡或者二维码
        if(st.activeCode == 'ALB' && !st.isQrcodeALB) {
            this.setState({isQrcodeALB: true})
            return
        }
        this.setState({isQrcodeALB: false})
        let moneys = st.money
        let data = {
            "accountHolderName": st.accountHolderName,
            "language": "zh-cn",
            "paymentMethod": st.activeCode,
            "charges": st.charges,
            "amount": moneys,
            "transactionType": "Deposit",
            "domainName": SBTDomain,
            "isMobile": true,
            "isSmallSet": false,
            "bonusId": st.bonusId,
            "mgmtRefNo": mgmtRefNo,
            "successUrl": SBTDomain,
            "depositingWallet": st.activeBalance,  //目標帳戶
            'isPreferredWalletSet': false, // 是不是首選帳戶
            "blackBoxValue": Iovation,
            "e2BlackBoxValue": E2Backbox,
        };;
        if (st.activeCode == 'LB') {
            if (st.depositDetail.BankAccounts.length == 0) {
                Toasts.fail('存款银行错误,联系客服添加', 2)
                return;
            }
            let BankAccounts = st.depositDetail.BankAccounts[st.BankNameKey]
            data = {
                domainName: SBTDomain,
                isMobile: true,
                IsSmallSet: false,
                MemberCode: userNameDB,
                RequestedBy: userNameDB,
                amount: moneys,
                CurrencyCode: "cny",
                transactionType: "1",
                Charges: st.charges,
                accountNumber: "0", //帐号
                accountHolderName: st.LBFirstName, //账户持有人姓名
                bankName: BankAccounts.BankCode, //银行名
                city: "city",
                province: "province",
                branch: "branch",
                SWIFTCode: "FUN88",
                paymentMethod: 'LB',
                mgmtRefNo: mgmtRefNo,
                bonusId: st.bonusId,
                refNo: "0",
                offlineRefNo: "0",
                // depositingBankAcctNum: BankAccounts.AccountNo.slice(-6),
                merchantType: 1,
                "depositingWallet": st.activeBalance,
                "blackBoxValue": Iovation,
                "e2BlackBoxValue": E2Backbox,
            }
            if(!st.IsAutoAssign) {
                data.depositingBankAcctNum = BankAccounts.AccountNo.slice(-6)
            }
        } else if (st.activeCode == 'WCLB') {
            if (st.depositDetail.BankAccounts.length == 0) {
                Toasts.fail('存款银行错误,联系客服添加', 2)
                return;
            }
            let BankAccounts = st.depositDetail.BankAccounts[st.BankNameKey]
            data = {
                "accountHolderName": st.FirstName, //账户持有人姓名
                "accountNumber": BankAccounts.AccountNo, //帐号
                "amount": moneys,
                "bankName": BankAccounts.BankName, //银行名
                "city": "city",
                "province": "province",
                "branch": "branch",
                "language": "zh-cn",
                "paymentMethod": 'WCLB',
                "charges": st.charges,
                "transactionType": "Deposit",
                "domainName": SBTDomain,
                "isMobile": false,
                "isSmallSet": false,
                "refNo": "0",
                "offlineDepositDate": "",
                "mgmtRefNo": mgmtRefNo,
                "transferType": st.depositDetail.TransferTypes.length > 0 && st.depositDetail.TransferTypes[0] || '', // 收款账户支持信息
                "offlineRefNo": "0",
                // "depositingBankAcctNum": BankAccounts.AccountNo.slice(-6),
                "isPreferredWalletSet": false, // 是否设为默认目标账户
                "isMobile": false,
                "depositingWallet": st.activeBalance,
                "cardName": "",
                "cardNumber": "",
                "cardPIN": "",
                "cardExpiryDate": "",
                "bonusId": st.bonusId,
                "bonusCoupon": st.bonusCoupon,
                "couponText": "",
                "fileBytes": "",
                "fileName": "",
                "secondStepModel": null,
                "successUrl": SBTDomain,
                "blackBoxValue": Iovation,
                "e2BlackBoxValue": E2Backbox,
            }
            if(!st.IsAutoAssign) {
                data.depositingBankAcctNum = BankAccounts.AccountNo.slice(-6)
            }
        } else if (st.activeCode == 'ALB') {
            if (st.depositDetail.BankAccounts.length == 0) {
                Toasts.fail('存款银行错误,联系客服添加', 2)
                return;
            }
            let BankAccounts = st.depositDetail.BankAccounts[st.BankNameKey]

            data = {
                accountHolderName: st.FirstName, // 账户持有人姓名
                accountNumber: "0", //帐号
                amount: moneys,
                bankName: BankAccounts.BankName, //银行名
                language: "zh-cn",
                paymentMethod: 'ALB',
                charges: st.charges,
                transactionType: "Deposit",
                domainName: SBTDomain,
                isMobile: true,
                isSmallSet: false,
                refNo: "0",
                offlineDepositDate: "",
                mgmtRefNo: mgmtRefNo,
                offlineRefNo: "0",
                BankLogID: BankAccounts.BankLogID,
                depositingBankAcctNum: BankAccounts.AccountNo,
                isPreferredWalletSet: false,
                isMobile: true,
                depositingWallet: st.activeBalance,
                bonusId: st.bonusId,
                bonusCoupon: st.bonusCoupon,
                secondStepModel: null,
                successUrl: SBTDomain,
                "blackBoxValue": Iovation,
                "e2BlackBoxValue": E2Backbox,
                transferType: {
                    ID: 27,
                    Sorting: 2,
                    Name: "LocalBank",
                    CurrencyCode: "CNY",
                    Code: "LocalBank",
                    IsActive: true,
                },
            }
            if(!st.IsAutoAssign) {
                data.depositingBankAcctNum = BankAccounts.AccountNo
            }
        } else if (st.activeCode == 'CC' || st.activeCode == 'AP') {


            //APcaredUSD=true表示AP存款，且卡号事美元
            moneys = st.APcaredUSD ? st.USDRateMoney : st.money;//AP存款换美元处理
            let cardExpiryDate = st.activeCode == 'AP' ? (st.yearDate + '/' + st.monthDate) : ''
            let USDRate = st.activeCode == 'AP' ? st.USDRate : '0';
            data = {
                accountHolderName: "",
                accountNumber: "0",
                amount: moneys,
                bankName: "",
                bonusId: st.bonusId,
                bonusCoupon: st.bonusCoupon,
                cardExpiryDate: cardExpiryDate,
                cardName: "",
                cardNumber: st.caredNum,
                cardPIN: st.PINNum,
                charges: st.charges,
                couponText: "",
                depositingBankAcctNum: "",
                depositingWallet: st.activeBalance, // 目标账户Code
                domainName: SBTDomain,
                fileBytes: "",
                fileName: "",
                isMobile: false,
                isPreferredWalletSet: false, // 是否设为默认目标账户
                isSmallSet: false,
                language: "zh-cn",
                mgmtRefNo: mgmtRefNo,
                offlineDepositDate: "",
                offlineRefNo: "0",
                paymentMethod: st.activeCode,
                refNo: USDRate,
                secondStepModel: null,
                successUrl: SBTDomain,
                transactionType: "Deposit",
                transferType: null,
                "blackBoxValue": Iovation,
                "e2BlackBoxValue": E2Backbox,
            }
        } else if (st.activeCode == 'BC') {
            if (st.depositDetail.Banks.length == 0) {
                Toasts.fail('存款银行错误,联系客服添加', 2)
                return;
            }
            let bankNames = st.depositDetail.Banks[st.BankNameKey].Code
            data = {
                accountHolderName: st.accountHolderName,
                accountNumber: "0",
                amount: moneys,
                bankName: bankNames,
                bonusId: st.bonusId,
                bonusCoupon: st.bonusCoupon,
                cardExpiryDate: "",
                cardName: "",
                cardNumber: "",
                cardPIN: "",
                charges: st.charges,
                couponText: "",
                depositingBankAcctNum: "",
                depositingWallet: st.activeBalance,
                domainName: SBTDomain,
                fileBytes: "",
                fileName: "",
                isMobile: true,
                isPreferredWalletSet: false, // 是否设为默认目标账户
                isSmallSet: false,
                language: "zh-cn",
                mgmtRefNo: mgmtRefNo,
                offlineDepositDate: "",
                offlineRefNo: "0",
                paymentMethod: "BC",
                refNo: "0",
                secondStepModel: null,
                successUrl: SBTDomain,
                transactionType: "Deposit",
                transferType: null,
                "blackBoxValue": Iovation,
                "e2BlackBoxValue": E2Backbox,
            }
        } else if (st.activeCode == 'BCM') {
            let bankNames = st.depositDetail.Banks.length > 0 && st.depositDetail.Banks[st.BankNameKey].Code || ''

            data = {
                accountHolderName: st.accountHolderName,
                amount: moneys,
                charges: st.charges,
                bankName: bankNames,
                depositingBankAcctNum: "",
                depositingWallet: st.activeBalance, // 目标账户Code
                domainName: SBTDomain,
                isMobile: true,
                isPreferredWalletSet: false, // 是否设为默认目标账户
                isSmallSet: false,
                language: "zh-cn",
                mgmtRefNo: mgmtRefNo,
                offlineDepositDate: "",
                offlineRefNo: "0",
                paymentMethod: "BCM",
                bonusId: st.bonusId,
                refNo: "0",
                successUrl: SBTDomain,
                transactionType: "Deposit",
                "blackBoxValue": Iovation,
                "e2BlackBoxValue": E2Backbox,
            }

        } else if (st.activeCode == 'QQ') {
            data = {
                accountHolderName: "",
                accountNumber: "0",
                amount: moneys,
                bankName: "",
                bonusId: st.bonusId,
                bonusCoupon: st.bonusCoupon,
                cardExpiryDate: "",
                cardName: "",
                cardNumber: "",
                cardPIN: "",
                charges: st.charges,
                couponText: "",
                depositingBankAcctNum: "",
                depositingWallet: st.activeBalance, // 目标账户Code,
                domainName: SBTDomain,
                mgmtRefNo: mgmtRefNo,
                fileBytes: "",
                fileName: "",
                isMobile: true,
                isPreferredWalletSet: false, // 是否设为默认目标账户,
                isSmallSet: false,
                language: "zh-cn",
                offlineDepositDate: "",
                offlineRefNo: "0",
                paymentMethod: 'QQ',
                refNo: "0",
                secondStepModel: null,
                successUrl: SBTDomain,
                transactionType: "Deposit",
                transferType: null,
                "blackBoxValue": Iovation,
                "e2BlackBoxValue": E2Backbox,
            }

        } else if (st.activeCode == 'CTC') {
            // 虚拟币支付
            data = {
                "language": "zh-cn",
                "paymentMethod": st.activeCode,
                "charges": 0,
                "Amount": moneys,
                "transactionType": "Deposit",
                "domainName": SBTDomain,
                "isMobile": true,
                "IsSmallSet": false,
                // "bonusId": st.CTC_CHANNEL_INVOICE != 'INVOICE' ? st.bonusId : 0,//无法申请优惠
                "bonusId": st.bonusId,//无法申请优惠
                "mgmtRefNo": mgmtRefNo,
                "successUrl": SBTDomain,
                "Methodcode": st.CTC_CHANNEL_INVOICE,
                "depositingWallet": st.activeBalance,  //目標帳戶
                'isPreferredWalletSet': false, // 是不是首選帳戶
                "blackBoxValue": Iovation,
                "e2BlackBoxValue": E2Backbox,
            };
        } else if (st.activeCode == "PPB") {
            let bankNames = st.depositDetail.Banks.length > 0 && st.depositDetail.Banks[st.BankNameKey].Code || ''
            data = {
                accountHolderName: st.accountHolderName,
                accountNumber: "0",
                amount: moneys,
                bankName: bankNames,
                bonusId: st.bonusId,
                bonusCoupon: st.bonusCoupon,
                cardExpiryDate: "",
                cardName: "",
                cardNumber: "",
                cardPIN: "",
                charges: st.charges,
                couponText: "",
                depositingBankAcctNum: "",
                depositingWallet: st.activeBalance, // 目标账户Code
                domainName: SBTDomain,
                fileBytes: "",
                fileName: "",
                isMobile: true,
                isPreferredWalletSet: false, // 是否设为默认目标账户
                isSmallSet: false,
                language: "zh-cn",
                mgmtRefNo: mgmtRefNo,
                offlineDepositDate: "",
                offlineRefNo: "0",
                paymentMethod: "PPB",
                refNo: "0",
                secondStepModel: null,
                successUrl: SBTDomain,
                transactionType: "Deposit",
                transferType: null,
                "blackBoxValue": Iovation,
                "e2BlackBoxValue": E2Backbox,
            }

        } else if (st.activeCode == 'SR') {
            data = {
                "language": "zh-cn",
                "paymentMethod": "SR",
                "charges": st.charges,
                "MemberName": userNameDB,
                "RequestedBy": userNameDB,
                "amount": moneys,
                "CurrencyCode": "CNY",
                "transactionType": "Deposit",
                "domainName": SBTDomain,
                "isMobile": false,
                "isSmallSet": false,  
                "mgmtRefNo": mgmtRefNo,
                "bankName": "",
                "address": "",
                "city": "",
                "province": "",
                "branch": "",
                "accountHolderName": "",
                "bonusId": st.bonusId,
                "bonusCoupon": st.bonusCoupon,
                "blackBoxValue": Iovation,
                "e2BlackBoxValue": E2Backbox,
            }

        }

        if (st.paymentchannelEND != "" && st.activeCode != 'CTC' && st.activeCode != 'LB') { //支付渠道
            data.methodcode = st.paymentchannelEND
        }

        this.okPayPiwik(st.activeCode)
        Toast.loading('存款中,请稍候...', 200);
        fetchRequest(ApiPort.PaymentApplications, 'POST', data)
            .then((data) => {
                Toast.hide();
                if (data && data.isPopup == true) {
                    //存款被锁定提示
                    this.setState({ isPopup: true })
                }
                this.setState({ DepositData: data })

                if (data.isSuccess) {
                    
                    this.props.froms == 'promotions' && this.okBonusId(data)
                    if (st.activeCode == 'PPB') {
                        this.setState({ ppbVisible: true })
                        setTimeout(() => {
                            //1分钟后自动跳转
                            this.state.ppbVisible && this.setState({ ppbVisible: false }, () => { this.isSuccess(data) })
                        }, 60 * 1000);
                        return
                    }
                    let isSmileLBAvailable = data.returnedBankDetails? !data.returnedBankDetails.isSmileLBAvailable: false
                    if (
                        st.activeCode == 'LB' && (data.isPaybnbDepositWithDifferentRequestedBank || isSmileLBAvailable)
                    ) {
                        // 本地银行充值银行错误
                        this.setState({ lbVisible: true, isSmileLBAvailable: true })
                        return
                    }
                    if((st.activeCode == 'WCLB' || st.activeCode == 'ALB') && isSmileLBAvailable) {
                        this.setState({ isSmileLBAvailable: true }, () => {
                            this.isSuccess(data)
                        })
                        return
                    }
                    this.isSuccess(data)

                } else {
                    if(st.activeCode == 'PPB' &&  data.errorCode== "P103001") {
                        this.setState({ ppbVisibleErr: true })
                        return
                    }
                    if(st.activeCode == 'SR' || data.errorCode == 'P111001' || data.errorCode == 'P111004') {
                        if(st.activeCode == 'SR' && data.errorCode == 'P101116') {
                            this.setState({
                                lastDepositID: data.lastDepositID,
                                lastDepositAmount: data.lastDepositAmount,
                                isShowRpeatModal: true})
                            return
                        }
                        this.setState({depositErrModal: true})
                        return
                    }
                    Toasts.fail(data.errorMessage, 2);
                }
            })
            .catch(() => {

            })
    }

    //极速虚拟币支付
    CTC_CHANNEL_pay() {

        const st = this.state;

        let item = st.depositDetail.Banks[st.CTCListtype]
        let dataJson = '?CoinsCurrency=' + item.Code + '&ExchangeAmount=1&MethodCode=CHANNEL&'
        Toast.loading('存款中,请稍候...', 200);
        PiwikEvent('Deposit_Nav', 'Confirm', 'Crypto_Channel_Next')
        fetchRequest(ApiPort.GetCryptocurrencyInfo + dataJson, 'GET')
            .then((data) => {
                Toast.hide();
                if (data && data.isPopup == true) {
                    //存款被锁定提示
                    this.setState({ isPopup: true })
                }
                if (data.Error) {
                    Toasts.fail(data.Error, 2)

                } else if (data.status == 'SUCCESS') {

                    //成功
                    let checkcallbackDate = {
                        userName: st.FirstName,
                        data: data,
                        activeBalanceName: '',
                        activeCode: st.activeCode,
                        activeName: `${item.Name}(${item.Code})`,
                        payCallback: data,
                        ALBTypeActive: '',
                        bonusTitle: '',
                    }

                    let depositPageDate = {
                        checkcallbackDate,
                        previousPage: '',
                    }
                    Actions.DepositCenterPage({
                        checkcallbackDate,
                        previousPage: '',
                        CTC_code: item.Code,
                    });
                }
            })
            .catch(() => { })
    }

    okPayPiwik(code) {
        switch (code) {
            case 'LB':
                // PiwikEvent('Deposit', 'Submit', 'Localbank')
                PiwikEvent('Deposit_Nav', 'Next', 'Localbank')
                break;
            case 'JDP':
                PiwikEvent('Deposit', 'Submit', 'JD')
                break;
            case 'UP':
                PiwikEvent('Deposit', 'Submit', 'Unionpay')
                break;
            case 'BC':
                PiwikEvent('Deposit', 'Submit', 'CDC')
                break;
            case 'BCM':
                PiwikEvent('Deposit', 'Submit', 'MobileCDC')
                break;
            case 'ALB':
                // PiwikEvent('Deposit', 'Submit', 'LocalbankAlipay')
                PiwikEvent('Deposit_Nav', 'Next', 'LocalbankAlipay')
                break;
            case 'OA':
                PiwikEvent('Deposit', 'Submit', 'OnlineAlipay')
                break;
            case 'QQ':
                PiwikEvent('Deposit', 'Submit', 'QQwallet')
                break;
            case 'AP':
                PiwikEvent('Deposit', 'Submit', 'Astropay')
                break;
            case 'CC':
                PiwikEvent('Deposit', 'Submit', 'Cashcard')
                break;
            case 'PPB':
                PiwikEvent('Deposit', 'Submit', 'P2PBanking')
                break;
            case 'WCLB':
                // PiwikEvent('Deposit', 'Submit', 'LocalbankAlipay')
                PiwikEvent('Deposit_Nav', 'Next', 'LocalbankWechat')
                break;
            case 'WC':
                PiwikEvent('Deposit', 'Submit', 'OnlineWechat')
                break;
            case 'CTC':
                PiwikEvent('Deposit', 'Submit', 'Crypto')
                break;
            case 'SR':
                PiwikEvent('Deposit', 'Submit', 'SmallRiver')
                break;
            default:
                break;
        }
    }
    //QQ存款成功处理
    PayAreadyQQ() {
        this.setState({ PayAreadyQQ: false }, () => {
            let data = this.state.DepositData
            let st = this.state;
            let datas = {...data, moneys: st.money }
            Actions.DepositPage({
                activeCode: st.activeCode,
                data: datas,
                activeName: st.activeName,
                previousPage: '',
                froms: this.props.froms,
                BonusData: st.BonusData[st.BonusIndex], 
            });
            this.clearData()
        })
    }
    //充值成功后要给后台传优惠id，
	okBonusId(value) {
		let ST = this.state;
		let data = {
			"blackBoxValue": Iovation,
			"e2BlackBoxValue": E2Backbox,
			"blackBox": E2Backbox,
			"bonusId": ST.bonusId,
			"amount": ST.money,
			"bonusMode": "deposit",
			"targetWallet": "SB",
			"couponText": "",
			"isMax": false,
			"depositBonus": {
				"depositCharges": ST.charges,
				"depositId": value.transactionId || ''
			},
			"successBonusId": value.successBonusId || ''
		   }

		fetchRequest(ApiPort.BonusApplications, "POST", data)
			.then(data => { 
                if(data && data.message == 'fun88_BonusApplySuccess') {
                    window.bonusState = true
                } else {
                    Toasts.fail('优惠申请失败，请联系在线客服', 2);
				}
            })
			.catch(() => { });
	}

    //存款成功处理
    isSuccess(data) {
        const st = this.state;

        //表示优惠过来的存款SignUpBonus
        let checkcallbackDate = '';
        if (st.activeCode == 'LB') {
            checkcallbackDate = {
                userName: st.LBFirstName,
                data: st.depositDetail.BankAccounts[st.BankNameKey],
                activeBalanceName: st.activeBalanceName,
                activeCode: st.activeCode,
                activeName: st.activeName,
                payCallback: data,
                ALBTypeActive: '',
                bonusTitle: st.bonusTitle,
            }
            Actions.DepositCenterPage({
                checkcallbackDate,
                previousPage: '',
                froms: this.props.froms,
                BonusData: st.BonusData[st.BonusIndex], 
                isSmileLBAvailable: st.isSmileLBAvailable,
                depositCodeClick: () => { this.depositCodeClick(st.depositList[0].code, st.depositList[0].name) }
            });
        } else if (st.activeCode == 'WCLB') {
            checkcallbackDate = {
                userName: st.FirstName,
                data: st.depositDetail.BankAccounts[st.BankNameKey],
                activeBalanceName: st.activeBalanceName,
                activeCode: st.activeCode,
                activeName: st.activeName,
                payCallback: data,
                ALBTypeActive: '',
                bonusTitle: st.bonusTitle,
            }
            Actions.DepositCenterPage({
                checkcallbackDate,
                previousPage: '',
                froms: this.props.froms,
                BonusData: st.BonusData[st.BonusIndex], 
                isSmileLBAvailable: st.isSmileLBAvailable,
                depositCodeClick: () => { this.depositCodeClick(st.depositList[0].code, st.depositList[0].name) },
            });
        } else if (st.activeCode == 'CTC' && st.CTC_CHANNEL_INVOICE == 'INVOICE_AUT') {
            checkcallbackDate = {
                userName: '',
                data: '',
                activeBalanceName: '',
                activeCode: st.activeCode,
                activeName: st.activeName,
                payCallback: data,
                ALBTypeActive: '',
                bonusTitle: st.bonusTitle,
                INVOICE_AUT: true,
            }
            Actions.DepositCenterPage({
                checkcallbackDate,
                previousPage: '',
                froms: this.props.froms,
                BonusData: st.BonusData[st.BonusIndex], 
            });
        } else if (st.activeCode == 'ALB') {
            checkcallbackDate = {
                userName: '',
                data: '',
                activeBalanceName: '',
                activeCode: st.activeCode,
                activeName: st.activeName,
                payCallback: data,
                ALBTypeActive: st.ALBTypeActive,
                bonusTitle: st.bonusTitle,
            }
            Actions.DepositCenterPage({
                checkcallbackDate,
                previousPage: '',
                froms: this.props.froms,
                BonusData: st.BonusData[st.BonusIndex], 
                isSmileLBAvailable: st.isSmileLBAvailable,
                depositCodeClick: () => { this.depositCodeClick(st.depositList[0].code, st.depositList[0].name) },
            });
        } else if (st.activeCode == 'SR') {
            Actions.SRSecondStep({ secondStepData: data, activeDeposit: st.activeCode });
            
        } else if (st.activeCode == 'PPB' && data.vendorDepositBankDetails) {
            Actions.PPBSecondStep({ secondStepData: data, activeDeposit: st.activeCode });
            
        } else if (st.activeCode == 'JDP' || st.activeCode == 'OA' || st.activeCode == 'WC' || st.activeCode == 'BC' || st.activeCode == 'BCM' || st.activeCode == 'UP' || st.activeCode == 'CTC' || st.activeCode == 'PPB') {
            checkcallbackDate = {
                userName: '',
                data: '',
                activeBalanceName: '',
                activeCode: st.activeCode,
                activeName: st.activeName,
                payCallback: data,
                ALBTypeActive: '',
                bonusTitle: st.bonusTitle,
                INVOICE_AUT: true,
            }
            let datas = {...data, moneys: st.money }

            Actions.DepositPage({
                checkcallbackDate,
                activeCode: st.activeCode,
                data: datas,
                activeName: st.activeName,
                previousPage: '',
                froms: this.props.froms,
                BonusData: st.BonusData[st.BonusIndex], 
            });

        } else if (st.activeCode === 'CC' || st.activeCode === 'AP') {
            this.Countdown()
            this.setState({ PayAready: true })
        } else if (st.activeCode === 'QQ') {
            this.setState({ PayAreadyQQ: true })
        }
        this.setState({isSmileLBAvailable: false})
        // this.clearData()
    }
    //金额输入
    MoneySlider = () => {
        const {
            SliderssRun,
            moneyST,
            money,
            MaxBalShow,
            MinBalShow,
            TransferNumber,
            DayBalShow,
            MaxBal,
            MinBal,
            activeCode,
            DayBal,
            depositDetail,
            uniqueAmountStatus,
            SignUpMoney,
            OASuggestedAmount,
        } = this.state;
        return (

            <View>
                {
                    <View>
                        <Text style={{ marginTop: 15, marginBottom: 5 }}>存款金额</Text>
                        <View style={{ backgroundColor: "#fff", borderRadius: 5 }}>
                            {/* <Text style={{ color: "#000", fontSize: 12 }}>{`输入金额(￥${MinBalShow}~￥${MaxBalShow})`}</Text> */}
                            <View
                                style={{
                                    borderColor: "#ddd",
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    height: 38,
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <TextInput
                                    // value={money != "" && "￥" + money}
                                    value={money}
                                    style={{
                                        color: "#000",
                                        height: 38,
                                        width: width - 70,
                                        fontSize: money == ''? 12: 14,
                                    }}
                                    keyboardType={'number-pad'}
                                    maxLength={10}
                                    placeholder={`单笔存款范围:${MinBalShow}-${MaxBalShow},每日可存款${TransferNumber}次`}
                                    placeholderTextFontSize={8}
                                    onChangeText={value => {
                                        this.moneyChange(value);
                                    }}
                                    onBlur={() => {
                                        this.moneyBlur();
                                    }}
                                    onFocus={() => {
                                        this.setState({ SliderssRun: !SliderssRun, money: 0 })
                                    }}
                                />
                            </View>
                            {
                                moneyST != "" &&
                                <View style={{backgroundColor:'#fee0e0',borderRadius:5, marginTop:10,marginBottom:10}}>
                                    <Text style={{ color: "red", fontSize: 11,paddingLeft:10,paddingBottom:10,paddingTop:10 }}>
                                        {moneyST}
                                    </Text>
                                </View>
                            }
                            {
                                (activeCode == 'OA' || activeCode == 'WC') && money.toString().slice(-1) == 0 &&
                                <View style={{backgroundColor:'#D6F0FF',borderRadius:5, marginTop:10,marginBottom:10}}>
                                    <Text style={{ color: "#00A6FF", fontSize: 11,paddingLeft:10,paddingBottom:10,paddingTop:10 }}>
                                        请您输入非整数的金额进行充值，例如：301，519元。
                                    </Text>
                                </View>
                            }
                            {
                                // uniqueAmountStatus && OASuggestedAmount.length == 0 &&
                                // <Text style={{ color: 'red', fontSize: 11, marginBottom: 10 }}>
                                //     基于风控机制，建议提交存款的时候，尾数请避免输入0，建议提交1-9的金额，举例： 135元，128元等的，以免无法提交存款。
                                // </Text>
                            }
                            <View>
                                {OASuggestedAmount.length > 0 && this.MoneyNeedThis()}
                                {/* {SliderssRun && OASuggestedAmount.length == 0 && this.SliderssRun()} */}
                                {/* {!SliderssRun && OASuggestedAmount.length == 0 && this.SliderssRun()} */}
                            </View>
                        </View>
                        {/* <View style={stylespage.moneyas}>
                            <Text style={{ color: '#666666', fontSize: 12 }}>{`单笔最低金额 ${MinBalShow} 元，最高金额 ${MaxBalShow} 元，每日总允许金额 ${DayBalShow} 元`}</Text>
                        </View> */}
                    </View>
                }
            </View>

        )
    }

    //只能用建議金額
    MoneyNeedThis = () => {
        const {
            OASuggestedAmount,
            money,
        } = this.state;
        return (
            <View style={{ paddingLeft: 15, paddingRight: 15, alignItems: 'center' }}>
                <View style={stylespage.SuggestedAmountArrow}></View>
                <View style={{ backgroundColor: '#F5F5F5', paddingTop: 10, paddingBottom: 10, width: width - 50, borderRadius: 12 }}>
                    <Text style={{ color: '#666666', fontSize: 13, paddingLeft: 5 }}>请选择以下存款金额以便快速到账</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', left: 5, width: width - 60, justifyContent: "space-between", flexWrap: "wrap", marginTop: 8 }}>
                        {
                            OASuggestedAmount.map((item, index) => {
                                return (
                                    <View style={{ paddingBottom: 7 }}>
                                        <TouchableOpacity key={index} onPress={(value: any) => {
                                            this.setState({
                                                OASuggestedAmount: ''
                                            }, () => { this.moneyChange("￥" + item, 'OASuggestedAmount') })
                                        }}
                                        >
                                            <View style={[(money == item) ? stylespage.OAMoneyButtonHover : stylespage.OAMoneyButton]}>
                                                <Text style={{ color: money == item ? '#fff' : '#000', textAlign: 'center', lineHeight: 35, fontSize: 12 }}>{"￥" + item}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            </View>
        )
    }

    //滑动金额初始化
    SliderssRun = () => {
        const {
            Sliderss,
        } = this.state;
        return (
            <View style={{}}>
                <Text style={{ fontSize: 12 }}>或是使用滑动条</Text>
                <Slider
                    value={Sliderss}
                    step={0.25}
                    minimumTrackTintColor={"red"}
                    defaultValue={Sliderss}
                    onChange={value => {
                        this.sliderChange(value);
                    }}
                    onAfterChange={() => {

                    }}
                />
                <View
                    style={[
                        stylespage.SliderList,
                        { paddingLeft: 10, paddingRight: 10 }
                    ]}
                >
                    <View style={stylespage.scaleKey} />
                    <View style={stylespage.scaleKey} />
                    <View style={stylespage.scaleKey} />
                    <View style={stylespage.scaleKey} />
                    <View style={stylespage.scaleKey} />
                </View>
                <View style={stylespage.SliderList}>
                    <Text style={{ fontSize: 11, color: "#000" }}> 0%</Text>
                    <Text
                        style={{ fontSize: 11, color: "#000", marginLeft: 5 }}
                    >
                        {" "}
                                50%
                        </Text>
                    <Text style={{ fontSize: 11, color: "#000" }}>100%</Text>
                </View>
            </View>
        )
    }

    //获取存款方式
    GetPaymentReload() {
        // Toast.loading('加载中...', 200);
        fetchRequest(ApiPort.Payment + '?transactionType=deposit&', 'GET')
            .then(data => {
                PiwikEvent('Deposit_wallet')
                // Toast.hide();
                if (data) {
                    storage.save({
                        key: 'depositList',
                        id: 'depositList',
                        data: data,
                        expires: null,
                    });
                    let activeDepositIndex = data.findIndex((item) => { return (item.code == this.state.nowActiveDeposit) })
                    if (activeDepositIndex == -1) { activeDepositIndex = 0 }

                    this.setState({
                        activeCode: data[activeDepositIndex].code,
                        activeName: data[activeDepositIndex].name,
                        depositList: data,
                    })
                    this.depositCodeClick(data[activeDepositIndex].code, data[activeDepositIndex].name)

                } else {
                    Toasts.fail('网络出错误', 2)
                }
            }).catch(error => {
                Toast.hide();
            })
    }
    depositPiwik(code) {
        switch (code) {
            case 'LB':
                // PiwikEvent('Deposit_Nav', 'Launch', 'Deposit_Localbank')
                PiwikEvent('Deposit_Nav', 'Launch', 'Deposit_Localbank')
                break;
            case 'JDP':
                PiwikEvent('Deposit_Nav', 'Launch', 'Deposit_JD')
                break;
            case 'UP':
                PiwikEvent('Deposit_Nav', 'Launch', 'Deposit_Unionpay')
                break;
            case 'BC':
                PiwikEvent('Deposit_Nav', 'Launch', 'Deposit_CDC')
                break;
            case 'BCM':
                PiwikEvent('Deposit_Nav', 'Launch', 'Deposit_MobileCDC')
                break;
            case 'ALB':
                // PiwikEvent('Deposit_Nav', 'Launch', 'Deposit_LocalbankAlipay')
                PiwikEvent('Deposit_Nav', 'Launch', 'Deposit_LocalbankAlipay')
                break;
            case 'OA':
                PiwikEvent('Deposit_Nav', 'Launch', 'Deposit_OnlineAlipay')
                break;
            case 'QQ':
                PiwikEvent('Deposit_Nav', 'Launch', 'Deposit_QQwallet')
                break;
            case 'AP':
                PiwikEvent('Deposit_Nav', 'Launch', 'Deposit_Astropay')
                break;
            case 'CC':
                PiwikEvent('Deposit_Nav', 'Launch', 'Deposit_Cashcard')
                break;
            case 'PPB':
                PiwikEvent('Deposit_Nav', 'Launch', 'Deposit_P2PBanking')
                break;
            case 'WCLB':
                // PiwikEvent('Deposit_Nav', 'Launch', 'Deposit_LocalbankWechat')
                PiwikEvent('Deposit_Nav', 'Launch', 'Deposit_LocalbankWechat')
                break;
            case 'WC':
                PiwikEvent('Deposit_Nav', 'Launch', 'Deposit_OnlineWechat')
                break;
            case 'CTC':
                PiwikEvent('Deposit_Nav', 'Launch', 'Deposit_Crypto')
                break;
            case 'SR':
                PiwikEvent('Deposit_Nav', 'Launch', 'Deposit_SmallRiver')
                break;
            default:
                break;
        }
    }

    //获取存款详情
    depositCodeClick(code, name) {
        const Filtercode = this.state.depositList.filter(type => type.code == code)


        //支付渠道
        let BoxM = [];
        Filtercode[0].availableMethods.length > 0 && Filtercode[0].availableMethods.map(function (item, index) {
            if (item.MethodType != 'DEFAULT' && item.MethodCode != "DEFAULT") {
                BoxM.push({ value: item.MethodCode, label: item.MethodType, isNew: item.isNew || false })
            }
        });

        let BoxMs = BoxM.length > 0 ? BoxM[0].value : 'DEFAULT';


        //尾数是否为0的判断
        let depositList = this.state.depositList;
        let activeDeposit = depositList.find((item) => { return (item.code == code) })
        this.setState({
            isQrcodeALB: false,
            CTC_CHANNEL_INVOICE: '',
            activeName: name,
            activeCode: code,
            MaxBal: '0.00',
            moneyST: '',
            MinBal: '0.00',
            monthDate: '月份',
            yearDate: '年份',
            okPayBtn: false,
            CTCtype: 0,
            depositDetail: '',
            Sliderss: 0,
            BankNameKey: 0,
            chargesMoney: 0,
            SliderssRun: !this.state.SliderssRun,
            money: '',//不清空金额
            caredNum: '',
            PINNum: '',
            APcaredUSD: false,
            FirstNameChange: false,
            bonusCoupon: '',
            accountHolderName: '',
            accountHolderNameTest: '',
            PrefillRegisteredName: false,
            ShowDepositorNameField: false,
            SRdisabledErr: false,
            SRAmountsActive: 9999,
            activeDeposit,
            uniqueAmountStatus: activeDeposit.uniqueAmountStatus,
            paymentchannel: BoxM,//支付渠道選擇  benji
            paymentchannelEND: BoxM.length > 0 ? BoxM[0].value : 'DEFAULT',//支付渠道選擇  benji
            OASuggestedAmount: [],
            SuggestedAmounts: [],
        })
        Toast.loading('加载中...', 200);
        let isMobile = code == 'BC' ? false : true;
        let getDeposit = '?transactionType=deposit&method=' + code + '&MethodCode=' + BoxMs + '&isMobile=' + isMobile + '&'

        fetchRequest(ApiPort.PaymentDetails + getDeposit, 'GET')
            .then(data => {
                console.log(data, 'GetDetails')
                this.depositPiwik(code)
                Toast.hide();
                //验证是否能存款
                console.log('datadatadatadata111', data)
                // this.validation()
                let MaxBal = data.Setting ? data.Setting.MaxBal : '0.00'
                let MinBal = data.Setting ? data.Setting.MinBal : '0.00'
                let charges = data.Setting ? data.Setting.Charges : 0;
                // let MaxBalShow = this.formatAmount(MaxBal),
                //     MinBalShow = this.formatAmount(MinBal),
                //     DayBalShow = this.formatAmount(DayBal);
                console.log('datadatadatadata', data)
                let MaxBalShow = data.Setting ? data.Setting.MaxBal : '0.00'
                let MinBalShow = data.Setting ? data.Setting.MinBal : '0.00'
                let DayBalShow = data.Setting ? data.Setting.Charges : 0;
                let TransferNumber = data.Setting ? data.Setting.TransferNumber : 0;
                console.log('datadatadatadata222', data)
                //美元汇率
                let USDRate = 0
                if (code === 'AP' && data.Setting != '') {
                    USDRate = data.Setting.ExchangeRates != '' ? data.Setting.ExchangeRates[0].Rate : 0
                }
                let noewMoney = this.state.money || '0'

                if (code == 'CTC') {
                    let CTC_CHANNEL_INVOICE = activeDeposit.availableMethods[0].MethodCode
                    this.setState({ CTC_CHANNEL_INVOICE })
                    //急速虚拟币支付默认金额1
                    if (CTC_CHANNEL_INVOICE == 'CHANNEL') { noewMoney = MinBal.toString(); this.setState({okPayBtn: true}) }
                }
                let SuggestedAmounts = data.SuggestedAmounts ? data.SuggestedAmounts : []
                let ShowDepositorNameField = data.Setting.ShowDepositorNameField || false
                let PrefillRegisteredName = data.Setting.PrefillRegisteredName || false

                let IsAutoAssign = data.Setting.IsAutoAssign? data.Setting.IsAutoAssign: false

                this.setState({ MaxBal, MinBal, USDRate, DayBal: data.Setting.DayBal, depositDetail: data, charges, MaxBalShow, MinBalShow, DayBalShow, TransferNumber, ShowDepositorNameField, PrefillRegisteredName, IsAutoAssign, SuggestedAmounts }, () => {

                    //检查最低金额符合
                    // this.moneyChange(noewMoney)

                })
                this.SRdisabledErr(SuggestedAmounts)//SR存款提示

            })
            .catch(() => {
                Toast.hide();
            })
    }


    //檢查有無規定金額  benji
    checkAmount() {
        const { BankMaxBal, BankMinBal, activeCode, money, paymentchannelEND } = this.state;
        let url = `isMobile=true&amount=${money}&Method=${activeCode}&MethodCode=${paymentchannelEND}&`
        console.log(ApiPort.SuggestedAmount + url, 'TT1111')
        Toast.loading('检测中,请稍候...', 6);
        fetchRequest(ApiPort.SuggestedAmount + url, 'GET').then(res => {
            console.log(res, 'SuggestedAmount')
            Toast.hide();
            if (res && res.length > 0) {
                this.setState({
                    OASuggestedAmount: res,
                    okPayBtn: false
                }, () => {
                    // this.moneyChange(this.state.money || '0')
                })
            } else {
                this.setState({
                    payMoneyST: true,
                    payMoneySTMsg: '',
                }, () => {
                    //this.moneyChange(this.state.money || '0')
                })
            }
        })
    }


    //檢測支付渠道 最小最大金額
    checkAgn(key, Nowname) {

        const { activeCode, paymentchannelEND } = this.state;
        let typeS = key ? key : paymentchannelEND

        //isMobile   判斷是不是 手機版 ,不是要寫false
        Toast.loading('加载中,请稍候...', 6);
        fetchRequest(ApiPort.PaymentDetails + '?transactionType=deposit&method=' + activeCode + '&MethodCode=' + typeS + '&', 'GET')
            .then(data => {
                console.log(data, '支付渠道A')
                Toast.hide();

                let MaxBal = data.Setting ? data.Setting.MaxBal : '0.00'
                let MinBal = data.Setting ? data.Setting.MinBal : '0.00'
                let DayBal = data.Setting ? data.Setting.DayBal : '0.00'
                let charges = data.Setting ? data.Setting.Charges : 0;

                let MaxBalShow = MaxBal;
                let MinBalShow = MinBal;
                let DayBalShow = DayBal;
                let TransferNumber = data.Setting ? data.Setting.TransferNumber : 0;
                let ShowDepositorNameField = data.Setting.ShowDepositorNameField || false
                let PrefillRegisteredName = data.Setting.PrefillRegisteredName || false
                let IsAutoAssign = data.Setting.IsAutoAssign? data.Setting.IsAutoAssign: false
                let SuggestedAmounts = data.SuggestedAmounts ? data.SuggestedAmounts : []
                this.setState({ MaxBal, MinBal, DayBal, MaxBalShow, MinBalShow, DayBalShow, charges, depositDetail: data, TransferNumber, ShowDepositorNameField, PrefillRegisteredName, IsAutoAssign, SuggestedAmounts }, () => {
                    //检查最低金额符合
                    // this.moneyChange(this.state.money || '0')

                })
                this.SRdisabledErr(SuggestedAmounts)//SR存款提示

            })
    }

    //只給有支付渠道用
    paymentchannelDWButton = (value) => {     //只給支付渠道用
        this.setState({
            paymentchannelEND: value,
            OASuggestedAmount: [],
        })

        setTimeout(() => {
            this.checkAgn(value);
        }, 600)




    }

    //验证信息完整
    validation(key) {
        const st = this.state;
        //新增存款姓名，
        const accountHolderNameVal = ['BC', 'BCM', 'OA', 'PPB', 'UP']
        let okPayBtn = false;
        //lb本银验证
        if (st.activeCode === 'LB') {
            if (st.money && !st.moneyST && !st.LBFirstNameTest) {
                okPayBtn = true
            }
        } else if (st.activeCode === 'CC') {
            if (st.money && !st.caredNumST && !st.PINNumST && !st.moneyST && st.caredNum && st.PINNum) {
                okPayBtn = true
            }
        }
        else if (st.activeCode === 'AP') {
            if (st.money && !st.caredNumST && !st.PINNumST && !st.moneyST && st.monthDate != '月份' && st.caredNum && st.PINNum) {
                okPayBtn = true
            }
        } else if (st.activeCode === 'CTC' && st.CTC_CHANNEL_INVOICE == 'CHANNEL') {
            okPayBtn = true
        } else if(accountHolderNameVal.includes(st.activeCode) && st.ShowDepositorNameField && !st.PrefillRegisteredName) {
            if(st.accountHolderName && !st.accountHolderNameTest) {
                okPayBtn = true
            }
        } else if (st.money && !st.moneyST) {
            //其他银行只要输入进入和选择账户
            okPayBtn = true
        }

        //提交按钮默认高亮，点击提示信息填写完整,置灰
        // key && this.setState({ okPayModal: !okPayBtn })

        this.setState({ okPayBtn })

    }
    //滑动条金额
    sliderChange(value) {
        console.log("asdasdasd", value);
        const st = this.state;
        let money = 0;
        if (value == 0) {
            money = 100.00
        } else {
            money = (value * this.state.MaxBal).toFixed(2);
        }
        //除了以下的都不能输入小数点
        if (st.activeCode !== 'ALB' || st.activeCode !== 'LB' || st.activeCode !== 'WCLB' || st.activeCode !== 'AP') {
            money = Math.ceil(money)
        }

        //这些是不能输入尾数0的存款
        if (st.uniqueAmountStatus) {
            if (money.toString().slice(-1) == 0) {
                money = Number(money) - 1
            }
        }
        this.moneyChange("￥" + money);
    }
    //输入金额
    moneyChange(value, type) {

        console.log(type, 'moneyChange')
        const st = this.state;
        let test = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/g;
        let moneyST = "";
        let Sliderss = 0;
        let money = value.replace("￥", "");


        let NeedCallApiCheck = ['OA', 'QQ', 'JDP', 'BC', 'BCM', 'WC', 'ALB', 'UP', 'PPB', 'BCM']  //需要call API檢查金額
        //除了以下的都不能输入小数点
        if (st.activeCode !== 'ALB' || st.activeCode !== 'LB' || st.activeCode !== 'WCLB' || st.activeCode !== 'AP') {
            money = money.replace('.', '')
        }

        console.log(st.activeCode, 'st.activeCode')

        if (money == "" || Number(money) == 0) {
            moneyST = "最小存款金额为：" + st.MinBal;

        } else if (test.test(Number(money)) != true) {
            moneyST = "请输入正确的金额格式";

        } else if (Number(money) > Number(st.MaxBal)) {
            moneyST = "最大金额必须为：" + st.MaxBal + '或以下的金额';

        } else if (Number(money) < Number(st.MinBal)) {
            moneyST = "最小存款金额为：" + st.MinBal;

        } else if (NeedCallApiCheck.indexOf(st.activeCode) != -1) {
            console.log('moneymoneymoneymoney', money)
            if (!type) {
                this.checkAmount(); //檢測金額  benji
            }
        } else if (st.uniqueAmountStatus) {

            if (money.toString().slice(-1) == 0) {
                moneyST = '金额必须以 "1-9" 结尾'

            } else {
                moneyST = ''
            }
        } else {
            moneyST = ''
            // Sliderss = money / MaxBal;
        }
        //qq支付微支付在线支付宝有个实际到账
        let chargesMoney = 0;
        if ((st.activeCode == 'QQ' || st.activeCode == 'OA' || st.activeCode == 'WC' || st.activeCode == 'PPB'|| st.activeCode == 'JDP'|| st.activeCode == 'BC' || st.activeCode == 'BCM'|| st.activeCode == 'UP') && moneyST == '') {
            chargesMoney = Number(money) + (Number(money) * Number(st.charges))
        }

        this.setState({ money, moneyST, Sliderss, chargesMoney }, () => {
            this.validation();
        });
    }

    //美元兑换处理
    APcaredUSDMoney(value) {
        const st = this.state;
        let USDRateMoney = '0.00'//美元
        let test = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/g;
        let moneyST = "";
        let money = value.replace("￥", "");

        if (money == "" || Number(money) == 0) {
            moneyST = "最小存款金额为：$" + (st.MinBal / st.USDRate).toFixed(2);

        } else if (test.test(Number(money)) != true) {
            moneyST = "请输入正确的金额格式";

        } else if (Number(money) > (st.MaxBal / st.USDRate).toFixed(2)) {
            moneyST = "最大存款金额为：$" + (st.MaxBal / st.USDRate).toFixed(2);

        } else if (Number(money) < (st.MinBal / st.USDRate).toFixed(2)) {
            moneyST = "最小存款金额为：$" + (st.MinBal / st.USDRate).toFixed(2);
        } else {
            moneyST = ''
        }
        //算美元金额
        if (moneyST == '') {
            // USDRateMoney = st.USDRate * 10 * money / 10;
            USDRateMoney = parseInt(st.USDRate * money);
        }

        this.setState({ money, moneyST, USDRateMoney }, () => {
            this.validation();
        });
    }

    //输入金额后校验优惠信息
    moneyBlur() {
        this.bonusChange(this.state.bonusId, this.state.money);
    }

    //账户选择
    _dropdown_renderButtonText(rowData) {
        return `${rowData.name}`;
    }
    //账户选择下拉
    _dropdown_1_renderRow(rowData, rowID, highlighted) {
        return (
            <View
                style={{ width: width - 50 }}
            >
                <Text
                    style={{ color: highlighted ? "red" : "#000", paddingLeft: 15, lineHeight: 38 }}
                >{`${rowData.name}`}</Text>
            </View>
        );
    }
    //支付宝转账选择
    ALB_dropdown_renderButtonText(rowData) {
        return `${rowData.name}`;
    }
    //支付宝转账下拉
    ALB_dropdown_1_renderRow(rowData, rowID, highlighted) {
        return (
            <View
                style={{ width: width - 50 }}
            >
                <Text
                    style={{ color: highlighted ? "red" : "#000", paddingLeft: 15, lineHeight: 38 }}
                >{`${rowData.name}`}</Text>
            </View>
        );
    }
    //支付宝转账
    ALB_balanceSelect = (key) => {
        this.setState({
            ALBTypeActive: ALBType[key].code,
        },() => {
            this.okPayClick()
        })
    }

    //AP卡卡号
    APcaredChange(value) {
        const numTest = /^[0-9]{16,30}$/;
        let caredNumST = '';
        if (value == '') {
            caredNumST = '请输入卡号'
        } else if (numTest.test(value) != true) {
            caredNumST = '卡号格式错误'
        }
        //判断是不是美元卡
        let APcaredUSD = caredNumST == '' && value != '' && value.slice(3, 4) == '6' || false;

        this.setState({ money: 0, caredNum: value, caredNumST, APcaredUSD }, () => {
            this.validation()
        })
    }
    //同城卡卡号
    CCcaredChange(value) {
        const numTest = /^[0-9]{4,30}$/;
        let caredNumST = '';
        if (value == '') {
            caredNumST = '请输入卡号'
        } else if (numTest.test(value) != true) {
            caredNumST = '卡号格式错误'
        }
        this.setState({ caredNum: value, caredNumST }, () => {
            this.validation()
        })
    }
    //同城卡密码
    CCPINChange(value) {
        const numTest = /^[0-9]{4,30}$/;
        let PINNumST = '';
        if (value == '') {
            PINNumST = '请输入卡密码'
        } else if (numTest.test(value) != true) {
            PINNumST = '卡密码格式错误'
        }
        this.setState({ PINNum: value, PINNumST }, () => {
            this.validation()
        })
    }
    monthDateChange = (value) => {
        let Wdate = new Date(value);
        let Wy = Wdate.getFullYear();
        let Wm = Wdate.getMonth() + 1;
        if (Number(Wm) < 10) { Wm = '0' + Wm.toString() }
        this.setState({
            monthDate: Wm,
            yearDate: Wy,
        }, () => {
            this.validation()
        })
    }

    //支付渠道選擇
    OASuggested_dropdown_renderButtonText(rowData) {
        return `${rowData.label}`;
    }
    //支付渠道下拉
    OASuggested_dropdown_1_renderRow(rowData, rowID, highlighted) {
        return (
            <View
                style={{ width: width - 50 }}
            >
                <Text
                    style={{ color: highlighted ? "red" : "#000", paddingLeft: 15, lineHeight: 38 }}
                >{`${rowData.label}`}</Text>
            </View>
        );
    }


    //LB存款选择
    LB_dropdown_renderButtonText(rowData) {
        return `${rowData.BankName}`;
    }
    //LB存款下拉
    LB_dropdown_1_renderRow(rowData, rowID, highlighted) {
        return (
            <View
                style={{ width: width - 50 }}
            >
                <Text
                    style={{ color: highlighted ? "red" : "#000", paddingLeft: 15, lineHeight: 38 }}
                >{`${rowData.BankName}`}</Text>
            </View>
        );
    }
    //在线存款选择
    BC_dropdown_renderButtonText(rowData) {
        return `${rowData.name}`;
    }
    //在线存款下拉
    BC_dropdown_1_renderRow(rowData, rowID, highlighted) {
        return (
            <View
                style={{ width: width - 50 }}
            >
                <Text
                    style={{ color: highlighted ? "red" : "#000", paddingLeft: 15, lineHeight: 38 }}
                >{`${rowData.name}`}</Text>
            </View>
        );
    }
    //在线存款选择
    BCbank_dropdown_renderButtonText(rowData) {
        return `${rowData.Name}`;
    }
    //在线存款下拉
    BCbank_dropdown_1_renderRow(rowData, rowID, highlighted) {
        return (
            <View
                style={{ width: width - 50 }}
            >
                <Text
                    style={{ color: highlighted ? "red" : "#000", paddingLeft: 15, lineHeight: 38 }}
                >{`${rowData.Name}`}</Text>
            </View>
        );
    }

    //LB选择银行卡选择
    bankSelect = (key) => {
        this.setState({
            BankNameKey: key
        })
    }


    renderPage({ item, index }) {
        return (
            <View key={index}>
                <Image resizeMode="contain" style={{ width: width / 1.3, height: width / 1.3 }} source={item.imgs} />
                <Text style={{ lineHeight: 35, marginTop: 30, color: '#220000', fontSize: 17 }}>{item.title}</Text>
                <Text style={{ color: '#220000', fontSize: 13 }}>{item.conter}</Text>
            </View>
        );
    }

    //LB填写姓名
    LBFirstName(value) {
        const nameTest = /^[\u4e00-\u9fa5\u0E00-\u0E7F ]{2,15}$/;
        let LBFirstNameTest = '';
        if (value == '') {
            LBFirstNameTest = '请输入姓名'
        } else if (nameTest.test(value) != true) {
            LBFirstNameTest = '姓名格式错误'
        }
        this.setState({ LBFirstName: value, LBFirstNameTest, FirstNameChange: true }, () => {
            this.validation()
        })
    }

    accountHolderName(value) {
        const nameTest = /^[\u4e00-\u9fa5\u0E00-\u0E7F ]{2,15}$/;
        let accountHolderNameTest = '';
        if (value == '' || value.length < 2) {
            accountHolderNameTest = '请输入全名'
        } else if (nameTest.test(value) != true) {
            accountHolderNameTest = '格式不正确'
        }
        this.setState({ accountHolderName: value, accountHolderNameTest }, () => {
            this.validation()
        })
    }
    	//优惠
	_dropdown_1_renderButtonText(rowData) {
		return <Text style={{width: width*0.7}} numberOfLines={1}>{`${rowData.title === "fun88_ApplyNextTime"?"下回再参与！":rowData.title}`}</Text>;
	}
	//优惠下拉列表
	_dropdown_3_renderRow(rowData, rowID, highlighted) {
		return (
			<View style={{ width: width - 50, padding: 15,backgroundColor: highlighted ? "#00A6FF" : "#fff" , display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
				<Text style={{color: highlighted? '#fff': '#000'}}>
					{rowData.title != "" && (rowData.title === "fun88_ApplyNextTime"?"下回再参与！":rowData.title)}
				</Text>
				{/* <Text style={{color: highlighted? '#666': 'transparent'}}>✓</Text> */}
			</View>
		);
	}
    //拿優惠
    getBonus() {
        Toast.loading('加载中...', 200);
        this.setState({ BonusData: '', BonusMSG: '', activeBalance: 'SB' })
        fetchRequest(
            ApiPort.Bonus + "?transactionType=Deposit&wallet=" + 'SB' + "&",
            "GET"
        )
            .then(data => {
                Toast.hide();
                if (data.length > 0) {
                    let promotionsId = this.props.promotionsDetail.bonusProductList[0].bonusID
                    let BonusIndex = data.findIndex(v => v.id == promotionsId)
                    if(BonusIndex == -1) {BonusIndex = 0}
                    this.setState({ BonusData: data, BonusIndex, bonusId: promotionsId }, () => {

                        //默认选择优惠验证
                        this.bonusChange(promotionsId, this.state.money)
                    })
                }

            })
            .catch(() => { Toast.hide(); });
    }
    BonusButton = (key) => {
        let bonusId = this.state.BonusData[key].id
        this.setState({
            BonusIndex: key,
            bonusId,
            bonusCouponKEY: this.state.BonusData[key].bonusCouponID //是否需要优惠码
        }, () => {
            this.bonusChange(bonusId, this.state.money)
        })
    }
    //获取优惠详情信息
    bonusChange = (id, money) => {
        let m = money.toString().replace("￥", "");
        let st = this.state;

        if (id == 0 || this.state.moneyST) {
            //金额格式错误和不选择优惠
            this.setState({ BonusMSG: '' })
            return;
        }

        if (st.activeCode == 'AP') {
            //AP充值换美元处理
            m = st.APcaredUSD ? st.USDRateMoney : m;
        }
        let data = {
            transactionType: "Deposit",
            bonusId: id,
            amount: m || 1,//没有输入金额时候传1过去拿最低充值金额,传0过去拿不到
            wallet: 'SB',
            couponText: "string"
        };
        fetchRequest(ApiPort.BonusCalculate, "POST", data)
            .then(data => {
                if (data.previewMessage != "") {
                    this.setState({
                        // BonusMSG: id != 0 ? data.previewMessage: '',
                        BonusMSG: ''
                    });
                } else if (data.errorMessage != "") {
                    this.setState({
                        BonusMSG: id != 0 ? data.errorMessage: ''
                    });
                }
            })
            .catch(() => {
                Toast.fail(data.errorMessage, 2);
            });
    };

    //姓名认证
    MemberName(value) {
        const nameTest = /^[\u4e00-\u9fa5\u0E00-\u0E7F ]{2,15}$/;
        let MemberNameTest = '';
        if (value == '') {
            MemberNameTest = '请输入全名'
        } else if (nameTest.test(value) != true) {
            MemberNameTest = '真实姓名格式有误'
        }
        this.setState({ MemberName: value, MemberNameTest })
    }
    CTCchange(item, index) {
        let activeDeposit = this.state.activeDeposit
        this.setState({ CTCtype: index, CTC_CHANNEL_INVOICE: item.MethodCode, activeName: item.MethodType })
        this.checkAgn(item.MethodCode)
        if(item.MethodCode == 'CHANNEL') {
            this.setState({okPayBtn: true})
        } else {
            this.setState({okPayBtn: false})
        }
        if (item.MethodCode == 'CHANNEL') {
            PiwikEvent('Deposit_Nav', 'Confirm', 'Crypto_Channel')
        } else if (item.MethodCode == 'INVOICE') {
            PiwikEvent('Deposit_Nav', 'Confirm', 'Crypto_Invoice1')
        } else if (item.MethodCode == 'INVOICE_AUT') {
            PiwikEvent('Deposit_Nav', 'Confirm', 'Crypto_Invoice2')
        } else {
            PiwikEvent('Deposit_Nav', 'Confirm', 'Crypto_OTC')
        }
    }

    CHANNEL_change(key) {
        this.setState({ CTCListtype: key })
        let code = this.state.depositDetail.Banks[key].Code
        if (code == 'BTC') {
            PiwikEvent('Deposit_Nav', 'Confirm', 'Crypto_BTC')
        } else if (code == 'ETH') {
            PiwikEvent('Deposit_Nav', 'Confirm', 'Crypto_Invoice2')
        } else if (code == 'USDT-ERC20') {
            PiwikEvent('Deposit_Nav', 'Confirm', 'Crypto_ERC20')
        } else if (code == 'USDT-TRC20') {
            PiwikEvent('Deposit_Nav', 'Confirm', 'Crypto_TRC20')
        }
    }

    // LB 取消充值
    CancelPaybnbDeposit(val) {
        if(this.state.isSmileLBAvailable) { return }
        fetchRequest(ApiPort.CancelPaybnbDeposit + 'depositId='+ val.transactionId + '&', 'POST')
            .then((data) => {})
            .catch(() => { })
    }

    PayAready() {
        this.setState({ PayAready: false })
    }
    formatAmount(num) {
        if (!num) {
            return 0;
        }
        let numCount = num.toString().split('.');
        let numCountVal = (numCount[0] + '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,') + (numCount[1] ? '.' + numCount[1].toString().substr(0, 2) : '');
        return typeof num === 'number' && isNaN(num) ? 0 : numCountVal;
    }

    //  小额存款金额选择,金额，选中key
    SRAmountSelect(item, SRAmountsActive) {
        item.IsActive && this.setState({money: item.Amount, SRAmountsActive}, () => { this.validation() })
    }
    SRdisabledErr(item) {
        if( item.length > 0 ) {
            let IsActive = ''
            IsActive = item.find(v => v.IsActive == true)
            this.setState({SRdisabledErr: IsActive? false: true})
        }
    }

    render() {

        window.goHome = () => {
            Actions.pop()
        }
        const {
            accountHolderName,
            accountHolderNameTest,
            ShowDepositorNameField,
            PrefillRegisteredName,
            keyboardOpen,
            depositList,
            activeCode,
            activeName,
            Sliderss,
            moneyST,
            money,
            MaxBal,
            MinBal,
            activeBalanceName,
            allBalance,
            defaultBalance,
            LBnameTest,
            TransferNumber,
            BonusData,
            BonusIndex,
            bonusKey,
            BonusMSG,
            bonusCouponID,
            okPayBtn,
            nextBtn,
            IsAutoAssign,
            PayAready,
            bonusCoupon,
            caredNum,
            caredNumST,
            PINNum,
            PINNumST,
            monthDate,
            yearDate,
            checkWallet,
            activeBalance,
            activeDeposit,
            CTCtype,
            CTCListtype,
            CTC_CHANNEL_INVOICE,
            CTC_CHANNEL_pay,
            activeSlide,
            ISpromp,
            BC_Deposit,
            isSmileLBAvailable,
            MemberName,
            MemberNameTest,
            chargesMoney,
            Countdown,
            depositDetail,
            APcaredUSD,
            USDRateMoney,
            USDRate,
            SignUpMoney,
            charges,
            okPayModal,
            FirstName,
            curBonusTitle,
            PayAreadyQQ,
            DepositData,
            depositPageDate,
            isPopup,
            ppbVisible,
            ppbVisibleErr,
            MaxBalShow,
            MinBalShow,
            DayBalShow,
            isQrcodeALB,
            SuggestedAmounts,
            SRdisabledErr,
            moreDepositWithdrawal,
            SRAmountsActive,
            depositErrModal,
            isIWMM,
            FirstNameModal,
            isShowRpeatModal,
            lastDepositID,
            lastDepositAmount
        } = this.state;
        const { paymentchannel, paymentchannelEND } = this.state;  //支付渠道
        window.showPushDeposit = (showPush) => {
            this.setState({ showPush })
        }
        return (
            <View style={{ flex: 1, backgroundColor: '#efeff4' }}>
                {/* 存款锁定提示 */}
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={isPopup}
                    onRequestClose={() => { }}
                    style={{ padding: 0, width: width / 1.3 }}
                >
                    <View style={stylespage.secussModal}>
                        <Text style={{ color: '#222222', lineHeight: 35, fontSize: 18 }}>信息</Text>
                        <Text style={{ color: '#696969', padding: 10, fontSize: 13, lineHeight: 22 }}>抱歉，由于您还有未完成的存款记录，暂时无法重复提交。若您已转账成功，请<Text onPress={() => { this.setState({ isPopup: false }, () => { LiveChatOpenGlobe() }) }} style={{ color: '#222', fontWeight: 'bold', lineHeight: 22, fontSize: 13, color: '#1C8EFF' }}>联系客服</Text>。</Text>
                        <Touch onPress={() => { this.setState({ isPopup: false }) }} style={{ padding: 10, backgroundColor: '#00a6ff', borderRadius: 5, width: width * 0.6, marginTop: 15 }}>
                            <Text style={{ color: '#fff', textAlign: 'center' }}>关闭</Text>
                        </Touch>
                    </View>
                </Modal>
                {/* QQ存款提示窗 */}
                <Modals
                    isVisible={PayAreadyQQ}
                    backdropColor={'#000'}
                    backdropOpacity={0.4}
                    style={{ justifyContent: 'center', margin: 0,marginLeft: 20, }}
                >
                    <View style={[stylespage.secussModal,{width: width - 40, borderRadius: 10, padding: 20, paddingTop: 0 }]}>
                        <View style={{backgroundColor: '#00A6FF', borderTopRightRadius: 10, borderTopLeftRadius: 10,width: width - 40}}>
                            <Text style={{ color: '#fff', lineHeight: 40, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>存款</Text>
                        </View>
                        <Text style={{ color: '#222222', width: width - 80, paddingBottom: 8, paddingTop: 15 }}>订单 {DepositData != '' && DepositData.transactionId || '-- --'} 创建成功。</Text>
                        <View style={{width: width - 80, borderRadius: 8, backgroundColor: '#FFF5BF'}}>
                            <Text style={{color: '#83630B', fontSize: 12, lineHeight: 20, padding: 10}}>
                                乐天使温馨提醒:请勿使用 QQ 添加陌生账号或是私自汇款给对方，以免遇到诈骗。 如有任何损失，乐天堂一概不负责。
                            </Text>
                        </View>
                        <Touch onPress={() => { this.PayAreadyQQ() }} style={{ backgroundColor: '#00a6ff', borderRadius: 5, marginTop: 25 }}>
                            <Text style={{ color: '#fff', lineHeight: 40, textAlign: 'center', width: width - 80, fontSize: 16, fontWeight: 'bold' }}>我知道了</Text>
                        </Touch>
                    </View>
                </Modals>
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={okPayModal}
                    onRequestClose={() => { }}
                    style={{ padding: 0, width: width / 1.3 }}
                >
                    <View style={stylespage.secussModal}>
                        <Text style={{ color: '#222222', lineHeight: 35, fontSize: 18 }}>提醒</Text>
                        <Text style={{ color: '#222222', padding: 10, paddingBottom: 20 }}>请填写完成表单才能进行提交</Text>
                        <Touch onPress={() => { this.setState({ okPayModal: false }) }} style={{ backgroundColor: '#00a6ff', borderRadius: 8, width: width / 1.5 }}>
                            <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 38, }}>确认</Text>
                        </Touch>
                    </View>
                </Modal>

                <Modal
                    animationType='none'
                    transparent={true}
                    visible={FirstNameModal}
                    onRequestClose={() => { }}
                    style={{ padding: 0, width: width / 1.3 }}
                >
                    <View style={stylespage.secussModal}>
                        <Text style={{ color: '#222222', lineHeight: 35, fontSize: 18 }}>提醒</Text>
                        <Text style={{ color: '#222222', padding: 10, paddingBottom: 20, textAlign: 'center', lineHeight: 19 }}>{`您好，为了保障您账户资金的安全，\n请先完善个人资料。`}</Text>
                        <Touch onPress={() => { this.setState({ FirstNameModal: false }, () => {
                            Actions.pop();
                            Actions.userInfor()
                        }) }} style={{ backgroundColor: '#00a6ff', borderRadius: 8, width: width / 1.5 }}>
                            <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 38, }}>我知道了</Text>
                        </Touch>
                    </View>
                </Modal>

                {/* 更多存款提款验证 */}
                <Modals
                    isVisible={moreDepositWithdrawal}
                    backdropColor={'#000'}
                    backdropOpacity={0.4}
                    style={{ justifyContent: 'center', margin: 0,marginLeft: 15, }}
                >
                        <View style={stylespage.moreOtpModal}>
                        <Image resizeMode='contain' source={require("../../images/warn.png")} style={{ width: 64, height: 64 }} />
                        <Text style={{ color: '#666', lineHeight: 20, textAlign: 'center', paddingTop: 20, fontSize: 14 }}>
                            {`提醒您，完成验证后，即可享有更多存款\n和提款方式。`}
                        </Text>
                        <View style={stylespage.moreOtpBtn}>
                            <Touch onPress={() => { this.setState({moreDepositWithdrawal: false}) }} style={stylespage.moreOtpLeftBtn}>
                                <Text style={stylespage.moreOtpItem}>稍后验证</Text>
                            </Touch>
                            <Touch onPress={() => { this.setState({ moreDepositWithdrawal: false }, () => {
                                Actions.pop()
                                Actions.BankCardVerify({isIWMM: true}) 
                                }) }} style={stylespage.moreOtpRightBtn}>
                                <Text style={[stylespage.moreOtpItem,{color: '#fff', lineHeight: 42} ]}>立即验证</Text>
                            </Touch>
                        </View>
                    </View>
                </Modals>

                <Modals
                    isVisible={CTC_CHANNEL_pay}
                    backdropColor={'#000'}
                    backdropOpacity={0.4}
                    style={{ justifyContent: 'center', margin: 0,marginLeft: 20, }}
                    onBackdropPress={() => {this.setState({ CTC_CHANNEL_pay: false })}}
                >
                    {
                        depositDetail != '' && depositDetail.Banks.length > 0 && depositDetail.Banks[CTCListtype] &&
                        <View style={[stylespage.secussModal,{width: width - 40, borderRadius: 10,padding: 15, paddingTop: 0}]}>
                            <View style={{width: width - 40,backgroundColor: '#00A6FF', borderTopRightRadius: 10,borderTopLeftRadius: 10}}>
                                <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', lineHeight: 35, textAlign: 'center' }}>重要提示</Text>
                            </View>
                            <Image resizeMode='contain' source={bankImage[depositDetail.Banks[CTCListtype].Code]} style={{ width: 98, height: 30, marginTop: 5, }} />
                            <Text style={{ color: '#222', lineHeight: 35 }}>
                                {depositDetail.Banks[CTCListtype].Name}({depositDetail.Banks[CTCListtype].Code})
                            </Text>
                            <View style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ color: '#00a6ff', lineHeight: 22 }}>
                                    请确保将<Text style={{ color: '#00a6ff' }}>{depositDetail.Banks[CTCListtype].Name} ({depositDetail.Banks[CTCListtype].Code}) 转入收款账户</Text>，若您使用其他虚拟货币支付，则可能造成资金损失。
                                </Text>
                                <Text style={{ color: '#222', lineHeight: 22 }}>
                                    当您点击“确认”，则表示您已同意承担上述风险。
                                </Text>
                            </View>
                            <View style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row' }}>
                                <Touch onPress={() => { this.setState({ CTC_CHANNEL_pay: false }); PiwikEvent('Deposit_Nav', 'Back', 'Crypto_Channel_Back') }} style={{ borderColor: '#00a6ff', borderRadius: 5, width: 120, marginTop: 35, borderWidth: 1, marginRight: 30 }}>
                                    <Text style={{ color: '#00a6ff', lineHeight: 42, textAlign: 'center' }}>关闭</Text>
                                </Touch>
                                <Touch onPress={() => { this.setState({ CTC_CHANNEL_pay: false }, () => { this.CTC_CHANNEL_pay() }) }} style={{ backgroundColor: '#00a6ff', borderRadius: 5, width: 120, marginTop: 35 }}>
                                    <Text style={{ color: '#fff', lineHeight: 42, textAlign: 'center' }}>确认</Text>
                                </Touch>
                            </View>
                        </View>
                    }
                </Modals>
                {
                    // 教学
                    activeCode != '' &&
                    <Modal
                        animationType='none'
                        transparent={true}
                        visible={ISpromp}
                        onRequestClose={() => { }}
                        style={{ width: width / 1.2, padding: 0 }}
                    >
                        <View style={{ backgroundColor: '#fff', borderRadius: 15 }}>
                            <Text style={{ fontSize: 18, color: '#000', fontWeight: 'bold', textAlign: 'center', lineHeight: 30 }}>{activeName}</Text>
                            <Carousel
                                ref={c => { this._carousel = c }}
                                data={promptList[activeCode]}
                                renderItem={this.renderPage}
                                sliderWidth={width}
                                itemWidth={width}
                                autoplay={true}
                                // loop={true}
                                onSnapToItem={index => this.setState({ activeSlide: index })}
                            />
                            <Pagination
                                // dotsLength={promptList[activeCode].length}
                                dotsLength={3}
                                activeDotIndex={activeSlide}
                                containerStyle={{
                                    paddingVertical: 2,
                                    position: "absolute",
                                    bottom: 60
                                }}
                                dotStyle={{
                                    backgroundColor: "#000000BF",
                                    position: 'relative',
                                    top: -60,
                                    left: width / 5
                                }}
                                inactiveDotStyle={{
                                    width: 10,
                                    backgroundColor: "#00000040"
                                }}
                                inactiveDotOpacity={1}
                                inactiveDotScale={0.6}
                            />
                            <Touch onPress={() => { this.setState({ ISpromp: false }) }} style={{ padding: 15 }}>
                                <Text style={{ color: '#00a6ff', textAlign: 'center', fontSize: 18 }}>关闭</Text>
                            </Touch>
                        </View>
                    </Modal>
                }
                {/* 存款完成提示 */}
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={PayAready}
                    onRequestClose={() => { }}
                    style={{ padding: 0, width: width / 1.3 }}
                >
                    <View style={stylespage.secussModal}>
                        <Image
                            resizeMode="stretch"
                            source={require("../../images/icon-done.png")}
                            style={{ width: 60, height: 60 }}
                        />
                        <Text style={{ color: '#222222', lineHeight: 25 }}>提交成功</Text>
                        <Text style={{ color: '#42D200', lineHeight: 25 }}>{Countdown}</Text>
                        <Text style={{ color: '#222222', padding: 10, fontSize: 13 }}>交易需要一段时间，请稍后再检查您的目标账户。</Text>
                        <Touch onPress={() => { this.PayAready() }} style={{ padding: 10, backgroundColor: '#00a6ff', borderRadius: 50, }}>
                            <Text style={{ color: '#fff' }}>返回存款首页</Text>
                        </Touch>
                    </View>
                </Modal>
                {/* 本地银行充值银行错误 */}
                <Modals
                    isVisible={this.state.lbVisible}
                    backdropColor={'#000'}
                    backdropOpacity={0.4}
                    style={{ justifyContent: 'center', margin: 0,padding: 25 }}
                    // onBackdropPress={() => {this.setState({ lbVisible: false })}}
                >
                    <View style={[stylespage.secussModal,{borderRadius: 15}]}>
                        <View style={{backgroundColor: '#00A6FF', borderTopLeftRadius: 15,borderTopRightRadius: 15, width: width - 50}}>
                            <Text style={{color: '#fff', lineHeight: 42,textAlign: 'center', fontSize: 16}}>温馨提醒</Text>
                        </View>
                        <Text style={{color: '#666', padding: 25,lineHeight: 21, paddingBottom: 15,}}>
                            {isSmileLBAvailable? '很抱歉，目前暂无可存款的银行。此次交易将被取消，请尝试其他存款方式。': '抱歉，您选择的银行暂不可用，建议您使用其他收款账户。​'}
                        </Text>
                        <View style={{ flexDirection: 'row', paddingBottom: 20 }}>
                            <Touch onPress={() => { this.setState({lbVisible: false}, () =>{this.CancelPaybnbDeposit(DepositData)}) }} style={stylespage.modalBtnclose}>
                                <Text style={{ color: '#00a6ff' }}>不用了</Text>
                            </Touch>
                            <Touch onPress={() => { this.setState({lbVisible: false}, () => {this.isSuccess(DepositData)}) }} style={stylespage.modalBtnok}>
                                <Text style={{ color: '#fff' }}>好的</Text>
                            </Touch>
                        </View>
                    </View>
                </Modals>

                {/* 网银转账提示 和错误提示 */}
                <Modals
                    isVisible={ppbVisible || ppbVisibleErr}
                    backdropColor={'#000'}
                    backdropOpacity={0.4}
                    style={{ justifyContent: 'center', margin: 0, padding: 25 }}
                >
                    <View style={stylespage.ppbModal}>
                        <View style={stylespage.ppbModalTitle}>
                            <Text style={{color: '#fff', lineHeight: 42,textAlign: 'center', fontSize: 16}}>{ppbVisible? '存款': '温馨提醒'}</Text>
                        </View>
                        <View style={{padding: 15}}>
                            {
                                ppbVisible &&
                                <View>
                                    <Text style={stylespage.ppbOrder}>订单{DepositData.transactionId}创建成功。</Text>
                                    <View style={stylespage.ppbModalMsg}>
                                        <Text style={{color: '#83630B', fontSize: 12, lineHeight: 18}}>乐天使温馨提醒 : 请在5分钟之内完成支付，以免到账延迟。</Text>
                                    </View>
                                </View>
                            }
                            {
                                ppbVisibleErr &&
                                <Text style={stylespage.ppbOrder}>当前交易繁忙，推荐使用USDT存款方式，体验极致存款速度，安全安心。</Text>
                            }
                            <Touch onPress={() => { 
                                if(ppbVisible) {
                                    this.setState({ ppbVisible: !ppbVisible }, () => { this.isSuccess(DepositData) })
                                } else {
                                    this.setState({ ppbVisibleErr: !ppbVisibleErr })
                                }
                            }} style={stylespage.ppbModalBtn}>
                                <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16 }}>{ppbVisible? '我知道了': '好的'}</Text>
                            </Touch>
                        </View>
                    </View>
                </Modals>

                {/* 存款错误弹窗，使用errorMessage */}
                <Modals
                    isVisible={depositErrModal}
                    backdropColor={'#000'}
                    backdropOpacity={0.4}
                    style={{ justifyContent: 'center', margin: 0, padding: 25 }}
                >
                    <View style={stylespage.ppbModal}>
                        <Touch style={stylespage.modalClose} onPress={() => { this.setState({ depositErrModal: false }) }}>
                            <Image
                                source={require('../../images/close.png')}
                                resizeMode='stretch'
                                style={{ width: 16, height: 16 }}
                            />
                        </Touch>
                        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20, }}>
                            <Image
                                source={require('../../images/warn.png')}
                                resizeMode='stretch'
                                style={{ width: 52, height: 52 }}
                            />
                        </View>
                        <Text style={{color: '#333333', fontSize: 13, lineHeight: 20, textAlign: 'center'}}>
                            {Boolean(DepositData.errorMessage)? `${DepositData.errorMessage}`: '网络错误，请稍后重试'}
                        </Text>
                        <View style={{padding: 15}}>
                            <Touch onPress={() => { this.setState({ depositErrModal: false }) }} style={stylespage.ppbModalBtn}>
                                <Text style={{ color: '#fff', textAlign: 'center', fontSize: 15 }}>我知道了</Text>
                            </Touch>
                        </View>
                    </View>
                </Modals>

                <Modals
                    isVisible={isShowRpeatModal}
                    backdropColor={'#000'}
                    backdropOpacity={0.4}
                    style={{ justifyContent: 'center', margin: 0,marginLeft: 20, }}
                >
                    <View style={[stylespage.secussModal,{width: width - 40, borderRadius: 10, padding: 20, paddingTop: 0 }]}>
                        <View style={{backgroundColor: '#00A6FF', borderTopRightRadius: 10, borderTopLeftRadius: 10,width: width - 40}}>
                            <Text style={{ color: '#fff', lineHeight: 40, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>重要提示</Text>
                        </View>
                        <Text style={{ color: '#666', width: width - 80, paddingBottom: 8, paddingTop: 15 }}>请耐心等待，您有一项存款申请正在处理中。</Text>
                        <View style={{width: width - 80, borderRadius: 8, backgroundColor: '#EFEFF4'}}>
                            <Text style={{color: '#83630B', fontSize: 12, lineHeight: 20, padding: 10}}>
                            存款编号：{lastDepositID}
                            </Text>
                            <Text style={{color: '#83630B', fontSize: 12, lineHeight: 20, padding: 10}}>
                            存款金额：{lastDepositAmount}
                            </Text>
                        </View>

                        <Text style={{ color: '#666', width: width - 80, paddingBottom: 8, paddingTop: 15, fontSize: 12 }}>请等待处理完毕后，再提交其他存款申请。</Text>
                        <Touch onPress={() => { 
                            this.setState({
                                isShowRpeatModal: false,
                                lastDepositID: '',
                                lastDepositAmount: ''
                            })
                         }} style={{ backgroundColor: '#00a6ff', borderRadius: 5, marginTop: 25 }}>
                            <Text style={{ color: '#fff', lineHeight: 40, textAlign: 'center', width: width - 80, fontSize: 16, fontWeight: 'bold' }}>好的</Text>
                        </Touch>
                    </View>
                </Modals>

                <View style={{ backgroundColor: '#efeff4' }}>
                    <KeyboardAwareScrollView
                        resetScrollToCoords={{ x: 0, y: 0 }}
                        onKeyboardWillShow={(frames: Object) => {
                            console.log('asdasdasdasdas')
                            if (Platform.OS === "android") {
                                this.setState({ keyboardOpen: true })
                            }
                        }}
                        onKeyboardWillHide={(frames: Object) => {
                            console.log('asdasdasdasdas111111')
                            if (Platform.OS === "android") {
                                this.setState({ keyboardOpen: false })
                            }
                        }}
                        style={{ backgroundColor: '#efeff4', height: height }}
                    >
                        <PushLayout showPush={this.state.showPush} />
                        <View style={{ padding: 15, paddingTop: 10 }}>
                            {/* 存款方式选择 */}
                            {
                                keyboardOpen &&
                                <View>
                                    <View style={stylespage.depositList}>
                                        {
                                            depositList.length == 0 &&
                                            new Array(10).fill(1).map((item, index) => {
                                                return (
                                                    <View style={stylespage.depositCode3}></View>
                                                )
                                            })
                                        }
                                        {
                                            isIWMM &&
                                            <Touch onPress={() => { this.goIWMM() }} style={stylespage.moreDepositWithdrawal}>
                                                <Text style={stylespage.moreDepositWithdrawalItem}>点击开启更多存款和提款方式</Text>
                                            </Touch>
                                        }
                                        {
                                            depositList[0] &&
                                            depositList.map((item, index) => {
                                                return (
                                                    DepositList[item.code] == 'show' &&
                                                    <Touch onPress={() => { this.depositCodeClick(item.code, item.name) }} key={index} style={[activeCode == item.code ? stylespage.depositCode1 : stylespage.depositCode2]}>
                                                        <Image resizeMode='contain' source={activeCode == item.code ? bankImageActive[item.code] : bankImage[item.code]} style={{ width: 25, height: 27, marginTop: 5, }} />
                                                        <Text style={{ fontSize: 10, color: activeCode == item.code ? '#fff' : '#000' }}>{item.name}</Text>
                                                        {
                                                            item.isNew &&
                                                            <View style={stylespage.news}>
                                                                <Text style={stylespage.newsTxt}>新</Text>
                                                            </View>
                                                        }
                                                        {
                                                            item.isFast &&
                                                            <View style={[stylespage.news, {borderTopRightRadius: 8}]}>
                                                                <Text style={stylespage.newsTxt}>极速</Text>
                                                            </View>
                                                        }
                                                    </Touch>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            }
                            <View style={[isQrcodeALB? {height: 0,overflow: 'hidden'}:{ backgroundColor: '#fff', borderRadius: 10, padding: 10, marginTop: 15 }]}>
                                {
                                    depositList.length == 0 &&
                                    <View style={{backgroundColor: '#f8f8f8',height: 150,borderRadius: 8}}></View>
                                }
                                {
                                    activeCode == 'WC' &&
                                    <View style={{ backgroundColor: '#fff5bf', borderRadius: 5, padding: 10 }}>
                                        <Text style={{ fontSize: 12, color: '#83630b', lineHeight: 17 }}>为避免款项延迟或掉单, 请于2分钟内完成扫码及转账动作。</Text>
                                    </View>
                                    
                                }
                                {paymentchannel != '' && activeCode != 'CTC' &&
                                    <View>
                                        <Text style={{ color: '#000', lineHeight: 35 }}>支付渠道</Text>

                                        <View
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                flexDirection: 'row',
                                                flexWrap: 'wrap',
                                            }}>
                                            {paymentchannel &&
                                                paymentchannel.map((item, index) => {

                                                    return (
                                                        <View>
                                                            <Touch onPress={() => { this.paymentchannelDWButton(item.value) }} key={index} >
                                                                <View style={stylespage.channel}>
                                                                    <View style={item.value == paymentchannelEND ? stylespage.paymenRadiusAHover : stylespage.paymenRadiusA}>
                                                                        <View style={item.value == paymentchannelEND ? stylespage.paymenRadiusBHover : stylespage.paymenRadiusB} />
                                                                    </View>
                                                                    <View>
                                                                        <Text style={{ fontSize: 12,width: (width - 105) / 2, paddingLeft: 5, }}>
                                                                            {`${item.label}`}
                                                                        </Text>
                                                                    </View>
                                                                    {
                                                                        item.isNew &&
                                                                        <View style={[stylespage.news, {borderTopRightRadius: 8}]}>
                                                                            <Text style={stylespage.newsTxt}>新</Text>
                                                                        </View>
                                                                    }
                                                                    {
                                                                        item.isFast &&
                                                                        <View style={[stylespage.news, {borderTopRightRadius: 8}]}>
                                                                            <Text style={stylespage.newsTxt}>极速</Text>
                                                                        </View>
                                                                    }
                                                                </View>
                                                            </Touch>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>



                                    </View>
                                }
                                {
                                    ((activeCode == 'OA' || activeCode == 'WC') && Number(charges) < 0) &&
                                     <View style={{ backgroundColor: '#FFF5BF', borderRadius: 5, padding: 10, marginBottom: 15 }}>
                                        <Text style={{ fontSize: 12, color: '#83630B', lineHeight: 17 }}>温馨提示：使用{activeName}进行存款，第三方平台将征收手续费 {Math.abs(Number(charges) * 100).toFixed(2)}%。</Text>
                                    </View>
                                }
                                {
                                    ShowDepositorNameField && PrefillRegisteredName &&
                                    <View>
                                        <Text style={{marginTop: 10}}>存款人姓名</Text>
                                        <View style={{ backgroundColor: '#EFEFF4', borderRadius: 5, marginTop: 5, padding: 10 }}>
                                            <Text style={{ fontSize: 12, color: '#999', lineHeight: 17 }}>请确保您的存款账户姓名与注册姓名一致，任何他人代付或转账将被拒绝且无法保证退款。</Text>
                                        </View>
                                    </View>
                                }
                                {
                                    ShowDepositorNameField && !PrefillRegisteredName &&
                                    <View>
                                        <Text style={{ paddingTop: 5, paddingBottom: 5 }}>存款人姓名</Text>
                                        <View
                                            style={stylespage.inputView}
                                        >
                                            <TextInput
                                                value={accountHolderName}
                                                style={{ color: "#000", height: 38, width: width - 60 }}
                                                placeholder={'请输入姓名'}
                                                onChangeText={value => {
                                                    this.accountHolderName(value);
                                                }}
                                            />
                                        </View>
                                        {
                                            accountHolderNameTest != '' &&
                                            <View style={{ backgroundColor: '#FEE0E0', borderRadius: 5, padding: 10, marginTop: 10 }}>
                                                <Text style={{ color: '#EB2121', fontSize: 12 }}>{accountHolderNameTest}</Text>
                                            </View>
                                        }
                                        <View style={{ backgroundColor: '#fff5bf', borderRadius: 5, padding: 10, marginTop: 10 }}>
                                            <Text style={{ fontSize: 12, color: '#83630b', lineHeight: 17 }}>请使用您本人账户进行转账，任何他人代付或转账将被拒绝且无法保证退款。</Text>
                                        </View>
                                    </View>
                                }
                                {/* {
                                    (this.state.paymentchannelEND == 'AlipayH5_LC' && Number(this.state.charges) < 0) &&
                                     <View style={{ backgroundColor: '#fff5bf', borderRadius: 5, marginTop: 15, padding: 10, marginBottom: 15 }}>
                                        <Text style={{ fontSize: 12, color: '#83630b', lineHeight: 17 }}>温馨提示：使用在线支付宝进行存款，第三方平台将征收手续费。</Text>
                                    </View>
                                }
                                {
                                    (this.state.paymentchannelEND == 'WeChatH5_LC' && Number(this.state.charges) < 0) &&
                                     <View style={{ backgroundColor: '#fff5bf', borderRadius: 5, marginTop: 15, padding: 10, marginBottom: 15 }}>
                                        <Text style={{ fontSize: 12, color: '#83630b', lineHeight: 17 }}>温馨提示：使用V信支付进行存款，第三方平台将征收手续费。</Text>
                                    </View>
                                } */}

                                {/* 加密货币 */}
                                {
                                    activeCode == 'CTC' &&
                                    <View>
                                        <View style={{ backgroundColor: '#fff5bf', borderRadius: 5, marginTop: 15, padding: 10, marginBottom: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#83630b', lineHeight: 17 }}>重要提示: 若使用加密货币支付，部分平台将征收手续费。</Text>
                                            <Text style={{ fontSize: 12, color: '#83630b', lineHeight: 17 }}>目前支持使用泰达币 (USDT-ERC20及USDT-TRC20协议) 进行存款。</Text>
                                        </View>
                                        <Text>选择支付方式<Text style={{ color: '#F92D2D' }}>*</Text></Text>
                                        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 15, flexWrap: 'wrap', }}>
                                            {
                                                activeDeposit != '' && activeDeposit.availableMethods.length > 0 ? activeDeposit.availableMethods.map((item, index) => {
                                                    return (
                                                        item.MethodCode != 'DEFAULT' &&
                                                        <Touch style={stylespage.CTCData} onPress={() => { this.CTCchange(item, index) }}>
                                                            <View style={[CTCtype == index ? stylespage.CTCList1 : stylespage.CTCList2]}>
                                                            </View>
                                                            <View style={{ width: (width - 80) * 0.4 }}>
                                                                <Text style={{ fontSize: 13, color: '#000' }}>{item.MethodType}</Text>
                                                                <Text style={{ fontSize: 12, color: '#999' }}>
                                                                    {
                                                                        item.MethodCode == 'INVOICE' ? '第三方交易所' : item.MethodCode == 'CHANNEL' ? '支付完成后会生成订单编号'  : item.MethodCode == 'OTC' ? '人民币转账' : '需填入交易哈希'
                                                                    }
                                                                </Text>
                                                            </View>
                                                        </Touch>
                                                    )
                                                })
                                                    :
                                                    <Text onPress={() => { Actions.LiveChatST() }} style={{ fontSize: 14, lineHeight: 40, paddingLeft: 15 }} >请联系客服添加</Text>
                                            }
                                        </View>
                                        {
                                            CTC_CHANNEL_INVOICE == 'CHANNEL' ?
                                                <View>
                                                    <Text>选择加密货币 <Text style={{ color: '#F92D2D' }}>*</Text></Text>
                                                    <View style={stylespage.CTCtypes}>
                                                        {
                                                            depositDetail != '' && depositDetail.Banks.length == 0 &&
                                                            <Text onPress={() => { Actions.LiveChatST() }} style={{ fontSize: 14, lineHeight: 40, paddingLeft: 15 }} >请联系客服添加</Text>
                                                        }
                                                        {
                                                            depositDetail != '' && depositDetail.Banks.length > 0 && depositDetail.Banks.map((item, index) => {
                                                                return (
                                                                    <Touch key={index} onPress={() => { this.CHANNEL_change(index) }} style={[CTCListtype == index ? stylespage.CTCtypeList1 : stylespage.CTCtypeList2]}>
                                                                        <Image resizeMode='contain' source={bankImage[item.Code]} style={{ width: 106, height: 32, marginTop: 5, }} />
                                                                        <Text style={{ fontSize: 12, color: CTCListtype == index ? '#fff' : '#222' }}>{item.Name}</Text>
                                                                        <Text style={{ fontSize: 12, color: CTCListtype == index ? '#fff' : '#222' }}>({item.Code})</Text>
                                                                        {
                                                                            item.Code == 'USDT-TRC20' &&
                                                                            <View style={stylespage.noPage}>
                                                                                <Text style={{ color: '#fff', fontSize: 11, padding: 1, }}>免手续费</Text>
                                                                            </View>
                                                                        }
                                                                    </Touch>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                </View>
                                                // : activeDeposit != '' && activeDeposit.availableMethods.length > 0 && activeDeposit.availableMethods[].MethodCode == 'INVOICE' ?
                                                : 
                                                (CTC_CHANNEL_INVOICE == 'OTC' || CTC_CHANNEL_INVOICE == 'INVOICE' || CTC_CHANNEL_INVOICE == 'INVOICE_AUT') ?
                                                    <View>
                                                        <Text>存款金额 <Text style={{ color: '#F92D2D' }}>*</Text></Text>
                                                        <View style={{ marginTop: 6 }}>
                                                            <View style={stylespage.inputView}>
                                                                <TextInput
                                                                    value={money}
                                                                    style={{ color: "#000", height: 38, width: width - 50,paddingLeft: 10, fontSize: money == ''? 12: 14 }}
                                                                    placeholder={`单笔存款最低：${MinBalShow}元起,最高：${MaxBalShow}元`}
                                                                    placeholderTextFontSize={8}
                                                                    placeholderTextColor="#BCBEC3"
                                                                    maxLength={10}
                                                                    keyboardType={'number-pad'}
                                                                    onChangeText={value => {
                                                                        this.moneyChange(value);
                                                                    }}
                                                                />
                                                            </View>
                                                            {
                                                                moneyST != "" &&
                                                                <View style={{backgroundColor:'#fee0e0',borderRadius:5,    marginTop:10,marginBottom:10}}>
                                                                    <Text style={{ color: "red", fontSize: 11,paddingLeft:10,paddingBottom:10,paddingTop:10 }}>
                                                                        {moneyST}
                                                                    </Text>
                                                                </View>
                                                            }
                                                        </View>
                                                    </View>
                                                    : null
                                                    // :
                                                    // <View>
                                                    //     {this.MoneySlider()}
                                                    // </View>
                                        }
                                    </View>
                                }
                                {
                                    //金额选择
                                    (activeCode == 'JDP' || activeCode == 'PPB' || activeCode == 'OA' || activeCode == 'WC' || activeCode == 'UP' || activeCode == 'WCLB' || activeCode == 'QQ' || activeCode == 'BC' || activeCode == 'BCM') &&
                                    <View>
                                        {this.MoneySlider()}
                                    </View>
                                }
                                {/* LB本地银行 */}
                                {
                                    activeCode == 'LB' &&
                                    <View>
                                        <View style={{ backgroundColor: '#fff5bf', borderRadius: 5, padding: 10 }}>
                                            <Text style={{ fontSize: 12, color: '#83630b', lineHeight: 17 }}>请确保“存款人姓名”和“存入金额”与您本人账户姓名和转入的金额保持一致以便及时到账！</Text>
                                        </View>
                                        {this.MoneySlider()}
                                        {
                                        !IsAutoAssign &&
                                        <View>
                                            <Text style={{ paddingBottom: 5, paddingTop: 15 }}>存款银行</Text>
                                            <View style={{ backgroundColor: "#fff", borderRadius: 5, marginBottom: 10 }}>
                                                {
                                                    depositDetail != '' && depositDetail.BankAccounts.length == 0 &&
                                                    <Text onPress={() => { LiveChatOpenGlobe() }} style={{ fontSize: 14, lineHeight: 40, paddingLeft: 15 }} >请联系客服添加</Text>
                                                }
                                                {
                                                    depositDetail != '' && depositDetail.BankAccounts.length > 0 &&
                                                    <View
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            flexDirection: "row",
                                                            height: 40,
                                                            borderRadius: 5,
                                                            borderWidth: 1,
                                                            borderColor: '#ccc'
                                                        }}
                                                    >
                                                        <ModalDropdown
                                                            ref={el => (this._dropdown_3 = el)}
                                                            defaultValue={depositDetail.BankAccounts[0].BankName}
                                                            // defaultIndex={0}
                                                            textStyle={stylespage.dropdown_D_text}
                                                            dropdownStyle={stylespage.dropdown_DX_dropdown}
                                                            options={depositDetail.BankAccounts}
                                                            renderButtonText={rowData =>
                                                                this.LB_dropdown_renderButtonText(rowData)
                                                            }
                                                            renderRow={this.LB_dropdown_1_renderRow.bind(this)}
                                                            onSelect={this.bankSelect}
                                                            style={{ zIndex: 10, width: width - 70 }}
                                                        />
                                                        <Image
                                                            resizeMode="stretch"
                                                            source={require("../../images/down.png")}
                                                            style={{
                                                                width: 16,
                                                                height: 16,
                                                                position: "absolute",
                                                                right: 10
                                                            }}
                                                        />
                                                    </View>
                                                }
                                            </View>
                                        </View>
                                        }
                                        <View>
                                            <Text style={{ paddingTop: 5, paddingBottom: 5 }}>存款人姓名</Text>
                                            <View
                                                style={stylespage.inputView}
                                            >
                                                {
                                                    !this.state.FirstNameChange && 
                                                    <TextInput
                                                        value={this.state.LBFirstName.replace(/./g,'*')}
                                                        style={{ color: "#000", height: 38, width: width - 60, paddingLeft: 10 }}
                                                        placeholder={''}
                                                        onFocus={() => { this.LBFirstName('') }}
                                                    />
                                                }
                                                {
                                                this.state.FirstNameChange && 
                                                <TextInput
                                                    value={this.state.LBFirstName}
                                                    style={{ color: "#000", height: 38, width: width - 60 }}
                                                    placeholder={''}
                                                    onChangeText={value => {
                                                        this.LBFirstName(value);
                                                    }}
                                                    textContentType="password"
									                secureTextEntry={!this.state.FirstNameChange}
                                                />
                                                }
                                            </View>
                                            <Text style={{ color: 'red', fontSize: 12 }}>{this.state.LBFirstNameTest != '' && this.state.LBFirstNameTest}</Text>
                                        </View>


                                    </View>
                                }
                                {
                                    activeCode == 'ALB' &&
                                    <View>
                                        <View>
                                            {this.MoneySlider()}
                                        </View>
                                        {
                                        !IsAutoAssign &&
                                        <View>
                                        <Text style={{ paddingBottom: 5, paddingTop: 15 }}>存款银行</Text>
                                        <View style={{ backgroundColor: "#fff", borderRadius: 5 }}>
                                            {
                                                depositDetail != '' && depositDetail.BankAccounts.length == 0 &&
                                                <Text onPress={() => { LiveChatOpenGlobe() }} style={{ fontSize: 14, lineHeight: 40, paddingLeft: 15 }} >请联系客服添加</Text>
                                            }
                                            {
                                                depositDetail != '' && depositDetail.BankAccounts.length > 0 &&
                                                <View
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        flexDirection: "row",
                                                        height: 40,
                                                        borderRadius: 5,
                                                        borderWidth: 1,
                                                        borderColor: '#ccc'
                                                    }}
                                                >
                                                    <ModalDropdown
                                                        ref={el => (this._dropdown_3 = el)}
                                                        defaultValue={depositDetail.BankAccounts[0].BankName}
                                                        // defaultIndex={0}
                                                        textStyle={stylespage.dropdown_D_text}
                                                        dropdownStyle={stylespage.dropdown_DX_dropdown}
                                                        options={depositDetail.BankAccounts}
                                                        renderButtonText={rowData =>
                                                            this.LB_dropdown_renderButtonText(rowData)
                                                        }
                                                        renderRow={this.LB_dropdown_1_renderRow.bind(this)}
                                                        onSelect={this.bankSelect}
                                                        style={{ zIndex: 10, width: width - 60 }}
                                                    />
                                                    <Image
                                                        resizeMode="stretch"
                                                        source={require("../../images/down.png")}
                                                        style={{
                                                            width: 16,
                                                            height: 16,
                                                            position: "absolute",
                                                            right: 10
                                                        }}
                                                    />
                                                </View>
                                            }
                                        </View>
                                        </View>}
                                    </View>
                                }
                                {
                                    activeCode == 'WCLB' &&
                                    <View>
                                        {
                                        !IsAutoAssign &&
                                        <View>
                                        <Text style={{ paddingBottom: 5, paddingTop: 15 }}>存款银行</Text>
                                        <View style={{ backgroundColor: "#fff", borderRadius: 5 }}>
                                            {
                                                depositDetail != '' && depositDetail.BankAccounts.length == 0 &&
                                                <Text onPress={() => { LiveChatOpenGlobe() }} style={{ fontSize: 14, lineHeight: 40, paddingLeft: 15 }} >请联系客服添加</Text>
                                            }
                                            {
                                                depositDetail != '' && depositDetail.BankAccounts.length > 1 ?
                                                <View
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        flexDirection: "row",
                                                        height: 40,
                                                        borderRadius: 5,
                                                        borderWidth: 1,
                                                        borderColor: '#ccc'
                                                    }}
                                                >
                                                    <ModalDropdown
                                                        ref={el => (this._dropdown_3 = el)}
                                                        defaultValue={depositDetail.BankAccounts[0].BankName}
                                                        // defaultIndex={0}
                                                        textStyle={stylespage.dropdown_D_text}
                                                        dropdownStyle={stylespage.dropdown_DX_dropdown}
                                                        options={depositDetail.BankAccounts}
                                                        renderButtonText={rowData =>
                                                            this.LB_dropdown_renderButtonText(rowData)
                                                        }
                                                        renderRow={this.LB_dropdown_1_renderRow.bind(this)}
                                                        onSelect={this.bankSelect}
                                                        style={{ zIndex: 10, width: width - 60 }}
                                                    />
                                                    <Image
                                                        resizeMode="stretch"
                                                        source={require("../../images/down.png")}
                                                        style={{
                                                            width: 16,
                                                            height: 16,
                                                            position: "absolute",
                                                            right: 10
                                                        }}
                                                    />
                                                </View>
                                                : depositDetail != '' && depositDetail.BankAccounts.length == 1 ?
                                                <View
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: 'flex-start',
                                                        alignItems: "center",
                                                        flexDirection: "row",
                                                        borderRadius: 5,
                                                        backgroundColor: '#EFEFF4'
                                                    }}
                                                >
                                                    <Text style={{lineHeight: 40, paddingLeft: 10}}>{depositDetail.BankAccounts[0].BankName}</Text>
                                                </View> : null
                                            }
                                        </View>
                                        </View>
                                        }
                                    </View>
                                }
                                {
                                    ((activeCode == 'QQ' || activeCode == 'OA' || activeCode == 'WC' || activeCode == 'PPB' || activeCode == 'JDP'|| activeCode == 'BC' || activeCode == 'BCM'|| activeCode == 'UP') && Number(charges) < 0) &&
                                     <View style={{ backgroundColor: '#FFF5BF', borderRadius: 5, padding: 10, marginTop: 10, }}>
                                        <Text style={{ fontSize: 12, color: '#83630B', lineHeight: 17 }}>温馨提示：使用{activeName}进行存款，第三方平台将征收手续费 {Math.abs(Number(charges) * 100).toFixed(2)}%。</Text>
                                    </View>
                                }
                                {
                                    (activeCode == 'QQ' || activeCode == 'OA' || activeCode == 'WC' || activeCode == 'PPB' || activeCode == 'JDP'|| activeCode == 'BC' || activeCode == 'BCM'|| activeCode == 'UP') && charges != 0 &&
                                    <View>
                                        <Text style={{ lineHeight: 30, paddingTop: 5 }}>实际到账</Text>
                                        <View>
                                            <View style={{ backgroundColor: '#EFEFF4', borderRadius: 5, paddingLeft: 10 }}>
                                                <Text style={{ color: "#666", lineHeight: 38, width: width - 60 }}>{chargesMoney}</Text>
                                            </View>
                                        </View>
                                    </View>
                                }


                                {activeCode == 'PPB' &&
                                    //存款銀行 PPB 
                                    <View>

                                        {
                                            depositDetail != '' && depositDetail.Banks.length > 0 &&
                                            <Text style={{ paddingTop: 15, paddingBottom: 5 }}>存款银行</Text>
                                        }
                                        <View style={{ backgroundColor: "#fff", borderRadius: 5 }}>

                                            {
                                                depositDetail != '' && depositDetail.Banks.length > 0 &&
                                                <View
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        flexDirection: "row",
                                                        height: 40,
                                                        borderRadius: 5,
                                                        borderWidth: 1,
                                                        borderColor: '#ccc'
                                                    }}
                                                >
                                                    <ModalDropdown
                                                        ref={el => (this._dropdown_3 = el)}
                                                        defaultValue={depositDetail.Banks[0].Name}
                                                        defaultIndex={0}
                                                        textStyle={stylespage.dropdown_D_text}
                                                        dropdownStyle={stylespage.dropdown_DX_dropdown}
                                                        options={depositDetail.Banks}
                                                        renderButtonText={rowData =>
                                                            this.BCbank_dropdown_renderButtonText(rowData)
                                                        }
                                                        renderRow={this.BCbank_dropdown_1_renderRow.bind(this)}
                                                        onSelect={this.bankSelect}
                                                        style={{ zIndex: 10, width: width - 60 }}
                                                    />
                                                    <Image
                                                        resizeMode="stretch"
                                                        source={require("../../images/down.png")}
                                                        style={{
                                                            width: 16,
                                                            height: 16,
                                                            position: "absolute",
                                                            right: 10
                                                        }}
                                                    />
                                                </View>
                                            }
                                        </View>
                                    </View>
                                }
                                {
                                    activeCode === 'CC' &&
                                    <View>
                                        {
                                            <View>
                                                <Text style={{ paddingTop: 15, paddingBottom: 5 }}>存款金额</Text>
                                                <View
                                                    style={stylespage.inputView}
                                                >
                                                    <TextInput
                                                        value={money}
                                                        style={{ color: "#000", height: 38, width: width - 60, fontSize: money == ''? 12: 14 }}
                                                        placeholder={`单笔存款范围:${MinBalShow}-${MaxBalShow},每日可存款${TransferNumber}次`}
                                                        placeholderTextFontSize={8}
                                                        maxLength={10}
                                                        keyboardType={'number-pad'}
                                                        onChangeText={value => {
                                                            this.moneyChange(value);
                                                        }}
                                                        onBlur={() => {
                                                            this.moneyBlur();
                                                        }}
                                                    />
                                                </View>
                                                {
                                                    moneyST != "" && 
                                                    <View style={{backgroundColor:'#fee0e0',borderRadius:5, marginTop:10,marginBottom:10}}>
                                                        <Text style={{ color: "red", fontSize: 11,paddingLeft:10,paddingBottom:10,paddingTop:10 }}>
                                                            {moneyST}
                                                        </Text>
                                                    </View>
                                                }
                                            </View>
                                        }
                                        <View>
                                            <Text style={{ paddingTop: 15, paddingBottom: 5 }}>乐卡序列号</Text>
                                            <View
                                                style={stylespage.inputView}
                                            >
                                                <TextInput
                                                    value={caredNum}
                                                    style={{ color: "#000", height: 38, width: width - 60 }}
                                                    placeholder={''}
                                                    maxLength={16}
                                                    onChangeText={value => {
                                                        this.CCcaredChange(value);
                                                    }}
                                                />
                                            </View>
                                            {
                                                caredNumST != '' && <Text style={{ color: 'red', fontSize: 12 }}>{caredNumST}</Text>
                                            }
                                        </View>
                                        <View>
                                            <Text style={{ paddingTop: 15, paddingBottom: 5 }}>乐卡密码</Text>
                                            <View
                                                style={stylespage.inputView}
                                            >
                                                <TextInput
                                                    value={PINNum}
                                                    style={{ color: "#000", height: 38, width: width - 60 }}
                                                    placeholder={''}
                                                    maxLength={10}
                                                    onChangeText={value => {
                                                        this.CCPINChange(value);
                                                    }}
                                                />
                                            </View>
                                            {
                                                PINNumST != '' && <Text style={{ color: 'red', fontSize: 12 }}>{PINNumST}</Text>
                                            }
                                        </View>
                                    </View>
                                }
                                {
                                    activeCode === 'AP' &&
                                    <View>
                                        <View>
                                            <Text style={{ paddingTop: 15, paddingBottom: 5 }}>AstroPay卡号</Text>
                                            <View
                                                style={stylespage.inputView}
                                            >
                                                <TextInput
                                                    value={caredNum}
                                                    style={{ color: "#000", height: 38, width: width - 60 }}
                                                    placeholder={''}
                                                    maxLength={16}
                                                    onChangeText={value => {
                                                        this.APcaredChange(value);
                                                    }}
                                                />
                                            </View>
                                            {
                                                caredNumST != '' && <Text style={{ color: 'red', fontSize: 12 }}>{caredNumST}</Text>
                                            }
                                        </View>
                                        <View>
                                            <Text style={{ paddingTop: 15, paddingBottom: 5 }}>安全码</Text>
                                            <View
                                                style={stylespage.inputView}
                                            >
                                                <TextInput
                                                    value={PINNum}
                                                    maxLength={4}
                                                    style={{ color: "#000", height: 38, width: width - 60 }}
                                                    placeholder={''}
                                                    onChangeText={value => {
                                                        this.CCPINChange(value);
                                                    }}
                                                />
                                            </View>
                                            {
                                                PINNumST != '' && <Text style={{ color: 'red', fontSize: 12 }}>{PINNumST}</Text>
                                            }
                                        </View>
                                        <View>
                                            <Text style={{ paddingTop: 15, paddingBottom: 5 }}>有效日期</Text>
                                            <View style={stylespage.inputView}>
                                                <View style={{ width: width - 60, }}>
                                                    <Text style={{ lineHeight: 38, textAlign: 'left', paddingLeft: 10, }}>{yearDate + '/' + monthDate}</Text>
                                                </View>
                                                <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 999, width: width }}>
                                                    <DatePicker
                                                        title=""
                                                        value={new Date()}
                                                        mode="month"
                                                        minDate={new Date(new Date())}
                                                        maxDate={new Date(new Date((new Date()).getTime() + 1000 * 60 * 60 * 24 * 366 * 10))}
                                                        onChange={this.monthDateChange}
                                                        format="YYYY-MM-DD"
                                                    >
                                                        <List.Item styles={StyleSheet.create(newStyle)}>
                                                            <Text style={{ fontSize: 14, color: '#fff' }}>月份</Text>
                                                        </List.Item>
                                                    </DatePicker>
                                                </View>
                                            </View>
                                        </View>
                                        {
                                            <View>
                                                <View>
                                                    <View style={{ backgroundColor: '#f3f3f3', borderRadius: 5, paddingLeft: 10, marginTop: 15, }}>
                                                        <Text style={{ color: "#000", lineHeight: 38, width: width - 60 }}>美金兑换汇率: {USDRate}</Text>
                                                    </View>
                                                </View>
                                                <View>
                                                    <Text style={{ paddingTop: 15, paddingBottom: 5 }}>卡片面值({APcaredUSD ? 'USD' : 'RMB'})</Text>
                                                    <View
                                                        style={stylespage.inputView}
                                                    >
                                                        <TextInput
                                                            value={money}
                                                            style={{ color: "#000", height: 38, width: width - 60, fontSize: money == ''? 12: 14 }}
                                                            placeholder={`单笔存款范围:${MinBalShow} ($${(MinBal / USDRate).toFixed(2)}) -${MaxBalShow} ($${(MaxBal / USDRate).toFixed(2)})`}
                                                            maxLength={10}
                                                            placeholderTextFontSize={8}
                                                            keyboardType={'number-pad'}
                                                            onChangeText={value => {
                                                                APcaredUSD ? this.APcaredUSDMoney(value) : this.moneyChange(value);
                                                            }}
                                                            onBlur={() => {
                                                                this.moneyBlur();
                                                            }}
                                                        />
                                                    </View>
                                                    {
                                                        moneyST != "" &&
                                                        <View style={{backgroundColor:'#fee0e0',borderRadius:5,    marginTop:10,marginBottom:10}}>
                                                        <Text style={{ color: "red", fontSize: 11,paddingLeft:10,paddingBottom:10,paddingTop:10 }}>
                                                            {moneyST}
                                                        </Text>
                                                    </View>
                                                    }
                                                </View>
                                                {
                                                    APcaredUSD &&
                                                    <View>
                                                        <Text style={{ paddingTop: 15, paddingBottom: 5 }}>实际存入(RMB)</Text>
                                                        <View style={{ backgroundColor: '#f3f3f3', borderRadius: 5, paddingLeft: 15 }}>
                                                            <Text style={{ color: "#000", lineHeight: 38, width: width - 60 }}>{USDRateMoney}</Text>
                                                        </View>
                                                    </View>
                                                }
                                                {/* <View style={{ marginTop: 10, backgroundColor: '#EBEBED', borderRadius: 15, padding: 15, }}>
                                                <Text style={{ color: "#666666", width: width - 60 }}>{`最低：${MinBalShow} 人民币（${(MinBal / USDRate).toFixed(2)} 美元），最高金额 : ${MaxBalShow} 人民币（${(MaxBal / USDRate).toFixed(2)} 美元）。`}</Text>
                                            </View> */}
                                            </View>
                                        }
                                    </View>
                                }
                                {
                                    (activeCode == 'BC' || activeCode == 'BCM') &&
                                    <View>
                                        {
                                            depositDetail != '' && depositDetail.Banks.length > 0 ?
                                                <View>
                                                    <Text style={{ paddingTop: 15, paddingBottom: 5 }}>存款银行</Text>
                                                    <View style={{ backgroundColor: "#fff", borderRadius: 5 }}>
                                                        {
                                                            depositDetail != '' && depositDetail.Banks.length == 0 &&
                                                            <Text onPress={() => { LiveChatOpenGlobe() }} style={{ fontSize: 14, lineHeight: 40, paddingLeft: 15 }} >请联系客服添加</Text>
                                                        }
                                                        {
                                                            depositDetail != '' && depositDetail.Banks.length > 0 &&
                                                            <View
                                                                style={{
                                                                    display: "flex",
                                                                    justifyContent: "space-between",
                                                                    alignItems: "center",
                                                                    flexDirection: "row",
                                                                    height: 40,
                                                                    borderRadius: 5,
                                                                    borderWidth: 1,
                                                                    borderColor: '#ccc'
                                                                }}
                                                            >
                                                                <ModalDropdown
                                                                    ref={el => (this._dropdown_3 = el)}
                                                                    defaultValue={depositDetail.Banks[0].Name}
                                                                    defaultIndex={0}
                                                                    textStyle={stylespage.dropdown_D_text}
                                                                    dropdownStyle={stylespage.dropdown_DX_dropdown}
                                                                    options={depositDetail.Banks}
                                                                    renderButtonText={rowData =>
                                                                        this.BCbank_dropdown_renderButtonText(rowData)
                                                                    }
                                                                    renderRow={this.BCbank_dropdown_1_renderRow.bind(this)}
                                                                    onSelect={this.bankSelect}
                                                                    style={{ zIndex: 10, width: width - 60 }}
                                                                />
                                                                <Image
                                                                    resizeMode="stretch"
                                                                    source={require("../../images/down.png")}
                                                                    style={{
                                                                        width: 16,
                                                                        height: 16,
                                                                        position: "absolute",
                                                                        right: 10
                                                                    }}
                                                                />
                                                            </View>
                                                        }
                                                    </View>
                                                </View>
                                                : activeCode == 'BC' ?
                                                    <View>
                                                        <Text style={{ paddingTop: 15, paddingBottom: 5 }}>存款银行</Text>
                                                        <View style={{ backgroundColor: "#fff", borderRadius: 5 }}>
                                                            {
                                                                depositDetail != '' && depositDetail.Banks.length == 0 &&
                                                                <Text onPress={() => { LiveChatOpenGlobe() }} style={{ fontSize: 14, lineHeight: 40, paddingLeft: 15 }} >请联系客服添加</Text>
                                                            }
                                                        </View>
                                                    </View>
                                                    : null
                                        }


                                    </View>
                                }
                                {
                                    activeCode == 'SR' &&
                                    <View>
                                            {
                                                (Array.isArray(SuggestedAmounts) && SuggestedAmounts.length > 0 && SuggestedAmounts[0].Amount)
                                                    ? <View>
                                                        <View style={{ backgroundColor: '#fff5bf', borderRadius: 5, padding: 10 }}>
                                            <Text style={{ fontSize: 12, color: '#83630b', lineHeight: 17 }}>请确保“存款人姓名”和“存入金额”与您本人账户姓名和转入的金额保持一致以便及时到账！</Text>
                                        </View>
                                        <Text style={{paddingTop: 15, color: '#666666', fontSize: 12}}>存款金额</Text>
                                        <View style={stylespage.SRAmounts}>
                                            {
                                                SuggestedAmounts.map((item, index) => {
                                                    return(
                                                        <Touch
                                                            key={index} 
                                                            style={[
                                                            stylespage.SRAmountsItem,
                                                            { backgroundColor: !item.IsActive? '#EFEFF4': SRAmountsActive == index? '#00A6FF': '#fff' }
                                                            ]}
                                                            onPress={() => { this.SRAmountSelect(item, index) }}
                                                        >
                                                            <Text style={{ fontSize: 16, color: !item.IsActive? '#BCBEC3': SRAmountsActive == index? '#fff': '#000' }}>¥ {item.Amount}</Text>
                                                        </Touch>
                                                    )
                                                })
                                            }
                                        </View>
                                                    </View>
                                                    :
                                                    <Text style={{ color: '#EB2121', fontSize: 12, paddingTop: 15 }}>目前没有适合的金额，请尝试使用不同的存款提交方法</Text>

                                            }

                                       
                                        
                                        {
                                            SRdisabledErr && <Text style={{color: '#EB2121', fontSize: 12, paddingTop: 15}}>目前没有适合的金额，请尝试使用不同的存款提交方法</Text>
                                        }
                                    </View>
                                }
                                {
                                    // activeCode == 'ALB' &&
                                    // <View>
                                    //     {/* 转账方式选择 */}
                                    //     <Text style={{ paddingTop: 15, paddingBottom: 5 }}>存款银行</Text>
                                    //     <View style={{ backgroundColor: "#fff", borderRadius: 5 }}>
                                    //         <View
                                    //             style={{
                                    //                 display: "flex",
                                    //                 justifyContent: "space-between",
                                    //                 alignItems: "center",
                                    //                 flexDirection: "row",
                                    //                 height: 40,
                                    //                 borderRadius: 5,
                                    //                 borderWidth: 1,
                                    //                 borderColor: '#ccc'
                                    //             }}
                                    //         >
                                    //             <ModalDropdown
                                    //                 ref={el => (this._dropdown_3 = el)}
                                    //                 defaultValue={ALBType[0].name}
                                    //                 defaultIndex={0}
                                    //                 textStyle={stylespage.dropdown_D_text}
                                    //                 dropdownStyle={stylespage.dropdown_DX_dropdown}
                                    //                 options={ALBType}
                                    //                 renderButtonText={rowData =>
                                    //                     this.ALB_dropdown_renderButtonText(rowData)
                                    //                 }
                                    //                 renderRow={this.ALB_dropdown_1_renderRow.bind(this)}
                                    //                 onSelect={this.ALB_balanceSelect}
                                    //                 style={{ zIndex: 10, width: width - 60 }}
                                    //             />
                                    //             <Image
                                    //                 resizeMode="stretch"
                                    //                 source={require("../../images/down.png")}
                                    //                 style={{
                                    //                     width: 16,
                                    //                     height: 16,
                                    //                     position: "absolute",
                                    //                     right: 10
                                    //                 }}
                                    //             />
                                    //         </View>
                                    //     </View>
                                    // </View>
                                }
                                {
                                // 优惠申请，
                                this.props.froms == 'promotions' && 
                                BonusData != '' &&
                                <View style={{ paddingTop:10 }}>
                                    <Text style={{ paddingBottom: 10 }}>优惠申请</Text>
                                
                                        <Flex style={{ backgroundColor: "#fff" }}>
                                        <Flex.Item
                                            style={{
                                                flex: 1,
                                                paddingTop: 5,
                                                backgroundColor:'#EFEFF4',
                                                borderRadius:6 
                                            }}
                                        >
                                            <ModalDropdown
                                                disabled={this.props.froms == 'promotions'}
                                                ref={el => (this._dropdown_3 = el)}
                                                defaultValue={BonusData[BonusIndex].title}
                                                defaultIndex={BonusIndex}
                                                textStyle={stylespage.dropdown_D_text}
                                                dropdownStyle={stylespage.dropdown_DX_dropdown}
                                                options={BonusData}
                                                renderButtonText={rowData =>
                                                    this._dropdown_1_renderButtonText(rowData)
                                                }
                                                renderRow={this._dropdown_3_renderRow.bind(this)}
                                                onSelect={this.BonusButton}
                                            />
                                            {/* <View style={{position: 'absolute', right: 10, top: 8}}>
                                                <Image resizeMode='stretch' source={require('../../images/down.png')} style={{ width: 20, height: 20 }} />
                                            </View> */}
                                        </Flex.Item>
                                    </Flex>
                                    {
                                        BonusMSG != '' &&
                                        <Text style={{color: 'red', fontSize: 11,width: width - 50,lineHeight: 16, paddingTop: 10}}>{BonusMSG}</Text>
                                    }
                                
                                </View>
                                }
                                <Touch onPress={() => { this.okPayClick() }} style={{ backgroundColor: okPayBtn ? '#00a6ff' : '#bcbec3', borderRadius: 10, width: width - 50, marginTop: 30 }}>
                                    <Text style={{ lineHeight: 40, textAlign: 'center', color: '#fff' }}>{activeCode == 'CTC' ? '下一步' : '提交'}</Text>
                                </Touch>
                            </View>

                            {
                                activeCode == 'ALB' && isQrcodeALB &&
                                <View>
                                    <View style={stylespage.ALBmoneyView}>
                                        <Text style={{color: '#999999', fontSize: 12,}}>存款金额</Text>
                                        <Text style={{color: '#000',fontWeight: 'bold'}}>¥{money}</Text>
                                    </View>
                                    <View style={stylespage.isQrcodeALB}>
                                        <View style={stylespage.arrowTop} />
                                        <Text style={{color: '#999999',fontSize: 12,width: width - 50}}>转账时请必须转入系统生成的金额, 请选择以下方式继续支付.</Text>
                                        <View style={stylespage.isQrcodeBtn}>
                                            <Touch onPress={() => {this.ALB_balanceSelect(1)}}  style={stylespage.isQrcodeBtnL}>
                                                <Text style={{color: '#00A6FF', textAlign: 'center', lineHeight: 38,}}>显示银行账户</Text>
                                            </Touch>
                                            <Touch onPress={() => {this.ALB_balanceSelect(0)}} style={stylespage.isQrcodeBtnR}>
                                                <Text style={{color: '#fff', textAlign: 'center', lineHeight: 40,}}>显示二维码</Text>
                                            </Touch>
                                        </View>
                                    </View>
                                    
                                </View>
                            }

                            {
                                activeCode == 'CTC' &&
                                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 25 }}>
                                    <Touch style={{ backgroundColor: '#fff', borderRadius: 50, width: 90 }} onPress={() => { Actions.CTCpage({ actionType: 'Deposit' }); PiwikEvent('Deposit_Nav', 'Confirm', 'Deposit_Tutorial') }}>
                                        <Text style={{ color: '#666', textAlign: 'center', lineHeight: 40 }}>存款教程</Text>
                                    </Touch>
                                </View>
                            }
                            <View style={{ width: width - 40 }}>
                                {
                                    // 本地银行
                                    activeCode == 'LB' &&
                                    <LBPrompt />
                                }
                                {
                                    //支付宝转账
                                    activeCode == 'ALB' &&
                                    <ALBPrompt />
                                }
                                {
                                    //京东钱包
                                    activeCode == 'JDP' &&
                                    <JDPPrompt />
                                }
                                {
                                    //银联支付
                                    activeCode == 'UP' &&
                                    <UPPrompt />
                                }
                                {
                                    //在线支付
                                    (activeCode == 'BC' || activeCode == 'BCM') &&
                                    <BCPrompt />
                                }
                                {
                                    //在线支付宝
                                    activeCode == 'OA' &&
                                    <OAPrompt key={charges} depositCharges={charges} />
                                }
                                {
                                    //微转账
                                    activeCode == 'WCLB' &&
                                    <WCLBPrompt />
                                }
                                {
                                    //微支付
                                    activeCode == 'WC' &&
                                    <WCPrompt key={charges} depositCharges={charges} item={this.state.paymentchannelEND} />
                                }
                                {
                                    //AstroPay
                                    activeCode == 'AP' &&
                                    <APPrompt />
                                }
                                {
                                    //同乐卡
                                    activeCode == 'CC' &&
                                    <CCPrompt />
                                }
                                {
                                    //QQ
                                    activeCode == 'QQ' &&
                                    <QQrompt />
                                }
                                {
                                    //虚拟币
                                    activeCode == 'CTC' &&
                                    <CTCPrompt
                                        key={this.state.CTCPromptActive}
                                        CTCBack={() => { this.setState({ CTCPromptActive: this.state.CTCPromptActive + 1 }) }}
                                        CTCPromptActive={this.state.CTCPromptActive}
                                    />
                                }
                                {
                                    //網銀支付
                                    activeCode == 'PPB' &&
                                    <PPBPrompt />
                                }
                                {
                                    //小额存款
                                    activeCode == 'SR' &&
                                    <SRPrompt />
                                }
                            </View>

                        </View>
                        <View style={{ height: 150, width: width }} />
                    </KeyboardAwareScrollView>
                </View>

                {/*客服懸浮球*/}
                {/* <LivechatDragHoliday /> */}
            </View>
        )
    }
}


const stylespage = StyleSheet.create({
    moreOtpModal: {
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: width - 30,
        borderRadius: 10,
        paddingTop: 25,
        paddingBottom: 25,
    },
    moreOtpBtn: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 20,
        width: width - 60,
    },
    moreOtpLeftBtn: {
        borderColor: '#00a6ff',
        borderRadius: 5,
        width: (width - 80)* 0.5,
        borderWidth: 1,
    },
    moreOtpItem: { 
        color: '#00a6ff', 
        lineHeight: 40, 
        textAlign: 'center',
        fontSize: 16,
    },
    moreOtpRightBtn: {
        backgroundColor: '#00a6ff', 
        borderRadius: 5, 
        width: (width - 80)* 0.5,
    },
    moreDepositWithdrawal: {
        borderRadius: 8,
        backgroundColor: '#35C95B',
        width: width - 45,
        marginTop: 10,
        marginLeft: 3,
    },
    moreDepositWithdrawalItem: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 42,
    },
    modalClose: {
        position: 'absolute',
        top: 25,
        right: 25,
        zIndex: 99,
    },
    SRAmounts: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    SRAmountsItem: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E3E3E8',
        width: (width - 84) / 4,
        marginTop: 8,
        marginLeft: 4,
        marginRight: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 42,
    },
    ppbModalBtn: {
        padding: 10,
        backgroundColor: '#00a6ff',
        borderRadius: 8,
        width: width - 80,
    },
    ppbModalTitle: {
        backgroundColor: '#00A6FF', 
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15, 
        width: width - 50
    },
    otpMsgBtn: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 20,
        width: width - 90,
    },
    otpLeftBtn: {
        borderColor: '#00a6ff',
        borderRadius: 5,
        width: (width - 110)* 0.5,
        borderWidth: 1,
    },
    otpRightBtn: {
        backgroundColor: '#00a6ff', 
        borderRadius: 5, 
        width: (width - 110)* 0.5,
    },
    //支付渠道樣式
    channel: { 
        width: (width - 80) / 2, 
        paddingLeft: 5,
        height: 32,
        borderColor: '#E3E3E8', 
        borderRadius: 8, 
        borderWidth: 1, 
        marginBottom: 10, 
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    paymenRadiusA: {
        borderColor: '#666', borderWidth: 2, borderRadius: 12, width: 15, height: 15,
        justifyContent: 'center',
        alignItems: 'center',
        // top: 10,
        // left: 10
    },
    paymenRadiusAHover: {
        borderColor: '#00a6ff', borderWidth: 2, borderRadius: 12, width: 15, height: 15,
        justifyContent: 'center',
        alignItems: 'center',
        // top: 10,
        // left: 10
    },

    paymenRadiusB: {
        backgroundColor: '#fff', borderRadius: 12, width: 11, height: 11,
    },
    paymenRadiusBHover: {
        // backgroundColor: '#00a6ff', borderRadius: 12, width: 15, height: 15,
    },

    OAMoneyButton: {
        backgroundColor: '#fff', borderRadius: 12,
        width: width * 0.2
    },

    OAMoneyButtonHover: {
        backgroundColor: '#F92D2D', borderRadius: 12,
        width: width * 0.2
    },
    //支付渠道樣式

    depositList: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingBottom: 10,
        padding: 5,
    },
    depositCode1: {
        paddingTop: 5,
        paddingBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: (width - 70) / 5,
        height: (width - 70) / 5,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 10,
        backgroundColor: '#00a6ff',
        borderRadius: 5,
    },
    depositCode2: {
        paddingTop: 5,
        paddingBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: (width - 70) / 5,
        height: (width - 70) / 5,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#e3e3e8'
    },
    depositCode3: {
        paddingTop: 5,
        paddingBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: (width - 70) / 5,
        height: (width - 70) / 5,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#e4e4e4'
    },
    SliderList: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row"
    },
    scaleKey: {
        width: 1,
        height: 8,
        backgroundColor: "#999999"
    },
    moneyas: {
        backgroundColor: '#ebebed',
        borderRadius: 10,
        height: 40,
        marginTop: 10,
        paddingLeft: 5,
        justifyContent: 'center'
    },
    dropdown_D_text: {
        paddingBottom: 3,
        fontSize: 14,
        color: "#000",
        textAlignVertical: "center",
        lineHeight: 30,
        paddingLeft: 15
    },
    dropdown_DX_dropdown: {
        borderRadius: 1,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        shadowColor: "#666",
        //注意：这一句是可以让安卓拥有灰色阴影
        elevation: 4
    },
    inputView: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        height: 38,
        display: "flex",
        alignItems: "center",
    },
    BonusData: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 5,
        padding: 10,
    },
    bonusList: {
        width: 20,
        height: 20,
        borderRadius: 40,
        borderWidth: 2,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',

    },
    CTCData: {
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
        padding: 6,
        paddingBottom: 12,
        paddingTop: 12,
        borderWidth: 1,
        borderColor: '#E3E3E8',
        width: (width - 65) * 0.5
    },
    CTCList1: {
        width: 16,
        height: 16,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#00a6ff',
        margin: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    CTCList2: {
        width: 16,
        height: 16,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#bcbec3',
        margin: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    BonusPop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'row'
    },
    dateSelect: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 40,
        width: width / 2.4,
    },
    checkWallet: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        height: 40
    },
    secussModal: {
        // width: width / 1.2,
        // height: height / 3,
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBtnclose: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 120,
        height: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#00a6ff',
        margin: 10,
    },
    modalBtnok: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 120,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#00a6ff',
        margin: 10,
    },
    nomodalBtnok: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 120,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#efeff4',
        margin: 10,
    },
    selectText2: {
        color: "#666666",
        fontSize: 14,
        marginVertical: 10
    },
    bonusItemBtn: {
        paddingVertical: 13,
        paddingLeft: 20,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 10,

        borderColor: "#F3F3F3",
        backgroundColor: "#FFFFFF",
        marginVertical: 3
    },
    bonusItemTitle: {
        color: "#222222",
        fontSize: 14,
        paddingLeft: 20,
        width: width * 0.8
    },
    checkBoxAcitve: {
        alignItems: "center",
        justifyContent: "center",
        width: 16,
        height: 16,
        backgroundColor: "#fff",
        color: "#F92D2D",
        borderWidth: 2,
        borderRadius: 20,
        borderColor: "#F92D2D"
    },
    CTCtypes: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: width - 50,
    },
    CTCtypeList1: {
        paddingTop: 10,
        width: (width - 65) * 0.5,
        height: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00a6ff',
        borderRadius: 10,
        marginBottom: 15,
    },
    CTCtypeList2: {
        paddingTop: 10,
        width: (width - 65) * 0.5,
        height: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e6e6eb',
    },
    noPage: {
        backgroundColor: '#eb2121',
        borderBottomLeftRadius: 5,
        borderTopRightRadius: 8,
        padding: 3,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    checkBoxInnerAcitve: {
        width: 8,
        height: 8,
        backgroundColor: "#F92D2D",
        color: "#F92D2D",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center"
    },
    ppbModal: {
        backgroundColor: '#fff',
        borderRadius: 15,
    },
    ppbOrder: {
        color: '#000000',
        paddingBottom: 10,
        fontSize: 14,
        lineHeight: 20,
    },
    ppbSubmit: {
        textAlign: 'center',
        color: '#2190FF',
        fontSize: 18,
        paddingTop: 20,
    },
    ppbModalMsg: {
        backgroundColor: '#FFF5BF',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },
    news: {
        backgroundColor: '#eb2121',
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 6,
        padding:3,
        paddingTop: 4,
        paddingBottom: 4,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 9,
    },
    newsTxt: {
        fontSize: 10,
         color: '#fff',
         fontWeight: 'bold',
    },
    arrowTop: {
        position: 'absolute',
        top: -20,
        width: 0,
        height: 0,
        zIndex: 9,
        borderWidth: 10,
        borderTopColor: "transparent",
        borderLeftColor: "transparent",
        borderBottomColor: "#fff",
        borderRightColor: "transparent",
    },
    isQrcodeALB: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        width: width - 30,
        padding: 10,
        paddingBottom: 15,
        paddingTop: 15,
    },
    isQrcodeBtn: {
        display: 'flex',
        width: width - 50,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    isQrcodeBtnL: {
        width: (width - 65) * 0.5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#00A6FF',
    },
    isQrcodeBtnR: {
        width: (width - 65) * 0.5,
        borderRadius: 5,
        backgroundColor: '#00A6FF',
    },
    ALBmoneyView: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        width: width - 30,
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 15,
    },
})


export default (DepositCenter);

