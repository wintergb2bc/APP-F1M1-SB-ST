import React from 'react';
import { StyleSheet, Text, TextStyle, Image, View, ViewStyle, ScrollView, TouchableOpacity,Modal,TouchableHighlight, Dimensions, WebView, Platform, FlatList, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Accordion from 'react-native-collapsible/Accordion';
import { Toast, Carousel, Flex, Picker, List, Tabs, DatePicker } from 'antd-mobile-rn';
import { connect } from "react-redux"; import moment from 'moment'
import { IdentityCardReg, nameTest, maskPhone4, phoneReg, bankTest, bankNameTest } from '../../actions/Reg'
import Touch from 'react-native-touch-once';
import Modals from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import VerificationCodeInput from '../VerificationCodeInput'
const {
    width, height
} = Dimensions.get('window')


class BankCardVerify extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            nameVerify: false,
            IdentityCard: '',
            isIdentityCard: true,
            Names: '',
            isName: true,
            isSuccess: false,
            success: false,
            fromType: 'nameId',
            hasName: false,
            hasIdentityCard: false,
            phoneType: this.props.phoneType? this.props.phoneType:1,//1，不显示验证码输入框，2显示验证码输入框，3错误次数5次
            phoneNum: '',
            verifyTimes: 5,
            codeAgainPhone: false,
            CountdownPhone_minutes: '5:00',
            CountdownPhone: 300,
            verifyErr: false,
            issubmitBtn: false,
            errModal: false,
            isPhone: true,
            isSuccessOtp: false,
            bankList: '',
            otherBankName: '',
            isOtherBankName: true,
            activeBank: '',
            phoneChange: false,
            isShowCtcModal: false,
            nameBankOtpModal: false,
            bankCard: '',
            isbankCard: false,
            errCode: 0,
            nameBankSkip: false,
            getCodePhone: true,
            isPhoneEditable: false,
            codeInputFocus: false,
            nameBankErr: false,
            isSubmitNameModal: false,
            phoneStauts: false,
            serviceAction: 'BankCardVerification',//DepositVerification  手机otp, BankCardVerification 个人信息otp使用modal
        }
    }
    componentDidMount() {
        this.getMember()
        if(this.props.isIWMM) {
            //验证姓名银行卡信息,获取银行卡信息
            this.getWithdrawalLbBankAction()
        }
        if(this.props.isDepositVerificationOTP) {
            this.setState({
                fromType: 'phone',
                serviceAction: 'DepositVerification'
            },() => { 
                this.getVerifyTimes()
                this.getDownTime()
             })
        } else {
            //姓名银行卡提交，没有验证过手机，手机验证次数0时候直接进入err，不显示提交表格
            !BankCardPhoneVerify && this.getVerifyTimes()
            global.storage.remove({
                key: "VerifyPhone" + userNameDB,
                id: "VerifyPhone" + userNameDB
            });
        }
    }
    componentWillUnmount() {
        //返回确认是否已验证，
        this.props.checkCustomFlag && this.props.checkCustomFlag()
        if(!this.state.getCodePhone) {
            //记录倒计时时间，下次进入继续计时
            let phoneTime = (new Date()).getTime() / 1000 + this.state.CountdownPhone
            global.storage.save({
                key: 'VerifyPhone' + userNameDB,
                id: 'VerifyPhone' + userNameDB,
                data: phoneTime,
                expires: null
            });
        }
    }


    getDownTime() {
        global.storage.load({
            key: 'VerifyPhone' + userNameDB,
            id: 'VerifyPhone' + userNameDB
        }).then(ret => {
            let news = (new Date()).getTime() / 1000

            if (ret - news > 0) {
                this.CountdownPhone(parseInt(ret - news))
            }
        })
    }
    
    getMemberInfo() {
        Toast.hide();
        global.storage
        .load({
            key: 'memberInfo',
            id: 'memberInfos',
        })
        .then(val => {
            this.setMemberInfo(val)
        })
        .catch(err => {})
    }
    setMemberInfo(val) {
        let phoneData = val.Contacts.find(v => v.ContactType.toLocaleLowerCase() === 'phone')
        let phoneNum = phoneData.Contact.slice(-11)
        let hasName = val.FirstName != '';
        let Names = val.FirstName || ''
        let hasIdentityCard = val.IdentityCard? true: false
        let IdentityCard = val.IdentityCard || ''
        this.setState({ Names, IdentityCard, hasName, hasIdentityCard, phoneNum })



        let Contacts = val.Contacts || []
        let phoneTemp = Contacts.find(v => v.ContactType === 'Phone')
        let phoneStauts = phoneTemp ? phoneTemp.Status != 'Unverified' : false
        this.setState({
            phoneStauts
        })


    }

    Names(val) {
        let Names = val
        let isName = false
        if (nameTest.test(Names)) {
            isName = true
        }

        this.setState({
            Names,
            isName,
        }, () => { this.verify() })
    }

    IdentityCard(val) {
        let IdentityCard = val
        let isIdentityCard = false
        if (IdentityCardReg.test(IdentityCard)) {
            isIdentityCard = true
        }

        this.setState({
            IdentityCard,
            isIdentityCard,
        }, () => { this.verify() })
    }
    otherBankName(val) {
        let isOtherBankName = false
        if (bankNameTest.test(val)) {
            isOtherBankName = true
        }
        this.setState({otherBankName: val, isOtherBankName}, () => { this.verify() })
    }
    bankCard(val) {
        let isbankCard = false
        if(bankTest.test(val)) {
            isbankCard = true
        }
        this.setState({
            bankCard: val,
            isbankCard
        }, () => { this.verify() })
    }
    verify() {
        const st = this.state
        let nameVerify = false
        let isBankName = st.activeBank == '其他银行'? (st.otherBankName && st.isOtherBankName) : st.activeBank
        // if (st.Names && st.isName && st.IdentityCard && st.isIdentityCard && st.bankCard && isBankName) {
        if (st.Names && st.isName && st.bankCard && st.isbankCard && isBankName) {
            nameVerify = true
        }
        this.setState({ nameVerify })
    }

    getWithdrawalLbBankAction() {
        global.storage.load({
            key: 'WithdrawalsLbBanks',
            id: 'WithdrawalsLbBanks'
        }).then(data => {
            this.setState({
                bankList: data
            })
        }).catch(() => {
        })

        fetchRequest(window.ApiPort.PaymentDetails + '?transactionType=Withdrawal&method=LB&isMobile=true&', 'GET')
            .then(res => {
                let list = res.Banks || false
                if(list && list.length > 0) {
                    list.push({ Name: '其他银行'})
                    this.setState({ bankList: list })
                    global.storage.save({
                        key: 'WithdrawalsLbBanks',
                        id: 'WithdrawalsLbBanks',
                        data: list,
                        expires: null
                    })
                }
            }).catch((err) => {
                Toast.hide()
            })
    }
    //获取用户信息
    getMember() {
        this.getMemberInfo()
        fetchRequest(ApiPort.Member, 'GET')
            .then(data => {
                let memberInfo = data.result.memberInfo
                if (memberInfo) {
                    this.setMemberInfo(memberInfo)
                    global.storage.save({
                        key: 'memberInfo',
                        id: "memberInfos",
                        data: memberInfo,
                        expires: null
                    });
                }
            })
            .catch(() => { })
    }

    nameIdBankBtn() {
        //提交姓名银行卡信息
        if (!this.state.nameVerify) { return }
        PiwikEvent('Verification', 'Submit', 'ID_Bank_PII_DepositPage')
        if(!BankCardPhoneVerify) {
            //step2没有验证手机去获取验证码，已经验证跳过
            this.getPhoneCode(true)
            return
        }
        this.setState({nameBankOtpModal: false})
        let MemberData = {
            realName: this.state.Names,
            // identityCard: this.state.IdentityCard,
            bankName: this.state.activeBank == '其他银行' ? this.state.otherBankName: this.state.activeBank,
            accountNumber: this.state.bankCard
        }
        Toast.loading("提交中,请稍候...", 200);
        fetchRequest(ApiPort.BankCardVerification, 'POST', MemberData).then(data => {
            Toast.hide();
            if(data.isSuccess) {
                if(this.props.isWithdrawal) {
                    Actions.pop()
                    Actions.withdrawal()
                    return
                }
                Actions.pop()
                Actions.DepositCenter({ from: 'GamePage' })
            } else {
                if(data.errors && data.errors[0] && data.errors[0].errorCode == 'PII00702') {
                    Actions.RestrictPage({from: 'accountProblem', RetryAfter: ''})
                } else {
                    this.setState({nameBankErr: true})
                }
            }
        }).catch(error => {
            Toast.hide();
            Toasts.fail('网络错误，请稍后重试', 2);
        });
    }



    getVerifyTimes() {
		//获取剩余次数
		Toast.loading("加载中...", 100);
		fetchRequest(ApiPort.VerificationAttempt + `?serviceAction=${this.state.serviceAction}&channelType=SMS&`, "GET")
			.then(res => {
				Toast.hide();
				this.setState({ verifyTimes: res && res.remainingAttempt })
				if(res.remainingAttempt == 0) {
					this.setState({phoneType: 3})
				} else {
                    this.getExpiredAt()
                    this.CustomFlags()
                }
			})
			.catch(() => {})
	}

    getExpiredAt() {
        //验证码是否过期
		fetchRequest(ApiPort.ResendAttempt + `?serviceAction=${this.state.serviceAction}&channelType=SMS&`, "GET")
			.then(res => {
				Toast.hide();
                let phoneType = 1
				if(res.resendAttempt == 0) {
                    //没有次数
					phoneType = 3
				} else {
                    phoneType = res.isExpired? 1: 2
                }
                this.setState({ phoneType })
			})
			.catch(() => {})
	}

    CustomFlags() {
        //是否可以修改手机
        fetchRequest(ApiPort.CustomFlag + 'flagKey=isPhoneEditable&', 'GET')
        .then(res => {
            if(res.result) {
                this.setState({ isPhoneEditable: res.result.isPhoneEditable })
            }
        })
        .catch(() => {})
    }

    phones(val) {
        let phoneNum = val
        let isPhone = false
        if (phoneReg.test(phoneNum)) {
            isPhone = true
        }

        this.setState({
            phoneNum,
            isPhone,
            phoneType: 1,
        })
    }


    getPhoneCode(nameBankOtp) {
        if(this.state.fromType == 'phone') {
            if(this.state.phoneType == 1) {
                PiwikEvent('Verification', 'Request', 'SendCode_Phone_DepositPage')
            } else {
                PiwikEvent('Verification', 'Request', 'ResendCode_Phone_DepositPage')
            }
        }
        if(!this.state.getCodePhone) { return }
		const data = {
            "msIsdn": '86-' + this.state.phoneNum,
            "isRegistration": false,
            "serviceAction": this.state.serviceAction,
            "memberCode": userNameDB,
            "currencyCode": "CNY",
            "siteId": Platform.OS === "android" ? 17 : 18,
		};
		Toast.loading("发送中...", 100);
		fetchRequest(ApiPort.PhoneVerify, "POST", data)
			.then(res => {
				Toast.hide();
                this.state.isPhoneEditable && this.CustomFlags()

                nameBankOtp && this.getNameBankOtp(res)
                !nameBankOtp && this.getPhoneOtp(res)

				this.CountdownPhone(300)
				this.clearCode();
			})
			.catch(err => {
				Toasts.fail("短信服务异常，请稍后再试", 2);
			});
    }
    getNameBankOtp(res) {
        let nameBankOtpModal = true
        if (!res.isSuccess) {
            // 发送异常
            let resendCounter = res.result.resendCounter
            if (resendCounter == 0) {
                //没有发送次数，
                nameBankOtpModal = false
                this.setState({ phoneType: 3})
            } else {
                if(!res.result.message.includes('已发送')) {
                    //没有“已发送”表示异常
                    nameBankOtpModal = false
                    Toasts.fail('网络错误，请稍后重试', 2);
                }
            }
        }
        this.setState({nameBankOtpModal})
    }
    getPhoneOtp(res) {
        if (!res.isSuccess) {
            // 发送异常
            let resendCounter = res.result.resendCounter
            if (resendCounter == 0) {
                this.setState({ phoneType: 3 })
                return
            } else {
                if(res.result.message.includes('已发送')) {
                    this.setState({errModal: true})
                } else {
                    Toasts.fail(res.result.message, 2);
                }
            }
        } else {
            Toasts.success("发送成功", 2);
        }
        this.setState({phoneType: 2})
    }


    //手机验证码倒计时处理
	CountdownPhone(item) {

		this.setState({ codeAgainPhone: true, getCodePhone: false })
		let time = item;
		let m, s, ms;
		this.CountdownPhones = setInterval(() => {
			time -= 1;
			m = "0" + parseInt(time / 60).toString();
			s = time - m * 60;
			if (s < 10) {
				s = "0" + s.toString();
			}
			ms = m + ":" + s;
			this.setState({ CountdownPhone: time, CountdownPhone_minutes: ms });
			if (m == 0 && s == 0) {
				this.setState({ getCodePhone: true })
				clearInterval(this.CountdownPhones);
			}
		}, 1000);
	}

    checked(code) {
		if (code.length == 6) {
			this.setState({ issubmitBtn: true, verificationCode: code, verifyErr: false });
		} else {
			this.setState({ issubmitBtn: false });
		}
	}

    // 清空验证码
	clearCode() {
		let errCode = this.state.errCode
		errCode += 1
		this.setState({
			issubmitBtn: false,
			verificationCode: "",
			errCode,
		});
	}


    submitName() {
        const { Names, } = this.state

        const params = {
            key: 'FirstName',
            value1: Names.trim(),
            value2: ''
        }

        Toast.loading('提交中,请稍候...', 2000)
        fetchRequest(ApiPort.Member, 'PATCH', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
               Toasts.success('提交成功', 2);
               this.getUserStatus()
            } else {
                this.setState({
                    isSubmitNameModal: true
                })
                // Toasts.fail('提交失败', 2)
            }
        }).catch(() => {
            Toast.hide()
        })
    }

    getUserStatus() {
        fetchRequest(ApiPort.Member, 'GET')
            .then(data => {
                let memberInfo = data.result.memberInfo
                if (memberInfo) {
                    let hasName = memberInfo.FirstName != '';
                    let Names = memberInfo.FirstName || ''
                    let Contacts = memberInfo.Contacts || []
                    let phoneTemp = Contacts.find(v => v.ContactType === 'Phone')
                    let phoneStauts = phoneTemp ? phoneTemp.Status != 'Unverified' : false

                    this.setState({
                        hasName,
                        Names,
                        phoneStauts
                    })
                    if (memberInfo.FirstName && phoneStauts) {
                        Toasts.success("验证成功", 2);
                        // this.props.checkMember()
                        this.setState({ isSuccess: true, })
                        setTimeout(() => {
                            //成功后要求3秒后返回
                            Actions.pop()
                            Actions.DepositCenter({ from: 'GamePage' })
                        }, 3000);
                    }
                }
            })
            .catch(() => { })
    }

    submitBtn(nameBankOtp) {
        if(!this.state.issubmitBtn) { return }
        const data = {
            "verificationCode": this.state.verificationCode,
            "isRegistration": false,
            "msIsdn": '86-' + this.state.phoneNum,
            "memberCode": userNameDB,
            "siteId": Platform.OS === "android" ? 17 : 18,
            "serviceAction": this.state.serviceAction,
		};
		Toast.loading("验证中...", 100);
		fetchRequest(ApiPort.PhoneTAC, "POST", data)
			.then(res => {
				Toast.hide();
				if (res) {
					if (!res.isSuccess) {
						let verifyTimes = res.result.remainingAttempt || this.state.verifyTimes
						this.setState({ verifyTimes, verifyErr: true })
						if (res.result.remainingAttempt == 0) {
							this.setState({ phoneType: 3,nameBankOtpModal: false })
							return
						}
						Toasts.fail(res.result.message, 2);
						this.clearCode();
					} else {
                        if(nameBankOtp) {
                            // 姓名银行otp成功提示,提交姓名银行卡数据，
                            this.setState({isSuccessOtp: true})
                            //判断姓名银行卡手机验证是否通过，未登出前就不需要再验证
                            BankCardPhoneVerify = true
                            setTimeout(() => {
                                this.nameIdBankBtn()
                            }, 2000);
                            return
                        }
                        if(!nameBankOtp) {
                            this.getUserStatus()
                            return
                        }

						Toasts.success("验证成功", 2);
                        // this.props.checkMember()
                        this.setState({ isSuccess: true, })
                        setTimeout(() => {
                            //成功后要求3秒后返回
                            Actions.pop()
                            Actions.DepositCenter({ from: 'GamePage' })
                        }, 3000);
					}
				} else {
					Toasts.fail("短信验证服务异常，请稍后再试", 2);
				}
			})
			.catch(err => {
				Toasts.fail("短信验证服务异常，请稍后再试", 2);
			});
    }
    clserPhoneOtp() {
        //个人信息otp没做前需要设置手机otp参数默认，公用一个api，参数不同
        this.setState({
            getCodePhone: true,
            phoneType: 1,
            verifyTimes: 5,
            codeAgainPhone: false,
            CountdownPhone_minutes: '5:00',
            CountdownPhone: 300,
            verifyErr: false,
            issubmitBtn: false,
			verificationCode: "",
			errCode: 0,
        })
        this.CountdownPhones && clearInterval(this.CountdownPhones);
    }

    skips() {
        this.setState({nameBankSkip: true})
    }

    nameBankErr() {
        this.setState({
            nameBankErr: false
        }, () => {
            Actions.pop()
            LiveChatOpenGlobe()
        })
    }
    goBack() {
        if(this.state.fromType == 'phone') {
            PiwikEvent('Verification', 'Click', 'Confirm_Skip_Phone_DepositPage')
        } else {
            PiwikEvent('Verification', 'Click', 'Confirm_Skip_PII_DepositPage')
        }
        this.setState({nameBankSkip: false}, () => { Actions.pop() })
    }
  
    render() {
        const {
            IdentityCard,
            isIdentityCard,
            Names,
            isName,
            nameVerify,
            isSuccess,
            fromType,
            hasName,
            phoneType,
            phoneNum,
            codeAgainPhone,
            phoneChange,
            isPhone,
            CountdownPhone_minutes,
            CountdownPhone,
            verifyErr,
            errCode,
            getCodePhone,
            issubmitBtn,
            verifyTimes,
            errModal,
            otherBankName,
            hasIdentityCard,
            bankList,
            bankCard,
            isbankCard,
            activeBank,
            isOtherBankName,
            isShowCtcModal,
            isSuccessOtp,
            isPhoneEditable,
            nameBankSkip,
            nameBankOtpModal,
            codeInputFocus,
            nameBankErr,
            isSubmitNameModal,
            phoneStauts
        } = this.state;

        return <View style={{ flex: 1, backgroundColor: '#EFEFF4' }}>
            {/* //跳过姓名银行卡提示 */}
            <Modals
                isVisible={nameBankSkip}
                backdropColor={'#000'}
                backdropOpacity={0.4}
                style={{ justifyContent: 'center', margin: 0,marginLeft: 15, }}
            >
                    <View style={styles.nameBankSkip}>
                    <Image resizeMode='contain' source={require("../../images/warn.png")} style={{ width: 64, height: 64 }} />
                    <Text style={{ color: '#666', lineHeight: 22, textAlign: 'center', paddingTop: 20, paddingHorizontal: 15, fontSize: 14 }}>
                        {fromType == 'phone'? `请填写您的真实姓名并完成手机号码验证，\n可确保账号安全和存款快速到账。`: '验证成功后可享有更多存款和提款方式。'}
                    </Text>
                    <View style={styles.otpMsgBtnSkip}>
                        <Touch onPress={() => { this.goBack() }} style={styles.otpLeftBtnSkip}>
                            <Text style={styles.skipItem}>离开</Text>
                        </Touch>
                        <Touch onPress={() => { this.setState({ nameBankSkip: false }) }} style={styles.otpRightBtnSkip}>
                            <Text style={[styles.skipItem,{color: '#fff', lineHeight: 42} ]}>继续验证</Text>
                        </Touch>
                    </View>
                </View>
            </Modals>
            <Modals
                isVisible={isSubmitNameModal}
                backdropColor={'#000'}
                backdropOpacity={0.4}
                style={{ justifyContent: 'center', margin: 0,marginLeft: 15, }}
            >
                    <View style={styles.nameBankSkip}>
                    <Image resizeMode='contain' source={require("../../images/warn.png")} style={{ width: 64, height: 64 }} />
                    <Text style={{ color: '#666', lineHeight: 20, textAlign: 'center', paddingTop: 20, fontSize: 13, paddingHorizontal: 20 }}>
                    抱歉，目前我们无法提交您的验证， 请稍后再重试或联络在线客服。
                    </Text>

                    <Touch onPress={() => { this.setState({ isSubmitNameModal: false }) }} style={{ backgroundColor: '#00a6ff', borderRadius: 8, width: width * 0.8,marginTop: 15 }}>
                            <Text style={{ color: '#fff', lineHeight: 40, textAlign: 'center' }}>知道了</Text>
                        </Touch>
                </View>
            </Modals>
            {/* //姓名银行卡验证错误提示 */}
            <Modals
                isVisible={nameBankErr}
                backdropColor={'#000'}
                backdropOpacity={0.4}
                style={{ justifyContent: 'center', margin: 0,marginLeft: 20, }}
            >
                    <View style={styles.nameBankErr}>
                    <Image resizeMode='contain' source={require("../../images/warn.png")} style={{ width: 64, height: 64 }} />
                    <Text style={{textAlign: 'center', color: '#333', fontSize: 18,lineHeight: 30}}>验证失败</Text>
                    <Text style={{ color: '#666', lineHeight: 23, textAlign: 'center', paddingTop: 20 }}>
                        个人信息验证失败，建议您重新确认信息后再次 提交，或者联系在线客服协助。
                    </Text>
                    <View style={styles.otpMsgBtn}>
                        <Touch onPress={() => { this.nameBankErr() }} style={styles.otpLeftBtn}>
                            <Text style={{ color: '#00a6ff', lineHeight: 40, textAlign: 'center' }}>在线客服</Text>
                        </Touch>
                        <Touch onPress={() => { this.setState({ nameBankErr: false }) }} style={styles.otpRightBtn}>
                            <Text style={{ color: '#fff', lineHeight: 42, textAlign: 'center' }}>重新验证</Text>
                        </Touch>
                    </View>
                </View>
            </Modals>
            {/* 姓名身份证银行卡otp */}
            <Modal visible={nameBankOtpModal} transparent={true} animationType='fade'>
                <View style={[styles.modalOtp,{height: codeInputFocus? height * 0.75: height}]}>
                    {
                        isSuccessOtp &&
                        <View style={styles.isSuccessOtp}>
                            <View style={styles.successCenter}>
                                <Image resizeMode="contain" style={{ width: 48, height: 48 }} source={require('../../images/icon-done.png')} />
                                <Text style={{fontSize: 18, color: '#000', paddingTop: 25}}>验证成功</Text>
                            </View>
                        </View>
                    }
                    <View style={{width: width - 40,}}>
                        <View style={styles.modalOtpTitle}>
                            <Text style={{color: '#fff', lineHeight: 45, textAlign: 'center', fontSize: 16}}>信息验证</Text>
                        </View>
                        <View style={styles.modalOtpCenter}>
                            <Text style={styles.modalOtpMsg}>
                                验证码已发送到您的手机{maskPhone4(phoneNum)} 如需任何帮助，请联系 <Text style={{color: '#00A6FF'}} onPress={() => { LiveChatOpenGlobe() }}>在线客服</Text>。
                            </Text>
                            <View style={styles.inputCode}>
                                <Text style={{color: '#999999', lineHeight: 40, fontSize: 12}}>
                                    您还有（<Text style={{color: '#00A6FF'}}>{verifyTimes}</Text>）次尝试机会
                                </Text>
                                <VerificationCodeInput
                                    key={errCode}
                                    inputSize={6}//默认value是 6
                                    TextInputChange={(value) => { this.checked(value) }}
                                    codeInputFocus={(codeInputFocus) => { this.setState({codeInputFocus}) }}
                                />
                                {
                                    verifyErr &&
                                    <Text style={{color: '#EB2121', fontSize: 11,lineHeight: 25, textAlign: 'center'}}>验证码错误，请确认您输入正确的验证码</Text>
                                }
                                {
                                    !getCodePhone &&
                                    <Text style={{color: '#999', fontSize: 12, lineHeight: 30}}>
                                        重新发送 {CountdownPhone_minutes}
                                    </Text>
                                }
                                {
                                    getCodePhone &&
                                    <Text style={{color: '#00A6FF', fontSize: 12, lineHeight: 30}} onPress={() => { this.getPhoneCode(true) }}>
                                        重新发送
                                    </Text>
                                }
                            </View>
                            <View style={{flexDirection: 'row', paddingTop: 20}}>
                                <Touch style={styles.closeOtp} onPress={() => { this.setState({nameBankOtpModal: false, getCodePhone: true}) }}>
                                    <Text style={styles.closeOtpTxt}>取消</Text>
                                </Touch>
                                <Touch style={{backgroundColor: issubmitBtn? '#00A6FF': '#EFEFF4', borderRadius: 8}} onPress={() => { this.submitBtn(true) }}>
                                    <Text style={[styles.okOtpTxt,{ color: issubmitBtn? '#fff': '#BCBEC3'}]}>确定</Text>
                                </Touch>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* 银行名称列表 */}
            <Modal visible={isShowCtcModal} transparent={true} animationType='fade'>
                <TouchableHighlight onPress={() => {
                    this.setState({
                        isShowCtcModal: false
                    })
                }} style={styles.modalCOntainer}>
                    <View style={styles.modalWrap}>
                        <Text style={styles.modalHeadTitle}>银行名称</Text>
                        <ScrollView
                            automaticallyAdjustContentInsets={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                        >
                            <View >
                                <View>
                                    {
                                        bankList != '' &&
                                        bankList.map((v, i) => {
                                            return <TouchableOpacity style={styles.bankListstyle}
                                                onPress={() => {
                                                    this.setState({
                                                        activeBank: v.Name,
                                                        isShowCtcModal: false
                                                    }, () => { this.verify() })
                                                }}
                                            >
                                                <View>
                                                    <Text style={{ color: '#999999' }}>{v.Name}</Text>
                                                </View>

                                                <View style={{
                                                    borderRadius: 10000,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderWidth: 1,
                                                    borderColor: activeBank == v.Name ? '#00A6FF' : '#BCBEC3',
                                                    width: 20,
                                                    height: 20,
                                                    backgroundColor: activeBank == v.Name ? '#00A6FF' : '#fff'
                                                }}>
                                                    {
                                                        activeBank == v.Name && <View style={styles.virvleBox}></View>
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                        })
                                    }
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </TouchableHighlight>
            </Modal>
            {/* 手机短信已发送 */}
            <Modal
                animationType='none'
                transparent={true}
                visible={errModal}
                onRequestClose={() => { }}
            >
                <View style={styles.errModal}>
                    <View style={styles.modalView}>
                        <View style={{backgroundColor: '#00A6FF', borderTopRightRadius: 10,borderTopLeftRadius: 10}}>
                            <Text style={{ color: '#fff', lineHeight: 40, textAlign: 'center', width: width * 0.8 }}>温馨提醒</Text>
                        </View>
                        <Text style={{ color: '#222222', lineHeight: 70 }}>验证码已发送，请在5分钟后尝试</Text>
                        <Touch onPress={() => { this.setState({ errModal: false }) }} style={{ backgroundColor: '#00a6ff', borderRadius: 8, width: width * 0.6 }}>
                            <Text style={{ color: '#fff', lineHeight: 40, textAlign: 'center' }}>知道了</Text>
                        </Touch>
                    </View>
                </View>
            </Modal>
            {
                isSuccess && 
                <View style={styles.success}>
                     <Image resizeMode="contain" style={{ width: 55, height: 55 }} source={require('../../images/icon-done.png')} />
                     <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold', lineHeight: 50 }}>{fromType == 'nameId'? '已提交': '验证成功'}</Text>
                </View>
            }
            <KeyboardAwareScrollView>
                {
                    phoneType != 3 &&
                    <View style={styles.veifys}>
                        <Image resizeMode="contain" style={{ width: 56, height: 56 }} source={require('../../images/bank/DepositVerify.png')} />
                        {
                            fromType == 'phone' &&
                            <Text style={[styles.titles, {paddingHorizontal: 15, textAlign: 'center'}]}>您好，为了您的账户安全，请填写您的真实姓名并验证您的手机号码。真实姓名一旦填写即不能随意更改，请确保您填写的姓名与您的银行账户持有者姓名一致，以利存款快速到账</Text>
                        }

                        {
                            fromType == 'nameId' &&
                            <Text style={styles.titles}>请确保您在提交前输入正确的信息，以免延误。 </Text>
                        }
                        {
                            fromType == 'nameId' &&
                            <Text style={styles.titles}>
                                如需帮助，请联系<Text onPress={() => {LiveChatOpenGlobe()}} style={{color: '#00A6FF'}}>在线客服</Text>
                            </Text>
                        }
                    </View>
                }
                {
                    fromType == 'nameId' &&
                    <View style={styles.ViewCenter}>

                        <View style={styles.centers}>
                            <View>
                                <Text style={styles.titale}>持卡人姓名</Text>
                                {
                                    !hasName && 
                                    <TextInput
                                        value={Names}
                                        placeholder='持卡人姓名'
                                        maxLength={15}
                                        onChangeText={val => { this.Names(val) }}
                                        placeholderTextColor={'#BCBEC3'}
                                        style={[styles.inputView, { borderColor: Names != '' && !isName ? '#EB2121' : '#ccc', }]} />
                                }
                                {
                                    hasName && 
                                    <TextInput
                                        value={Names.replace(/./g,'*')}
                                        editable={false}
                                        style={[styles.inputView, { borderColor: '#EFEFF4', backgroundColor: '#EFEFF4', }]} />
                                }
                                {
                                    Names != '' && !isName &&
                                    <View style={styles.errView}>
                                        <Text style={{ color: '#EB2121', fontSize: 12, lineHeight: 40 }}>格式不正确</Text>
                                    </View>
                                }
                            </View>

                            {/* <View>
                                <Text style={styles.titale}>身份证号码</Text>
                                {
                                    !hasIdentityCard &&
                                    <TextInput
                                        value={IdentityCard}
                                        maxLength={18}
                                        placeholder='身份证号码'
                                        onChangeText={val => { this.IdentityCard(val) }}
                                        placeholderTextColor={'#BCBEC3'}
                                        style={[styles.inputView, { borderColor: IdentityCard != '' && !isIdentityCard ? '#EB2121' : '#ccc', }]} />
                                }
                                {
                                    hasIdentityCard &&
                                    <TextInput
                                        value={'************' + IdentityCard.slice(-6)}
                                        editable={false}
                                        style={[styles.inputView, { borderColor: '#EFEFF4', backgroundColor: '#EFEFF4', }]} />
                                }
                                {
                                    IdentityCard != '' && !isIdentityCard &&
                                    <View style={styles.errView}>
                                        <Text style={{ color: '#EB2121', fontSize: 12, lineHeight: 40 }}>身份证号码格式错误</Text>
                                    </View>
                                }
                            </View> */}

                            <View>
                                <Text style={styles.titale}>银行名称</Text>
                                <Touch style={styles.inputView} onPress={() => { this.setState({isShowCtcModal: true}) }}>
                                    <Text style={{color: activeBank != ''? '#333': '#BCBEC3', lineHeight: 42}}>
                                        {activeBank!= '' ? activeBank: '请选择银行'}
                                    </Text>
                                    <Image
                                        resizeMode="stretch"
                                        source={require("../../images/down.png")}
                                        style={{
                                            width: 16,
                                            height: 16,
                                            position: "absolute",
                                            right: 10,
                                            top: 11,
                                        }}
                                    />
                                </Touch>
                                {
                                    activeBank == '其他银行' &&
                                    <TextInput
                                        value={otherBankName}
                                        maxLength={35}
                                        placeholder='请填写银行名称'
                                        onChangeText={val => { this.otherBankName(val) }}
                                        placeholderTextColor={'#BCBEC3'}
                                        style={[styles.inputView, { borderColor: otherBankName != '' && !isOtherBankName ? '#EB2121' : '#ccc', marginTop: 8 }]} />
                                }
                                {
                                    otherBankName != '' && !isOtherBankName &&
                                    <View style={styles.errView}>
                                        <Text style={{ color: '#EB2121', fontSize: 12, lineHeight: 40 }}>格式不正确</Text>
                                    </View>
                                }
                            </View>

                            <View>
                                <Text style={styles.titale}>银行卡号</Text>
                                <TextInput
                                        value={bankCard}
                                        maxLength={19}
                                        keyboardType='number-pad'
                                        placeholder='银行卡号'
                                        onChangeText={val => {
                                            this.bankCard(val)
                                        }}
                                        placeholderTextColor={'#BCBEC3'}
                                        style={[styles.inputView, { borderColor: bankCard != '' && !isbankCard ? '#EB2121' : '#ccc' }]} />
                                {
                                    bankCard != '' && !isbankCard &&
                                    <View style={styles.errView}>
                                        <Text style={{ color: '#EB2121', fontSize: 12, lineHeight: 40 }}>银行卡号为14到19位数字</Text>
                                    </View>
                                }
                            </View>
                        </View>
                        <Touch style={{ backgroundColor: nameVerify ? '#00A6FF' : '#E1E1E6', borderRadius: 8, width: width - 30, marginTop: 20 }} onPress={() => { this.nameIdBankBtn() }}>
                            <Text style={{ color: nameVerify ? '#fff' : '#BBBBBB', textAlign: 'center', lineHeight: 40, fontSize: 16 }}>提交</Text>
                        </Touch>
                    </View>
                }
                {
                    fromType == 'phone' &&
                    <View style={styles.ViewCenter}>
                        <View style={styles.ViewCenter}>
                            <View style={styles.centers}>
                                <Text style={styles.titalePhone}>真实姓名</Text>
                                <Text style={{ color: '#666', lineHeight: 21, fontSize: 12 }}>请正确输入您的真实姓名, 当前信息将用于核实您日后的存款账户。</Text>

                                <View style={[styles.phoneNum, { marginBottom: 0 }]}>
                                    <TextInput
                                        value={hasName ? '***' : Names}
                                        placeholder='姓名'
                                        maxLength={15}
                                        onChangeText={val => { this.Names(val) }}
                                        placeholderTextColor={'#999'}
                                        style={{
                                            color: '#000',
                                            backgroundColor: hasName ? '#F3F3F3' : '#fff',
                                            borderColor: hasName ? '#F3F3F3' : '#CCCCCC',
                                            borderWidth:  hasName ? 0 : 1,
                                            width: (width - 80) * .7 + 15,
                                            height: 44,
                                            borderRadius: 6,
                                            paddingLeft: 15
                                        }}
                                        editable={!hasName}
                                        onFocus={() => {
                                           // this.setState({ phoneNum: '', phoneChange: true, phoneType: 1, isPhone: false })
                                        }} />
                                    {
                                        hasName
                                            ?
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image
                                                    resizeMode="stretch"
                                                    source={require("./../../images/icon-done.png")}
                                                    style={{ width: 20, height: 20, marginRight: 5 }}
                                                />
                                                <Text style={{ fontSize: 12, color: '#222222', fontWeight: 'bold' }}>提交成功</Text>
                                            </View>
                                            :
                                            <Touch onPress={() => { (Names.length > 0 && isName) && this.submitName() }} style={[styles.getPhones, {
                                                backgroundColor: (Names.length > 0 && isName) ? '#00A6FF' : '#F3F3F3'
                                            }]}>
                                                <Text style={{ textAlign: 'center', color: (Names.length > 0 && isName) ? '#FFFFFF' : '#BCBEC3', lineHeight: 44 }}>提交</Text>
                                            </Touch>
                                    }
                                </View>

                                {
                                    Names != '' && !isName &&
                                    <View style={[styles.errView, { width: (width - 80) * .7 + 15, marginTop: 0 }]}>
                                        <Text style={{ color: '#EB2121', fontSize: 12, lineHeight: 40 }}>格式不正确</Text>
                                    </View>
                                }
                            </View>
                        </View>
                        <View style={styles.centers}>
                        {
                            (phoneType == 1 || phoneType == 2) &&
                                <View>
                                    <Text style={styles.titalePhone}>验证您的手机号</Text>
                                    <Text style={{ color: '#666', lineHeight: 21, fontSize: 12 }}>确认您的手机号码，然后选择通过短信接受一次性密码。</Text>
                                    <View style={styles.phoneNum}>
                                        <View style={styles.phoneTitle}>
                                            <Text style={{textAlign: 'center', color: '#000', lineHeight: 44}}>+86</Text>
                                        </View>
                                        {
                                            isPhoneEditable ?
                                            <View style={styles.phonesInput}>
                                                <TextInput
                                                    value={phoneChange? phoneNum: maskPhone4(phoneNum)}
                                                    placeholder='手机号码'
                                                    maxLength={11}
                                                    onChangeText={val => { this.phones(val) }}
                                                    placeholderTextColor={'#999'}
                                                    style={{color: '#000'}}
                                                    keyboardType="number-pad"
                                                    textContentType="telephoneNumber"
                                                    textContentType="phone-pad"
                                                    style={{width: (width - 80) * 0.48}}
                                                    onFocus={() => {
                                                        this.setState({phoneNum: '', phoneChange: true, phoneType: 1, isPhone: false})
                                                    }} />
                                            </View>
                                            :
                                            <View style={styles.phones}>
                                                <Text style={{color: '#000', lineHeight: 44}}>{maskPhone4(phoneNum)}</Text>
                                            </View>
                                        }
                                        {
                                            phoneStauts
                                            ?
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image
                                                    resizeMode="stretch"
                                                    source={require("./../../images/icon-done.png")}
                                                    style={{ width: 20, height: 20, marginRight: 5 }}
                                                />
                                                <Text style={{ fontSize: 12, color: '#222222', fontWeight: 'bold' }}>验证成功</Text>
                                            </View>
                                            :
                                            <View>
                                                  {
                                            !isPhone &&
                                            <View style={[styles.getPhones,{backgroundColor: '#F3F3F3'}]}>
                                                <Text style={{textAlign: 'center', color: '#BBBBBB',  lineHeight: 44}}>发送</Text>
                                            </View>
                                        }
                                        {
                                            getCodePhone && isPhone &&
                                            <Touch onPress={() => { this.getPhoneCode() }} style={styles.getPhones}>
                                                <Text style={{textAlign: 'center', color: '#fff',  lineHeight: 44}}>{codeAgainPhone ? `重发`: '发送'}</Text>
                                            </Touch>
                                        }
                                        {
                                            !getCodePhone &&
                                            <Touch onPress={() => { this.getPhoneCode() }} style={[styles.getPhones,{backgroundColor: '#F3F3F3'}]}>
                                                <Text style={{textAlign: 'center', color: '#BCBEC3',  lineHeight: 44}}>重发 {CountdownPhone_minutes}</Text>
                                            </Touch>
                                        }
                                            </View>
                                        }
                                    </View>
                                    {
                                        phoneNum != '' && !isPhone &&
                                        <View style={[styles.errView,{marginTop: 0}]}>
                                            <Text style={{ color: '#EB2121', fontSize: 12, lineHeight: 40 }}>请输入正确的手机号</Text>
                                        </View>
                                    }
                                    <Text style={{ color: '#666', lineHeight: 21, fontSize: 12, paddingBottom: 15 }}>如果您想更新手机号码，请联系我们的<Text onPress={() => { LiveChatOpenGlobe() }} style={{color: '#00ADEF', textDecorationLine: 'underline'}}>在线客服</Text></Text>
                            </View>
                            }
                            {
                                phoneType == 2 && !phoneStauts &&
                                <View style={styles.inputCode}>
                                    <Text style={{lineHeight: 35, textAlign: 'center', color: '#000'}}>
                                        输入发送到手机号的验证码
                                    </Text>
                                    <Text style={styles.activeMsg}>注意：如果您在5分钟内未收到验证码， </Text>
                                    <Text style={styles.activeMsg}>请点击重新发送验证码以获取一个新的验证码。</Text>
                                    <VerificationCodeInput
                                        key={errCode}
                                        inputSize={6}//默认value是 6
                                        TextInputChange={(value) => { this.checked(value) }}
                                    />
                                    {
                                        verifyErr &&
                                        <View style={{backgroundColor: '#FEE5E5',borderRadius: 5,marginTop: 10, width: width - 90}}>
                                            <Text style={{color: '#EB2121', fontSize: 11,lineHeight: 35, textAlign: 'center'}}>验证码有误，请检查并确保您输入了正确的验证码。</Text>
                                        </View>
                                    }
                                    <Text style={{color: '#999999', lineHeight: 40, fontSize: 12}}>
                                        您还有（<Text style={{color: '#00A6FF'}}>{verifyTimes}</Text>）次尝试机会
                                    </Text>
                                    <Touch style={issubmitBtn ? styles.addBtn : styles.addBtnAgain} onPress={() => { this.submitBtn(); PiwikEvent('Verification', 'Submit', 'VerifyOTP_Phone_DepositPage') }}>
                                        <Text style={{ color: issubmitBtn ?'#fff': '#BBBBBB', textAlign: 'center', lineHeight: 45 }}>验证</Text>
                                    </Touch>
                                </View>
                            }
                        </View>
                    </View>
                }
                {
                    phoneType != 3 &&
                    <Touch onPress={() => { this.skips() }}>
                        <Text style={{textAlign: 'center', fontSize: 16, color: '#00A6FF', padding: 20}}>跳过验证</Text>
                    </Touch>
                }
            </KeyboardAwareScrollView>
            {
                phoneType == 3 &&
                <View style={styles.phoneErr}>
                    <View style={{ padding: 20, paddingTop: 80, width: width, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Image resizeMode='stretch' source={require('../../images/warn.png')} style={{ width: 60, height: 60 }} />
                        <Text style={{ fontSize: 20, color: '#222', paddingTop: 35, paddingBottom: 20, fontWeight: 'bold' }}>超过尝试次数</Text>
                        {
                            fromType == 'phone' &&
                            <Text style={{ lineHeight: 22, color: '#999', textAlign: 'center' }}>{`您已超过5次尝试，请24小时后再尝试或\n联系在线客服。`}</Text>
                        }
                        {
                            fromType == 'nameId' &&
                            <Text style={{ lineHeight: 22, color: '#999', textAlign: 'center' }}>{`您已超过5次尝试，请24小时之后再试。或联系我们的在线客服进行验证`}</Text>
                        }
                        <Touch style={{ backgroundColor: '#00a6ff', borderRadius: 8, width: width - 40, marginTop: 30 }} onPress={() => { LiveChatOpenGlobe() }}>
                            <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 45 }}>联系在线客服</Text>
                        </Touch>
                    </View>
                </View>
            }
        </View>
    }

}



