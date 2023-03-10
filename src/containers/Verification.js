import React from "react";
import {
	StyleSheet,
	WebView,
	Text,
	View,
	Animated,
	TouchableOpacity,
	Dimensions,
	Image,
	Platform,
	TextInput,
	Modal,
	KeyboardAvoidingView,
	TouchableHighlight
} from "react-native";
import Touch from "react-native-touch-once";
import { Actions } from "react-native-router-flux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
	Carousel,
	WhiteSpace,
	WingBlank,
	Flex,
	Toast,
	InputItem,
	ActivityIndicator,
	List,
	Picker
} from "antd-mobile-rn";
import { maskEmail, maskPhone, maskPhone4 } from "./../actions/Reg";
const { width, height } = Dimensions.get("window");
import VerificationCodeInput from './VerificationCodeInput'
import LivechatDragHoliday from "./LivechatDragHoliday"

let verificationType = {
	phone: {
		title: "验证手机号码",
		txt1: `点击"发送"，您的手机将会收到验证码，请输入您收到的验证码以完成本次验证.`,
		txt2: "手机号码",
		txt3: "如果您想更新手机号码，请联系我们的",
		txt4: '请输入您手机收到的验证码',
	},
	email: {
		title: "验证电子邮箱 ",
		txt1: `点击"发送"，您的电子邮箱将会收到验证码，请输入您收到的验证码以完成本次验证.`,
		txt2: "电子邮箱",
		txt3: "如果您想更新电子邮箱，请联系我们的 ",
		txt4: '请输入您邮箱收到的验证码',
	}
};
// 个人资料--手机验证/邮箱验证
class SetVerification extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			aaa: "",
			errCode: 0,
			verifyErr: false,
			exceed: false,
			codeAgainPhone: false,
			codeAgainEmail: false,
			verifyTimes: 5, //剩余次数
			getCodePhone: true,
			getCodeEmail: true,
			verificationCode: "",
			CountdownPhone: "300",
			CountdownEmail: "600",
			CountdownPhone_minutes: "5:00",
			CountdownEmail_minutes: "10:00",
			issubmitBtn: false,
			verificaType: this.props.verificaType,
			phone: '',
			email: '',
			phoneOrEmail: "",
			verification: true,
			memberCode: '',
			errmessage: '',
			isSHowModal1: false
		};
	}
	componentWillMount() {
		this.props.navigation.setParams({
			title: verificationType[this.props.verificaType].title
		});
		this.setData()
		this.getVerifyTimes()
		// this.getDownTime()
	}
	componentDidMount() {

	}

	componentWillUnmount() {
		//存储倒计时
		if (this.state.codeAgainPhone) {
			let phoneTime = (new Date()).getTime() / 1000 + this.state.CountdownPhone
			global.storage.save({
				key: 'VerifyPhone',
				id: 'VerifyPhone',
				data: phoneTime,
				expires: null
			});
		}

		//存储倒计时
		if (this.state.codeAgainEmail) {
			let emailTime = (new Date()).getTime() / 1000 + this.state.CountdownEmail
			global.storage.save({
				key: 'VerifyEmail',
				id: 'VerifyEmail',
				data: emailTime,
				expires: null
			});
		}

		//保存次数
		global.storage.save({
			key: 'verifyTimes',
			id: 'verifyTimes',
			data: this.state.verifyTimes,
			expires: null
		});

		this.CountdownPhones && clearInterval(this.CountdownPhones);
		this.CountdownEmails && clearInterval(this.CountdownEmails);
	}
	getVerifyTimes() {
		//获取剩余次数
		let types = this.state.verificaType == 'email'? 'Email': 'SMS'
		Toast.loading("加载中...", 100);
		fetchRequest(ApiPort.VerificationAttempt + `?ServiceAction=ContactVerification&channelType=${types}&`, "GET")
		.then(res => {
			Toast.hide();
			this.setState({ verifyTimes: res && res.remainingAttempt })
			if(res.remainingAttempt == 0) {
				this.setState({verification: false})
			}
		})
		.catch(() => {})
	}

	getDownTime() {

		//获取剩余次数
		// global.storage.load({
		// 	key: 'verifyTimes',
		// 	id: 'verifyTimes'
		// }).then(verifyTimes => {
		// 	if (verifyTimes) {
		// 		this.setState({ verifyTimes })
		// 	}
		// })

		//重新进行倒计时
		if (this.state.verificaType == 'phone') {
			global.storage.load({
				key: 'VerifyPhone',
				id: 'VerifyPhone'
			}).then(ret => {
				let news = (new Date()).getTime() / 1000

				if (ret - news > 0) {
					this.CountdownPhone(parseInt(ret - news))
				}
			})
		} else if (this.state.verificaType == 'email') {
			global.storage.load({
				key: 'VerifyEmail',
				id: 'VerifyEmail'
			}).then(ret => {
				let news = (new Date()).getTime() / 1000

				if (ret - news > 0) {
					this.CountdownEmail(parseInt(ret - news))
				}
			})

		}
	}

	setData() {
		let phone = this.props.dataPhone
		let email = this.props.dataEmail
		if (this.state.verificaType == 'phone' && phone.indexOf('-') > -1) {
			phone = phone.split('-')[1]
		}

		let memberCode = this.props.memberCode
		this.setState({ phone, email, memberCode }, () => { this, this.setVerifyData() })
	}
	// 隐藏需验证的手机或邮箱
	setVerifyData() {
		let datas;
		const { verificaType, phone, email } = this.state;
		if (verificaType == "email") {
			datas = maskEmail(email);
		} else {
			datas = maskPhone4(phone);
		}
		this.setState({ phoneOrEmail: datas });
	}

	//发送验证码
	getCode() {
		if (this.state.verificaType == "phone") {
			this.sendSMSVerfication();
		}
		if (this.state.verificaType == "email") {
			this.sendEmailVerfication();
		}
	}

	//TODO: 发送短信验证码
	sendSMSVerfication() {
		const data = {
			"siteId": Platform.OS === "android" ? 17 : 18,
			"MsIsdn": '86-' + this.state.phone,
			"isRegistration": false,
			"isOneTimeService": false,
			"memberCode": userNameDB,
			"CurrencyCode": "CNY",
			"isMandatoryStep": false,
			"ServiceAction": "ContactVerification",
		};
		Toast.loading("发送中...", 100);
		fetchRequest(window.ApiPort.PhoneVerify, "POST", data)
			.then(res => {
				Toast.hide();
				if (res.isSuccess) {
					Toasts.success("发送成功", 2);
				} else {
					
					let resendCounter = res.result.resendCounter
					if (resendCounter == 0) {
						this.setState({
							isSHowModal1: true
						})
						return
					} else {
						Toasts.fail(res.result.message, 2);
					}
				}
				this.CountdownPhone(300)
				this.clearCode();
			})
			.catch(err => {
				Toasts.fail("短信服务异常，请稍后再试", 2);
			});
	}
	//TODO: 获取邮箱验证码
	sendEmailVerfication() {

		const data = {
			"sideId": Platform.OS === "android" ? 17 : 18,
			"ipAddress": "",
			"memberCode": this.state.memberCode,
			"email": this.state.email,
			"domainUrl": SBTDomain,
			"emailVerificationServiceType": "ContactVerification",
		};
		Toast.loading("发送中...", 100);
		fetchRequest(window.ApiPort.EmailVerify, "POST", data)
			.then(res => {
				Toast.hide();
				// 发送异常
				if (!res.isSuccess) {
					let resendCounter = res.result.resendCounter
					if (resendCounter == 0) {
						this.setState({
							isSHowModal1: true
						})
						return
					} else {
						Toasts.fail(res.result.message, 2);
					}
				} else {
					Toasts.success("发送成功", 2);
				}
				this.CountdownEmail(600)
				this.clearCode();
			})
			.catch(err => {
				Toasts.fail("邮件服务异常，请稍后再试", 2);
			});
	}
	//TODO: 校验短信验证码
	verifySMSTAC() {
		this.setState({
			errmessage: ''
		})
		const data = {
			"serviceAction": "ContactVerification",
			"memberCode": userNameDB,
			"VerificationCode": this.state.verificationCode,
			"MsIsdn": '86-' + this.state.phone,
			"sideId": Platform.OS === "android" ? 17 : 18,
			"IsMandatoryStep": false,
			"IsRegistration": true
			// "ServiceAction": "ContactVerification",
			// "memberCode": userNameDB,
			// "VerificationCode": this.state.verificationCode,
		};
		Toast.loading("验证中...", 100);
		fetchRequest(window.ApiPort.PhoneTAC, "POST", data)
			.then(res => {
				Toast.hide();
				if (res) {
					if (!res.isSuccess) {
						let verifyTimes = res.result.remainingAttempt
						this.setState({ verifyTimes, verifyErr: true })
						if (verifyTimes == 0) {
							this.setState({ verification: false })
							this.props.noMoreverifcation()
							return
						}
						// const re = /[0-9]/g;
						// const temp = res.result.message && (res.result.message.match(/[0-9]/g) || 3);
						// this.setState({ verifyTimes: temp })
						// Toasts.fail(res.result.message, 2);
						Toasts.fail(res.result.message, 2);

						// this.setState({
						// 	errmessage: res.result.message || ''
						// })
						this.clearCode();

					} else {
						Toasts.success("验证成功", 2);
						Actions.pop()
						this.props.getUser()
					}
				} else {
					Toasts.fail("短信验证服务异常，请稍后再试", 2);
				}
			})
			.catch(err => {
				Toasts.fail("短信验证服务异常，请稍后再试", 2);
			});
	}
	// TODO:校验邮件验证码
	verifyEmailTAC() {
		const data = {
			"ipAddress": "",
			"ServiceAction": "ContactVerification",
			"memberCode": this.state.memberCode,
			"email": this.state.email,
			"tac": this.state.verificationCode,
		};
		Toast.loading("验证中...", 100);
		fetchRequest(window.ApiPort.EmailTAC, "POST", data).then(res => {
			Toast.hide();
			if (res) {
				if (!res.isSuccess) {
					let verifyTimes = res.result.remainingAttempt
					this.setState({ verifyTimes, verifyErr: true })
					if (verifyTimes == 0) {
						this.setState({ verification: false })
						this.props.noMoreverifcation()
						return
					}

					// const re = /[0-9]/g;
					// const temp = res.result.errorMessage && re.exec(res.result.errorMessage)[0] || 3;
					// this.setState({ verifyTimes: temp })
					// Toasts.fail(res.result.errorMessage, 2);
					
					Toasts.fail(res.result.message, 2);
					this.clearCode();

					// this.setState({
					// 	errmessage: res.result.message || res.result.errorMessage || ''
					// })

				} else {
					Toasts.success("验证成功", 2);
					Actions.pop()
					this.props.getUser()
				}
			} else {
				Toasts.fail("邮件验证服务异常，请稍后再试", 2);
			}
		}).catch(err => {
			Toasts.fail("邮件验证服务异常，请稍后再试", 2);
		});
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

	//邮箱验证码倒计时处理
	CountdownEmail(item) {
		this.setState({ codeAgainEmail: true, getCodeEmail: false })
		let time = item;
		let m, s, ms;
		this.CountdownEmails = setInterval(() => {
			time -= 1;
			m = "0" + parseInt(time / 60).toString();
			s = time - m * 60;
			if (s < 10) {
				s = "0" + s.toString();
			}
			ms = m + ":" + s;
			this.setState({ CountdownEmail: time, CountdownEmail_minutes: ms });
			if (m == 0 && s == 0) {
				this.setState({ getCodeEmail: true })
				clearInterval(this.CountdownEmails);
			}
		}, 1000);
	}

	//提交验证
	submitBtn() {

		if (this.state.verificationCode.length != 6) {
			return;
		}
		// TODO: 提交验证码
		if (this.state.verificaType == "phone" && this.state.codeAgainPhone) {
			this.verifySMSTAC();
		}
		if (this.state.verificaType == "email" && this.state.codeAgainEmail) {
			this.verifyEmailTAC();
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
	checked(code) {
		if (code.length == 6) {
			this.setState({ issubmitBtn: true, verificationCode: code, verifyErr: false });
		} else {
			this.setState({ issubmitBtn: false });
		}
	}

	changType() {
		this.setState({
			verificationCode: '',
			verificaType: this.state.verificaType == 'email' ? 'phone' : 'email',
		}, () => {
			this.setVerifyData()
			this.props.navigation.setParams({
				title: verificationType[this.state.verificaType].title
			});
		})
	}
	render() {
		const {
			errCode,
			errorMessage,
			verifyErr,
			exceed,
			codeAgainPhone,
			codeAgainEmail,
			getCodePhone,
			getCodeEmail,
			verifyTimes,
			CountdownPhone,
			CountdownEmail,
			issubmitBtn,
			verificaType,
			phoneOrEmail,
			dataType,
			verification,
			CountdownPhone_minutes,
			CountdownEmail_minutes,
			errmessage,
			isSHowModal1
		} = this.state;
		return (
			<View style={{ flex: 1, backgroundColor: '#fff' }}>

				<Modal animationType='fade' transparent={true} visible={isSHowModal1}
				>
					<View style={{
						width,
						height,
						flex: 1,
						backgroundColor: 'rgba(0 ,0 ,0, .6)',
						alignItems: 'center',
						justifyContent: 'center'

					}}>
						<View style={{
							width: width * .9,
							borderRadius: 8,
							overflow: 'hidden',
							backgroundColor: '#fff'
						}}>
							<View style={{
								padding: 15,
								paddingVertical: 25
							}}>

								<View style={{ alignItems: 'center' }}>
									<Image source={require('./../images/warn.png')} style={{
										width: 70, height: 70
									}} resizeMode='stretch'></Image>

									<Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>超过尝试次数</Text>
									<Text style={{
										textAlign: 'center',
										marginBottom: 10, color: '#000', marginTop: 15, paddingHorizontal: 20
									}}>您已超过 5 次尝试, 请 24 小时之后再试。或联系我们的在线客服进行验证</Text>
								</View>


								<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
									<Touch onPress={() => {
										this.setState({
											verification: false,
											isSHowModal1: false
										})

									}} style={{ height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 6, borderWidth: 1, borderColor: '#00A6FF', width: 130 }}>
										<Text style={{ color: '#00A6FF', fontSize: 15 }}>关闭</Text>
									</Touch>
									<Touch
										onPress={() => {
											this.setState({
												verification: false,
												isSHowModal1: false
											})
											LiveChatOpenGlobe()
										}}
										style={{ height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 6, borderWidth: 1, borderColor: '#00A6FF', width: 130, backgroundColor: '#00A6FF' }}>
										<Text style={{ color: '#fff', fontSize: 15 }}>联系客服</Text>
									</Touch>
								</View>
							</View>
						</View>

					</View>
				</Modal>



				{
					verification &&
					<KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
						<View style={{ padding: 10, marginBottom: 20 }}>
							<WhiteSpace size="lg" />
							<View>
								<View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 10, paddingBottom: 20 }}>
									<View style={{ borderBottomColor: '#c4c4c4', borderBottomWidth: 1 }}>
										<Text style={{ color: "#171717", fontSize: 18 }}>
											{verificationType[verificaType].title}
										</Text>
										<Text style={{ color: "#999", paddingTop: 12, paddingBottom: 25 }}>
											{verificationType[verificaType].txt1}
										</Text>
									</View>
									<Text style={{ paddingTop: 20, paddingBottom: 8, color: '#2D2D2D' }}>{verificationType[verificaType].txt2}</Text>
									{
										verificaType == 'email' &&
										<View style={{ borderRadius: 10, backgroundColor: '#efeff4', paddingLeft: 15 }}>
											<Text style={{ lineHeight: 45, color: '#000' }}>{phoneOrEmail}</Text>
										</View>
									}
									{
										verificaType == 'phone' &&
										<View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
											<View style={{ borderRadius: 10, backgroundColor: '#efeff4', width: (width - 60) / 5 }}>
												<Text style={{ lineHeight: 45, textAlign: 'center', color: '#000' }}>+86</Text>
											</View>
											<View style={{ borderRadius: 10, backgroundColor: '#efeff4', paddingLeft: 15, width: (width - 60) / 1.2 }}>
												<Text style={{ lineHeight: 45, color: '#000' }}>{phoneOrEmail}</Text>
											</View>
										</View>
									}
									<View style={{ borderRadius: 10, backgroundColor: '#efeff4', marginTop: 15, paddingLeft: 15 }}>
										<Text style={{ color: '#999999', fontSize: 12, lineHeight: 45 }}>{verificationType[verificaType].txt3}<Text onPress={() => { LiveChatOpenGlobe() }} style={{ color: '#00a6ff', fontSize: 12 }}>在线客服</Text></Text>
									</View>

									{
										verificaType == 'email' &&
										<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
											{getCodeEmail && (
												<Touch onPress={() => { this.getCode() }} style={styles.getCodeBtn}>
													<Text style={{ color: "#fff", textAlign: "center", lineHeight: 45 }} >
														{codeAgainEmail ? '重新发送' : '发送'}
													</Text>
												</Touch>
											)}
											{!getCodeEmail && (
												<View style={styles.getCodeBtnAgain}>
													<Text style={{ color: "#999", textAlign: "center", lineHeight: 45 }} >
														重新发送 ({CountdownEmail_minutes})
													</Text>
												</View>
											)}
										</View>
									}
									{
										verificaType == 'phone' &&
										<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
											{getCodePhone && (
												<Touch onPress={() => { this.getCode() }} style={styles.getCodeBtn}>
													<Text style={{ color: "#fff", textAlign: "center", lineHeight: 45 }} >
														{codeAgainPhone ? '重新发送' : '发送'}
													</Text>
												</Touch>
											)}
											{!getCodePhone && (
												<View style={styles.getCodeBtnAgain}>
													<Text style={{ color: "#999", textAlign: "center", lineHeight: 45 }} >
														重新发送 ({CountdownPhone_minutes})
													</Text>
												</View>
											)}
										</View>
									}
								</View>

								{
									((verificaType == 'phone' && codeAgainPhone) || (verificaType == 'email' && codeAgainEmail)) &&
									<View style={{ padding: 10, borderRadius: 10, paddingBottom: 20 }}>
										<View style={{ padding: 15, backgroundColor: '#F4F4F4', borderRadius: 10 }}>
											<Text style={{ color: "#000", fontSize: 12, textAlign: 'center' }}>
												{verificationType[verificaType].txt4}
											</Text>
											<Text style={{ color: '#666', fontSize: 12, textAlign: 'center', paddingBottom: 15, lineHeight: 20 }}>
												{
													verificaType == 'email' ?
													'请注意：获取新的验证码前请查看您的垃圾箱 若您在10分钟内尚未收到验证码，请点击”重新发送”'
													:
													'注意：如果5分钟后仍未收到验证码，请点击“重新发送”以获取新的验证码。'
												}
											</Text>
											<VerificationCodeInput
												key={errCode}
												inputSize={6}//默认value是 6
												TextInputChange={(value) => { this.checked(value) }}
											/>

											{
												errmessage.length > 0 &&
												<View style={{ backgroundColor: '#FEE0E0', borderRadius: 6, marginTop: 10, height: 40, paddingLeft: 10, justifyContent: 'center' }}>
													<Text style={{ color: '#EB2121' }}>{errmessage}</Text>
												</View>
											}

											{
												verifyErr &&
												<View style={{ backgroundColor: '#FEE5E5', borderRadius: 5, marginTop: 10 }}>
													<Text style={{ color: '#EB2121', fontSize: 12, lineHeight: 35, paddingLeft: 10 }}>验证码有误，请检查并确保您输入了正确的验证码.</Text>
												</View>
											}
											<Text style={{ textAlign: "center", fontSize: 12, paddingTop: 20, color: '#999' }}>
												您还有（<Text style={{ color: '#00a6ff' }}>{verifyTimes}</Text>）次尝试机会
											</Text>
											<View style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: 10 }}>
												{
													verificaType == 'email' &&
													<Touch style={codeAgainEmail && issubmitBtn ? styles.addBtn : styles.addBtnAgain} onPress={() => { this.submitBtn(); PiwikEvent('Verification', 'Submit', 'SubmitOTP_Phone_ProfilePage') }}>
														<Text style={{ color: '#fff', textAlign: 'center', lineHeight: 45 }}>立即验证</Text>
													</Touch>
												}
												{
													verificaType == 'phone' &&
													<Touch style={codeAgainPhone && issubmitBtn ? styles.addBtn : styles.addBtnAgain} onPress={() => { this.submitBtn(); PiwikEvent('Verification', 'Submit', 'SubmitOTP_Email_ProfilePage') }}>
														<Text style={{ color: '#fff', textAlign: 'center', lineHeight: 45 }}>立即验证</Text>
													</Touch>
												}
											</View>
										</View>
										{/* <Touch onPress={() => { this.changType() }}>
											<Text style={{ color: '#00a6ff', textAlign: 'center', lineHeight: 45, paddingTop: 20, fontSize: 16 }}>更换验证方式</Text>
										</Touch> */}
									</View>
								}
							</View>
							{
								((verificaType == 'phone' && codeAgainPhone) || (verificaType == 'email')) && <TouchableOpacity onPress={() => {
									Actions.pop()
								}} style={{ height: 44, marginHorizontal: 10, borderRadius: 6, borderWidth: 1, borderColor: '#00A6FF', alignItems: 'center', justifyContent: 'center' }}>
									<Text style={{ color: '#00A6FF' }}>下次再验证</Text>
								</TouchableOpacity>
							}

						</View>


					</KeyboardAwareScrollView>
				}
				{
					//三次错误
					verification == false &&
					<View style={{ flex: 1, backgroundColor: '#F2F2F2' }}>
						<View style={{ padding: 20, paddingTop: 50, width: width, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<Image resizeMode='stretch' source={require('./../images/warn.png')} style={{ width: 60, height: 60 }} />
							<Text style={{ fontSize: 20, color: '#222', paddingTop: 35, paddingBottom: 20, fontWeight: 'bold' }}>超过尝试次数</Text>
							<Text style={{ lineHeight: 22, color: '#666666' }}>您已超过 5 次尝试, 请 24 小时之后再试。或联系我们的在线客服进行验证</Text>
							{/* <Touch style={{ backgroundColor: '#00a6ff', borderRadius: 8, width: width - 40, marginTop: 30 }} onPress={() => { LiveChatOpenGlobe() }}>
								<Text style={{ color: '#fff', textAlign: 'center', lineHeight: 45 }}>联系客服</Text>
							</Touch> */}
						</View>
					</View>
				}
				{/*客服懸浮球*/}
				{/* <LivechatDragHoliday /> */}


			</View>
		);
	}
}

