import React from 'react';
import { StyleSheet, Text, TextStyle, Image, View, ViewStyle, ScrollView, TouchableOpacity, Dimensions, WebView, Platform, FlatList, TextInput, Modal } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Accordion from 'react-native-collapsible/Accordion';
import { Toast, Carousel, Flex, Picker, List, Tabs, DatePicker } from 'antd-mobile-rn';
import { connect } from "react-redux"; import moment from 'moment'
import { IdentityCardReg } from '../actions/Reg'
import Touch from 'react-native-touch-once';
const {
	width, height
} = Dimensions.get('window')
class News extends React.Component {


	constructor(props) {
		super(props);
		this.state = {
			address: "",
			IdentityCard: '',
			isIdentityCard: false,
		}
	}
	componentWillMount(props) {
        this.props.navigation.setParams({
            title: this.props.from == 'Address'? '联系地址': '身份证号码'
        });
	}

	AdressVerifie(type) {
		let MemberData = {
			wallet: "MAIN",
			addresses: {
				address: this.state.address,
				city: '',
				country: "中国",
				nationId: 1
			}
		};
		if(type == 'IdentityCard') {
			MemberData = {
				key: 'IdentityCard',
				value1: this.state.IdentityCard
			}
		}
		Toast.loading("提交中,请稍候...", 200);
		fetchRequest(window.ApiPort.Register, type == 'IdentityCard'? 'PATCH': "PUT", MemberData).then(data => {
			Toast.hide();
			if (data.isSuccess == true) {
				Toasts.success("更新成功!");
				Actions.pop()
				this.props.getUser()
			} else if (data.isSuccess == false) {
				if (data.message == "MEM00050") {
					Toasts.fail("您并未修改资料。");
				} else {
					Toasts.fail(data.result.Message);
				}
			}
		}).catch(error => {
			Toasts.fail(error.errorMessage, 1);
		});
	}


	render() {
		const {
			IdentityCard,
			isIdentityCard,
			address,
		} = this.state;
		return <View style={{ flex: 1, backgroundColor: '#fff' }}>
			{
			this.props.from == 'Address' &&
			<View style={{ marginHorizontal: 10, marginTop: 20 }}>
				<TextInput
					value={address}
					placeholder='请填写详细地址'
					onChangeText={address => {
						this.setState({
							address,
						})
					}}
					placeholderTextColor={'#BCBEC3'}
					style={[styles.limitListsInput, {
						borderRadius: 4,
						height: 42,
						borderWidth: 1,
						borderColor: '#00A6FF',
						paddingHorizontal: 15
					}]} />

				<Touch
					onPress={() => {
						address.length > 0 && this.AdressVerifie('Address')
					}}
					style={{
						height: 42,
						backgroundColor: address.length > 0 ? '#00A6FF' : '#EFEFF4',
						alignItems: 'center',
						justifyContent: 'center',
						borderRadius: 8,
						marginTop: 20
					}}>
					<Text style={{ color: address.length > 0 ? '#fff' : '#BCBEC3', fontSize: 16, fontWeight: 'bold' }}>保存</Text>
				</Touch>
			</View>
			}
			{
				this.props.from == 'IdentityCard' &&
				<View style={{ marginHorizontal: 10, marginTop: 20 }}>
					<TextInput
						value={IdentityCard}
						maxLength={18}
						placeholder='请填写身份证号码'
						onChangeText={val => {
							let IdentityCard = val
							let isIdentityCard = true
							if(!IdentityCardReg.test(IdentityCard)) {
								isIdentityCard = false
							}

							this.setState({
								IdentityCard,
								isIdentityCard,
							})
						}}
						placeholderTextColor={'#BCBEC3'}
						style={[styles.limitListsInput, {
							borderRadius: 4,
							height: 42,
							borderWidth: 1,
							borderColor: IdentityCard != '' && !isIdentityCard? '#EB2121': '#E3E3E8',
							paddingHorizontal: 15
						}]} />
						{
							IdentityCard != '' && !isIdentityCard &&
							<View style={{backgroundColor: '#FEE0E0', borderRadius: 8, paddingLeft: 15, marginTop: 10}}>
								<Text style={{color: '#EB2121', fontSize: 12, lineHeight: 40}}>身份证号码格式错误</Text>
							</View>
						}
					<Touch
						onPress={() => {
							isIdentityCard && !this.AdressVerifie('IdentityCard')
						}}
						style={{
							height: 42,
							backgroundColor: isIdentityCard? '#00A6FF' : '#EFEFF4',
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: 8,
							marginTop: 20
						}}>
							<Text style={{ color: isIdentityCard? '#fff' : '#BCBEC3', fontSize: 16, fontWeight: 'bold' }}>保存</Text>
					</Touch>
				</View>
			}
		</View>
	}

}

const mapStateToProps = state => ({
	userInfo: state.userInfo,
	maintainStatus: state.maintainStatus,
	userSetting: state.userSetting
});

export default connect(mapStateToProps)(News);

const styles = StyleSheet.create({
	topNav: {
		width: width,
		height: 50,
		backgroundColor: '#00a6ff',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	btnType: {
		backgroundColor: '#7676801F',
		borderRadius: 50,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	btnList: {
		width: 110,
		backgroundColor: '#00A6FF',
		borderRadius: 50,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	btnTxt: {
		textAlign: 'center',
		lineHeight: 32,
	},
	redIcon: {
		width: 5,
		height: 5,
		borderRadius: 5,
		backgroundColor: 'red',
		marginLeft: 10,
	},
	magTab: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		height: 35,
		width: width,
		backgroundColor: '#00a6ff',
	},
	magTabList: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 32,
		paddingLeft: 10,
		paddingRight: 10,
		borderBottomColor: '#fff',
		borderBottomWidth: 0,
	},
	messageItem: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		marginBottom: 15,
		borderRadius: 8,
		padding: 10,
		backgroundColor: '#fff',
	},
	listItem: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	iconBtn: {
		justifyContent: 'center',
		alignItems: 'center',
		width: (width - 20 - 24) / 3
	},
	managerLists: {
		flexDirection: 'row'
	},
	managerListsTouch: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		flex: 1,
		borderBottomWidth: 1,
		borderBottomColor: '#EFEFF4',
		paddingBottom: 12,
		marginBottom: 10
	},
	managerListsLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	managerListsImg: {
		width: 26,
		height: 26,
		marginRight: 12
	}
});