export default (BankCardVerify);

const styles = StyleSheet.create({
    titles:{
        color: '#666',
        lineHeight: 20,
        fontSize: 14,
    },
    nameBankSkip: {
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: width - 30,
        borderRadius: 10,
        paddingTop: 25,
        paddingBottom: 25,
    },
    nameBankErr: {
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: width - 40,
        borderRadius: 10,
        padding: 25,
    },
    otpMsgBtn: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 20,
        width: width - 90,
    },
    otpMsgBtnSkip: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 20,
        width: width - 60,
    },
    otpLeftBtnSkip: {
        borderColor: '#00a6ff',
        borderRadius: 5,
        width: (width - 80)* 0.5,
        borderWidth: 1,
    },
    skipItem: { 
        color: '#00a6ff', 
        lineHeight: 40, 
        textAlign: 'center',
        fontSize: 16,
    },
    otpRightBtnSkip: {
        backgroundColor: '#00a6ff', 
        borderRadius: 5, 
        width: (width - 80)* 0.5,
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
    closeOtpTxt: {
        width: (width - 70) * 0.5,
        lineHeight: 40,
        textAlign: 'center',
        color: '#00A6FF'
    },
    closeOtp: {
        borderWidth: 1,
        borderColor: '#00A6FF',
        borderRadius: 8,
        marginRight: 20,
    },
    okOtpTxt: {
        width: (width - 90) * 0.5,
        lineHeight: 40,
        textAlign: 'center',
        color: '#BCBEC3'
    },
    virvleBox: {
        borderRadius: 10000,
        width: 10,
        height: 10,
        backgroundColor: '#fff'
    },
    bankListstyle: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: 42,
        marginBottom: 10,
        borderRadius: 8,
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'space-between'
    },
    modalHeadTitle: {
        textAlign: 'center',
        fontSize: 16,
        paddingBottom: 25,
        color: '#000000',
        fontWeight: '600'
    },
    modalWrap: {
        backgroundColor: '#EFEFF4',
        paddingTop: 15,
        paddingHorizontal: 10,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingBottom: 60,
        height: height * .6
    },
    successCenter: {
        width: 161,
        height: 161,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: '#fff'
    },
    isSuccessOtp: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        width: width,
        height: height,
        backgroundColor: 'rgba(0, 0, 0, .4)',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 99999,
    },
    modalOtp: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        width: width,
        height: height,
        backgroundColor: 'rgba(0, 0, 0, .4)',
    },
    modalOtpCenter: {
        backgroundColor: '#fff',
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
    },
    modalOtpMsg: {
        color: '#333',
        textAlign: 'center',
        padding: 15,
        lineHeight: 22,
    },
    modalOtpTitle: {
        backgroundColor: '#00A6FF',
        width: width - 40,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
    },
    modalCOntainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, .4)',
        width,
        height,
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 10000,
        justifyContent: 'flex-end'
    },
    modalView: {
        backgroundColor: '#fff', 
        borderRadius: 10, 
        paddingBottom: 15, 
        width: width * 0.8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errModal: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0,0.5)",
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
    addBtn: {
		backgroundColor: "#00A6FF",
		borderRadius: 8,
		width: width - 100,
		marginBottom: 15,
	},
	addBtnAgain: {
		backgroundColor: "#E1E1E6",
		borderRadius: 8,
		width: width - 100,
		marginBottom: 15,
	},
    inputCode: { 
        padding: 15, 
        backgroundColor: 
        '#EFEFF4', 
        borderRadius: 10,
        width: width - 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeMsg: {
        fontSize: 12,
         color: '#999999',
         textAlign: 'center',
         lineHeight: 21,
    },
    phoneErr: {
        backgroundColor: '#fff',
        height: height,
        width: width,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 99,
    },
    phoneTitle: {
        backgroundColor: '#F3F3F3',
        borderRadius: 8,
        width: (width - 80) * 0.2,
    },
    phones: {
        backgroundColor: '#F3F3F3',
        borderRadius: 8,
        width: (width - 80) * 0.5,
        paddingLeft: 15,
    },
    phonesInput: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        width: (width - 80) * 0.5,
        paddingLeft: 15,
        height: 42,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    getPhones: {
        backgroundColor: '#35C95B',
        borderRadius: 8,
        width: (width - 80) * 0.3,
    },
    phoneNum: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 10,
    },
    success: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 999,
        backgroundColor: '#fff',
        width: width,
        height: height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: height * 0.4,
    },
    errView: {
        backgroundColor: '#FEE0E0',
        borderRadius: 8,
        paddingLeft: 15,
        marginTop: 10,
    },
    veifys: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 35,

    },
    ViewCenter: {
        padding: 15,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centers: {
        borderRadius: 8,
        backgroundColor: '#fff',
        padding: 15,
        marginTop: 20,
        width: width - 30
    },
    titale: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 40,
        marginTop: 10,
    },
    titalePhone:{
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 40,
    },
    inputView: {
        borderRadius: 4,
        height: 42,
        borderWidth: 1,
        paddingHorizontal: 15,
        borderColor: '#ccc',
    },
});