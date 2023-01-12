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
	ScrollView,
	Platform,
	TextInput,
	KeyboardAvoidingView,
	TouchableHighlight
} from "react-native";
import Touch from "react-native-touch-once";
import { Actions } from "react-native-router-flux";
import LivechatDragHoliday from "../LivechatDragHoliday"
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
const { width, height } = Dimensions.get("window");

class RestPassword extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			moreBtn: false,
			phones: false,
			emails: false,
			memberCode: '',
			memberInfo: this.props.memberInfo,
			noMoreverifcation: true,
		};
	}
	componentWillMount() {
		let memberInfo = this.props.memberInfo || ''
		if (memberInfo) {
			const phoneData = memberInfo.Contacts.filter(
				item => item.ContactType.toLocaleLowerCase() == "phone"
			)[0];
			const emailData = memberInfo.Contacts.filter(
				item => item.ContactType.toLocaleLowerCase() == "email"
			)[0];

			let memberCode = memberInfo.MemberCode
			let phones = phoneData && phoneData.Contact || false
			let emails = emailData && emailData.Contact || false

			this.setState({ phones, emails, memberCode })
		}
	}
	componentDidMount() {
		global.storage.remove({
			key: "VerifyPhone",
			id: "VerifyPhone"
		});
		global.storage.remove({
			key: "VerifyEmail",
			id: "VerifyEmail"
		});
		global.storage.remove({
			key: "verifyTimes",
			id: "verifyTimes"
		});
		this.getLiveChat()
	}

	componentWillUnmount() { }
	getLiveChat() {
		fetchRequest(ApiPort.LiveChat, "GET") //拿克服連結
			.then(data => {
				LiveChatX = data.url;
			})
			.catch(error => {
			});
	}

	goSetPassword(key, type) {
		if(!this.state.noMoreverifcation) {return}
		Actions.SetVerification({ dataPhone: this.state.phones,dataEmail: this.state.emails, verificaType: type, memberCode: this.state.memberCode,noMoreverifcation: this.noMoreverifcation })
	}
	noMoreverifcation = () => {
		this.setState({noMoreverifcation: false})
	}
	render() {
		window.PromptPagPop = () => {
			Actions.pop()
		}
		const {
			moreBtn,
			phones,
			emails,
			noMoreverifcation,
		} = this.state;
		return (
			<View style={{ flex: 1, backgroundColor: '#efeff4' }}>
				<View style={[styles.topNav, { marginTop: DeviceInfoIos ? 40 : 0 }]}>
					<Text style={{ color: '#fff', fontSize: 20, lineHeight: 60, fontWeight: 'bold' }}>安全验证</Text>
					<Touch onPress={() => { LiveChatOpenGlobe() }} style={{ position: 'absolute', right: 20 }}>
						<Image resizeMode='stretch' source={require('../../images/cs.png')} style={{ width: 30, height: 30 }} />
					</Touch>
				</View>
				<ScrollView
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
				>
					{
						moreBtn == false &&
						<View style={{ padding: 15 }}>
							<View style={{ borderRadius: 10, backgroundColor: '#fff', padding: 15 }}>
								<Text style={{ color: '#000000', lineHeight: 20, paddingBottom: 25 }}>
									为了更好的保护您的账户安全，提高账户安全等级，反劫持并降低交易风险，我们需要您进行账户信息验证。
							</Text>
								<View style={{ display: 'flex', alignItems: 'flex-end' }}>
									<Touch onPress={() => { this.setState({ moreBtn: true }) }} style={styles.moreBtn}>
										<Text style={{ color: '#00a6ff' }}>了解更多</Text>
									</Touch>
								</View>
							</View>
							<View style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', marginTop: 15 }}>
								{
									phones != false &&
									<Touch onPress={() => { this.goSetPassword(phones, 'phone') }} style={styles.btnTouch}>
										<View style={styles.listBtn}>
											<Image resizeMode='stretch' source={require('../../images/loginOtp/Phone.png')} style={{ width: 48, height: 48 }} />
										</View>
										<View style={[noMoreverifcation? styles.btnTxt: styles.nobtnTxt]}>
											<Text style={{ color: noMoreverifcation? '#fff': '#bcbec3' }}>通过手机验证</Text>
										</View>
									</Touch>
								}
								{
									emails != false &&
									<Touch onPress={() => { this.goSetPassword(emails, 'email') }} style={styles.btnTouch}>
										<View style={styles.listBtn}>
											<Image resizeMode='stretch' source={require('../../images/loginOtp/Email.png')} style={{ width: 48, height: 48 }} />
										</View>
										<View style={[noMoreverifcation? styles.btnTxt: styles.nobtnTxt]}>
											<Text style={{ color: noMoreverifcation? '#fff': '#bcbec3' }}>通过邮箱验证</Text>
										</View>
									</Touch>
								}
								<Touch onPress={() => { LiveChatOpenGlobe() }} style={styles.btnTouch}>
									<View style={styles.listBtn}>
										<Image resizeMode='stretch' source={require('../../images/loginOtp/CS.png')} style={{ width: 48, height: 48 }} />
									</View>
									<View style={styles.btnTxt}>
										<Text style={{ color: '#fff' }}>联系在线客服</Text>
									</View>
								</Touch>
							</View>
						</View>
					}
					{
						moreBtn == true &&
						<View>
							<Image resizeMode='stretch' source={require('../../images/loginOtp/Password.png')} style={{ width: width, height: width * 0.248 }} />
							<View style={{ padding: 20 }}>
								<Text style={{ color: '#000000', paddingBottom: 12, lineHeight: 20 }}>亲爱的玩家，</Text>
								<Text style={{ color: '#000000', paddingBottom: 12, lineHeight: 20 }}>为了维持最高的服务标准，我们正在不断升级我们的系统。 目前，我们需要进行进一步升级数据安全系统，需要您帮助来验证您的电话号码或电子邮件，以确保是您本人登录。</Text>
								<Text style={{ color: '#000000', paddingBottom: 12, lineHeight: 20 }}>为了进一步保护您的信息，我们将需要您通过短信或电子邮件身份验证您的登录信息。 您登录后，我们会将6位数的验证码发送到账户绑定的电话或电子邮件， 您可以通过在网页或客户端上输入6位数验证码来验证您的帐户。 如果您无法确认电话号码或电子邮件地址，请联系我们在线客户服务，随时为您提供协助。</Text>

								<Text style={{ color: '#000000', paddingBottom: 12, lineHeight: 20 }}>我们全体员工将竭尽全力保护您的个人信息，我们希望得到您的理解与支持。</Text>
								<Text style={{ color: '#000000', paddingBottom: 12, lineHeight: 20 }}>谢谢 </Text>
								<Text style={{ color: '#000000', paddingBottom: 12, lineHeight: 20 }}>乐天堂 FUN88</Text>
							</View>
						</View>
					}
				</ScrollView>
				{
					moreBtn == true &&
					<Touch onPress={() => { this.setState({ moreBtn: false }) }} style={{ backgroundColor: '#00a6ff', position: 'absolute', bottom: 0, width: width }}>
						<Text style={{ color: '#fff', textAlign: 'center', lineHeight: 45, fontSize: 18 }}>进行验证</Text>
					</Touch>
				}
				{/*客服懸浮球*/}
				{/* <LivechatDragHoliday /> */}
			</View>
		);
	}
}

export default RestPassword;

const styles = StyleSheet.create({
	topNav: {
		width: width,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#00a6ff'
	},
	btnTouch: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width / 3.5,
		backgroundColor: '#fff',
		borderRadius: 10,
		paddingBottom: 10,
	},
	listBtn: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width * 0.22,
		height: width * 0.15,
	},
	btnTxt: {
		width: width * 0.25,
		height: 32,
		backgroundColor: '#00a6ff',
		borderRadius: 5,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 5,
	},
	nobtnTxt: {
		width: width * 0.25,
		height: 32,
		backgroundColor: '#e8e8e8',
		borderRadius: 5,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 5,
	},
	moreBtn: {
		padding: 10,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#00a6ff'
	}
});