export default SetVerification;

const styles = StyleSheet.create({
	headerTop: {
		top: 0,
		backgroundColor: "#034631",
		width: width,
		height: Platform.OS === "ios" ? 85 : 45,
		zIndex: 20,
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "flex-end",
		paddingBottom: 10
	},
	steps: {
		position: "relative",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		paddingLeft: 25,
		paddingRight: 25
	},
	stepListActive: {
		backgroundColor: "#00623b",
		width: 45,
		height: 45,
		borderRadius: 45,
		justifyContent: "center",
		alignItems: "center"
	},
	stepList: {
		backgroundColor: "transparent",
		borderColor: "#a1a1a1",
		borderWidth: 2,
		width: 45,
		height: 45,
		borderRadius: 45,
		justifyContent: "center",
		alignItems: "center"
	},
	accountNum: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		borderRadius: 5,
		height: 50,
		backgroundColor: "#e4e4e4"
	},
	accountTxt: {
		borderRightWidth: 1,
		borderColor: "#989898",
		padding: 10
	},
	getCodeBtn: {
		backgroundColor: "#00a6ff",
		borderRadius: 10,
		marginTop: 15,
		justifyContent: 'center',
		alignItems: 'center',
		width: width - 40,
	},
	getCodeBtnAgain: {
		backgroundColor: "#efeff4",
		borderRadius: 10,
		marginTop: 15,
		justifyContent: 'center',
		alignItems: 'center',
		width: width - 40,
	},
	addBtn: {
		backgroundColor: "#0ccc3c",
		borderRadius: 8,
		width: width - 100,
		marginBottom: 15,
	},
	addBtnAgain: {
		backgroundColor: "#d4d7dd",
		borderRadius: 8,
		width: width - 100,
		marginBottom: 15,
	},
	codeNmu: {
		backgroundColor: "#fff",
		borderRadius: 5,
		padding: 10,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	codeNmuList: {
		height: 50,
		width: width / 7.8,
		borderWidth: 1,
		borderRadius: 10,
		borderColor: "#ddd",
		textAlign: "center",
		fontSize: 20
	},
	submitBtn: {
		borderRadius: 5,
		marginTop: 15
	},
	topNav: {
		width: width,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff'
	},
	btnTouch: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
});
