import React from 'react';
import { StyleSheet, Text, TextStyle, Image, View, ViewStyle, ScrollView, TouchableOpacity, Dimensions, WebView, Platform, FlatList, RefreshControl, Modal, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Accordion from 'react-native-collapsible/Accordion';
import { Toast, Carousel, Flex, Picker, List, Tabs, DatePicker } from 'antd-mobile-rn';
import Touch from 'react-native-touch-once';
import ModalDropdown from 'react-native-modal-dropdown';
const locatData = require('./locatData.json');
import HTMLView from 'react-native-htmlview';
import { GetDateStr } from '../utils/date'
import LivechatDragHoliday from "./LivechatDragHoliday"  //可拖動懸浮
import { connect } from "react-redux";
import { nameTest } from '../actions/Reg'
import moment from 'moment'
const {
	width, height
} = Dimensions.get('window')
import ListItems from 'antd-mobile-rn/lib/list/style/index.native'
const newStyle = {}
for (const key in ListItems) {
	if (Object.prototype.hasOwnProperty.call(ListItems, key)) {
		newStyle[key] = { ...StyleSheet.flatten(ListItems[key]) }
		if (key == 'Item') {
			newStyle[key].paddingLeft = 0
			newStyle[key].paddingRight = 0
			newStyle[key].height = 40
			newStyle[key].width = width - 20
			newStyle[key].overflow = 'hidden'
		}
		newStyle[key].color = 'transparent'
		newStyle[key].fontSize = -999
		newStyle[key].backgroundColor = 'transparent'
		newStyle[key].borderRadius = 4
	}
}
const ListItemstyles = newStyle

locatData.forEach(item => {
	item.value = item.label;
	item.children.forEach((val) => {
		val.value = val.label;
		val.children.forEach((v) => {
			v.value = v.label;
		})
	})
});

const DatePickerLocale = {
	DatePickerLocale: {
		year: '年',
		month: '月',
		day: '日',
		hour: '',
		minute: ''
	},
	okText: '确定',
	dismissText: '取消'
}

class News extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			FirstName: '',
			isFirstName: false,
			isName: true,

			DOB: '',
			isDOB: false,

			IdentityCard: '',//身份证号码

			City: '',
			isCity: '',

			Country: '',
			isCountry: false,


			Address: '',
			isAddress: false,


			phone: '',
			phoneStatus: true,
			email: '',
			emailStatus: true,


			countryData: [],
			countryDataName: '',
			isHaveCountry: false,
			NationId: '',
			isAllowClink: false,

			memberInfor: '',
		}
	}

	componentWillMount(props) {
		this.getUser()
		this.getProfileMasterCountryData()
	}

	componentWillUnmount() {
		//已验证手机，去存款call api是否需要再验证
		this.props.checkCustomFlag && this.props.checkCustomFlag()
	}


	getProfileMasterCountryData() {
		global.storage.load({
			key: 'countryData',
			id: 'countryData'
		}).then(countryData => {
			this.setState({
				countryData
			})
		}).catch(() => { })
		fetchRequest(window.ApiPort.GetProfileMasterData + 'category=nations&', 'GET').then(res => {
			if (res.isSuccess) {
				res.result.forEach(v => {
					v.value = v.localizedName
					v.label = v.localizedName
				})
				this.setState({
					countryData: res.result
				})
				global.storage.save({
					key: 'countryData',
					id: 'countryData',
					data: res.result,
					expires: null
				})
			}
		}).catch(err => {
			Toast.hide()
		})
	}

	getUser(key = '') {
		Toast.loading('加载中....', 2000)
		fetchRequest(window.ApiPort.Member, 'GET')
			.then(data => {
				Toast.hide()
				if (data.isSuccess) {
					let memberInfor = data.result.memberInfo
					let contacts = memberInfor.Contacts
					localStorage.setItem('memberInfo', JSON.stringify(memberInfor));
					if (memberInfor && contacts && contacts.length) {
						let tempEmail = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'email')
						let emailStatus = tempEmail ? (tempEmail.Status.toLocaleLowerCase() === 'unverified' ? true : false) : true
						let email = tempEmail ? tempEmail.Contact : ''
						let tempPhone = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'phone')
						let phoneStatus = tempPhone ? (tempPhone.Status.toLocaleLowerCase() === 'unverified' ? true : false) : true
						let phone = tempPhone ? tempPhone.Contact : ''
						this.setState({
							memberInfor,
							phone,
							email,
							emailStatus,
							phoneStatus,
							memberCode: memberInfor.MemberCode
						})
					}
					if(key == 'IdentityCard') {
						this.setState({IdentityCard: memberInfor.IdentityCard? memberInfor.IdentityCard :''})
						return
					}
					if(key == 'Address') {
						this.setState({
							Address: memberInfor.Address.Address,
							isAddress: Boolean(memberInfor.Address.Address),
						})
						return
					}
					this.setState({
						IdentityCard: memberInfor.IdentityCard? memberInfor.IdentityCard :'',
						FirstName: memberInfor.FirstName,
						isFirstName: memberInfor.FirstName.length > 0,


						DOB: (memberInfor.DOB || '').toLocaleUpperCase().split('T')[0],
						isDOB: Boolean(memberInfor.DOB),

						City: memberInfor.Address.City,
						isCity: Boolean(memberInfor.Address.City),

						Address: memberInfor.Address.Address,
						isAddress: Boolean(memberInfor.Address.Address),


						isHaveCountry: Boolean(memberInfor.Address.Country),
						NationId: memberInfor.Address.NationId,

						isAllowClink: memberInfor.FirstName.length > 0 && Boolean(memberInfor.DOB) && Boolean(memberInfor.Address.City) && Boolean(memberInfor.Address.Country)
					})
				}
			})
	}

	submitMemberInfor() {
		const { FirstName, isFirstName, DOB, isDOB, City, isCity, countryData, Address, countryDataName, isHaveCountry, NationId, isName } = this.state

		if (!isFirstName) {
			if (!FirstName) {
				Toasts.fail('请输入真实姓名')
				return
			}
		}
		if (!isName) {
			Toasts.fail('姓名格式错误')
			return
		}

		if (!isDOB) {
			if (!DOB) {
				Toasts.fail('请选择出生日期')
				return
			}
		}

		if (!isCity) {
			if (!City) {
				Toasts.fail('请选择省市/自治市')
				return
			}
		}

		if (!isHaveCountry) {
			if (!countryDataName) {
				Toasts.fail('请选择国家')
				return
			}
		}

		const params = {
			wallet: "MAIN",
			addresses: {
				address: Address,
				city: City,
				country: isHaveCountry ?  countryData[NationId- 1].localizedName : countryDataName,
				nationId: isHaveCountry ? NationId : (countryData.find(v => v.localizedName == countryDataName) || {id: 1}).id
			},
			dob: DOB,
			firstName: FirstName
		};


		Toast.loading('加载中,请稍候...', 2000)
		fetchRequest(window.ApiPort.Member, 'PUT', params).then(res => {
			Toast.hide()
			if (res.isSuccess) {
				Toasts.success(res.message, 2)
				// this.setState({
				//     question: ''
				// })

				this.getUser()
			} else {
				Toasts.fail(res.message)


			}
		}).catch(err => {
			Toast.hide()
		})
	}

	render() {

		const {
			FirstName, isFirstName, DOB, isDOB, City, isCity, Country, isCountry, Address, isAddress, isAllowClink,
			isHaveCountry,
			NationId,
			phone,
			email,
			IdentityCard,
			emailStatus,
			phoneStatus,
			isName,
			countryData,
			countryDataName,
		} = this.state;
		return <View style={{ flex: 1, backgroundColor: '#EFEFF4' }}>
			<ScrollView>
				<View style={{ marginHorizontal: 10, marginTop: 20 }}>
					<View style={{
						backgroundColor: '#fff',
						borderRadius: 6, padding: 12, paddingVertical: 20, paddingRight: 25
					}}>
						<Text style={{ fontWeight: 'bold', color: '#333333', fontSize: 16, height: 30 }}>基本资料</Text>

						<View style={{ flexDirection: 'row', height: 40, marginLeft: 15, alignItems: 'center' }}>
							<Text style={{ color: '#999999', width: 90 }}>真实姓名</Text>
							{
								isFirstName && 
								<TextInput
									value={FirstName.replace(/./g,'*')}
									style={{ width: width - 160, height: 40 }}
									editable={true}
								></TextInput>
							}
							{
							!isFirstName &&
							<TextInput
								value={FirstName}
								onChangeText={val => {
									let FirstName = val
									let isName = false
									if (nameTest.test(FirstName)) {
										isName = true
									}
							
									this.setState({
										FirstName,
										isName,
									})
								}}
								style={{ width: width - 160, height: 40 }}
								editable={!isFirstName}
							></TextInput>
							}
						</View>

						{
							!isName &&
							<View style={styles.errView}>
								<Text style={{ color: '#EB2121', fontSize: 12, lineHeight: 35 }}>格式不正确</Text>
							</View>
						}

						<View style={{ flexDirection: 'row', height: 40, marginLeft: 15, alignItems: 'center' }}>
							<Text style={{ color: '#999999', width: 90 }}>出生日期</Text>
							<Text style={[styles.birthdayDate, { color: '#000' }]}>
								{
									// (DOB.length > 0 && moment(DOB).format('YYYY年MM月DD日'))
									DOB != '' &&  moment(DOB).format('YYYY年MM月DD日').slice(0,2) + '**年**月**日'
								}
							</Text>


							{
								!isDOB && <DatePicker
									minDate={new Date(1930, 1, 1)}
									maxDate={new Date(moment(new Date()).subtract(21, 'year'))}
									mode='date'
									onChange={DOB => {
										this.setState({
											DOB: moment(DOB).format('YYYY-MM-DD')
										})
									}}
									format='YYYY-MM-DD'
									locale={DatePickerLocale}
								>
									<List.Item styles={StyleSheet.create(ListItemstyles)}>
										<View style={[styles.limitListsInput, {
											flexDirection: 'row',
											justifyContent: 'space-between', alignItems: 'center'
										}]}>
										</View>
									</List.Item>
								</DatePicker>

							}
							{
								!isDOB && <Text style={{ backgroundColor: 'grren', position: 'absolute', right: 0, color: '#999999' }}>></Text>
							}
						</View>
						<View style={{ flexDirection: 'row', height: 40, marginLeft: 15, alignItems: 'center' }}>
							<Text style={{ color: '#999999', width: 90 }}>身份证号码</Text>
							<Text style={{ color: '#000' }}>{IdentityCard != '' && '************' + IdentityCard.slice(-6)}</Text>
							{
								IdentityCard == '' &&
								<Touch onPress={() => { Actions.useraddress({from: 'IdentityCard', getUser: () => { this.getUser('IdentityCard') }}) }} style={{ position: 'absolute', right: 0, color: '#999999' }}>
									<Text style={{ color: '#999999' }}>填写  ></Text>
								</Touch>
							}
						</View>
					</View>



					<View style={{
						backgroundColor: '#fff', marginTop: 15, paddingRight: 25,
						borderRadius: 6, padding: 12, paddingVertical: 20
					}}>
						<Text style={{ fontWeight: 'bold', color: '#333333', fontSize: 16, height: 30, }}>联系资料</Text>

						<View style={{
							flexDirection: 'row', height: 40,
							alignItems: 'center', justifyContent: 'space-between',
						}}>
							<View style={{ flexDirection: 'row', marginLeft: 15, }}>
								<Text style={{ color: '#999999', width: 90, }}>电子邮箱</Text>
								<Text style={{ width: 120, overflow: 'hidden' }}>{email && `******${email.split('@')[0].slice(-3)}@${email.split('@')[1]}`}</Text>

							</View>

							{
								emailStatus ?
									<TouchableOpacity onPress={() => {
										Actions.Verification({
											dataPhone: this.state.phone,
											dataEmail: this.state.email,
											verificaType: 'email',
											memberCode: this.state.memberCode,
											noMoreverifcation: false,
											getUser: () => {
												this.getUser()
											}
										})

										PiwikEvent('Verification', 'Click', 'Verify_Email_ProfilePage')
									}} style={{
										height: 30, backgroundColor: '#00A6FF', borderRadius: 6,
										justifyContent: 'center', paddingHorizontal: 8
									}}>
										<Text style={{ color: '#fff' }}>立即验证</Text>
									</TouchableOpacity>
									:
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<View style={{
											backgroundColor: '#0CCC3C', width: 18, height: 18, borderRadius: 1000,
											marginRight: 5,
											alignItems: 'center', justifyContent: 'center'
										}}>
											<Text style={{ color: '#fff' }}>✓</Text>
										</View>
										<Text style={{ color: '#0CCC3C' }}>已验证</Text>
									</View>
							}
						</View>


						<View style={{
							flexDirection: 'row', height: 40,
							alignItems: 'center', justifyContent: 'space-between',
						}}>
							<View style={{ flexDirection: 'row', marginLeft: 15, }}>
								<Text style={{ color: '#999999', width: 90 }}>手机号码</Text>
								<Text>{`******${phone.slice(-4)}`}</Text>
							</View>

							{
								phoneStatus ?
									<TouchableOpacity
										onPress={() => {
											Actions.Verification({
												dataPhone: this.state.phone,
												dataEmail: this.state.email,
												verificaType: 'phone',
												memberCode: this.state.memberCode,
												noMoreverifcation: false,
												getUser: () => {
													this.getUser()
												}
											})
											PiwikEvent('Verification', 'Click', 'Verify_Phone_ProfilePage')
										}}
										style={{
											height: 30, backgroundColor: '#00A6FF', borderRadius: 6,
											justifyContent: 'center', paddingHorizontal: 8
										}}>
										<Text style={{ color: '#fff' }}>立即验证</Text>
									</TouchableOpacity>
									:
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<View style={{
											backgroundColor: '#0CCC3C', width: 18, height: 18, borderRadius: 1000,
											marginRight: 5,
											alignItems: 'center', justifyContent: 'center'
										}}>
											<Text style={{ color: '#fff' }}>✓</Text>
										</View>
										<Text style={{ color: '#0CCC3C' }}>已验证</Text>
									</View>
							}
						</View>

						<TouchableOpacity
							onPress={() => {
								!isAddress && Actions.useraddress({
									from: 'Address',
									getUser: () => {
										this.getUser('Address')
									}
								})
							}}
							style={{
								flexDirection: 'row', height: 40,
								alignItems: 'center', justifyContent: 'space-between',
							}}>
							<View style={{ flexDirection: 'row', marginLeft: 15, }}>
								<Text style={{ color: '#999999', width: 90 }}>联系地址</Text>
								{
									Address.length > 0 && <Text>{Address}</Text>
								}

							</View>
							{
								!isAddress && <Text style={{ backgroundColor: 'grren', position: 'absolute', right: 0, color: '#999999' }}>></Text>
							}

						</TouchableOpacity>



						<View style={{
							flexDirection: 'row', height: 40,
							alignItems: 'center', justifyContent: 'space-between',
						}}>
							<View style={{ flexDirection: 'row', marginLeft: 15, }}>
								<Text style={{ color: '#999999', width: 90 }}>省市/自治市</Text>
								<Text style={[styles.birthdayDate, { color: '#000', width: width - 200 }]}>{City}</Text>
							</View>

							{
								!isCity && <Picker
									title='选择地区'
									onChange={value => {
										console.log(value.join(' '))

										this.setState({
											City: value.join(' ')
										})
									}}
									data={locatData}
									cols={3}
								>
									<List.Item styles={StyleSheet.create(ListItemstyles)}>
										<View style={[styles.limitListsInput, {
											flexDirection: 'row',
											justifyContent: 'space-between', alignItems: 'center'
										}]}>
										</View>
									</List.Item>
								</Picker>
							}
							{
								!isCity && <Text style={{ backgroundColor: 'grren', position: 'absolute', right: 0, color: '#999999' }}>></Text>
							}

						</View>


						{
							Array.isArray(countryData) && countryData.length > 0 && <View
								style={{
									flexDirection: 'row', height: 40,
									alignItems: 'center', justifyContent: 'space-between',
								}}>
								<View style={{ flexDirection: 'row', marginLeft: 15, }}>
									<Text style={{ color: '#999999', width: 90 }}>国家</Text>
									{
										<Text style={[styles.birthdayDate, { color: '#000' }]}>{
											isHaveCountry ? countryData[NationId - 1].localizedName : countryDataName
										}</Text>
									}
								</View>

								{
									!isHaveCountry && <Picker
										onChange={countryDataName => {
											this.setState({
												countryDataName: countryDataName.join('')
											})
										}}
										data={countryData}
										cols={1}
									>
										<List.Item styles={StyleSheet.create(ListItemstyles)}>
											<View style={[styles.limitListsInput, {
												flexDirection: 'row',

												justifyContent: 'space-between', alignItems: 'center'
											}]}>
											</View>
										</List.Item>
									</Picker>
								}

								{
									!isHaveCountry && <Text style={{ backgroundColor: 'grren', position: 'absolute', right: 0, color: '#999999' }}>></Text>
								}
							</View>
						}
					</View>


					{
						!isAllowClink && <TouchableOpacity
							onPress={this.submitMemberInfor.bind(this)}
							style={{ backgroundColor: isName?'#00A6FF' :'#E2E2E8', height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 6, marginTop: 30 }}>
							<Text style={{ color: isName?'#fff': '#ccc' }}>保存</Text>
						</TouchableOpacity>
					}


				</View>
			</ScrollView>
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
	errView: {
        backgroundColor: '#FEE0E0',
        borderRadius: 8,
        paddingLeft: 15,
        marginTop: 10,
    },
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