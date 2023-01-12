const { width, height } = Dimensions.get("window");
import ReactNative, {
	StyleSheet,
	Text,
	Image,
	View,
	Platform,
	ScrollView,
	Dimensions,
	TouchableOpacity,
	Linking,
	WebView,
	NativeModules,
	Alert,
	TextInput,
	ActivityIndicator,
	UIManager,
	Modal
} from "react-native";
import {
	Button,
	Progress,
	WhiteSpace,
	WingBlank,
	InputItem,
	Toast,
	Flex
} from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';
import ModalDropdown from "react-native-modal-dropdown";

import React from 'react';
import { ApiPort } from '$LIB/SPORTAPI';
class CeshiContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			province: '省',
			city: '市',
			county: '区',
			provinces: [],
			cities: [],
			counties: [],
			provinceIds: '',
			cityIds: '',
			countyIds: '',
			selectFirst: this.props.pagetype == 'add',

		};
	}

	componentDidMount() {
		if (this.props.pagetype != 'add') {
			const { province, district, town } = this.props.selectData
			this.setState({ province: province, city: district, county: town })
		}
		this.RewardUserProvince('default');
	}


	/* ---------省----------- */
	RewardUserProvince = (status) => {
		const { pagetype } = this.props
		if (pagetype == 'readOnly') { return }

		fetchRequest(ApiPort.AddressProvince, 'GET').then((res) => {
			if (res) {
				this.setState({ provinces: res.provinceList, },
					() => {
						let provinceIds = ''
						if (pagetype == 'edit') {
							const { provinceId } = res.provinceList.find(
								(item) => item.provinceName == this.state.province
							);
							provinceIds = provinceId
						} else {
							provinceIds = res.provinceList[0].provinceId
						}
						this.RewardUserDistricts(status, provinceIds)
						this.setState({ provinceIds }, () => { this.backAdress() })
					}
				);
			}
		});
	};

	/* -------------市---------- */
	RewardUserDistricts = (status, provinceId) => {
		const { pagetype } = this.props
		this.setState({ cities: [] })
		fetchRequest(ApiPort.AddressDistrict + 'provinceId=' + provinceId + '&', 'GET').then((res) => {
			if (res) {
				this.setState({ cities: res.districtList },
					() => {
						let cityIds = '', city = ''
						if (pagetype == 'edit' && status == 'default') {
							const { districtId } = res.districtList.find(
								(item) => item.districtName == this.state.city
							);
							cityIds = districtId
						} else {
							cityIds = res.districtList[0].districtId
							city = res.districtList[0].districtName
							status != 'default' && this.setState({ city })
						}
						this.RewardUserRewardTown(status, cityIds);
						this.setState({ cityIds }, () => { this.backAdress() })
					}
				);
			}
		});
	};

	/* --------------县------------- */
	RewardUserRewardTown = (status, districtId) => {
		this.setState({ counties: [] })
		const { pagetype } = this.props
		fetchRequest(ApiPort.AddressTown + 'districtId=' + districtId + '&', 'GET').then((res) => {
			if (res && res.townList) {
				this.setState({ counties: res.townList },
					() => {
						let countyIds = '', county = ''
						if (pagetype == 'edit' && status == 'default') {
							const { townId } = res.townList.find(
								(item) => item.townName == this.state.county
							);
							countyIds = townId
						} else {
							countyIds = res.townList[0].townId
							county = res.townList[0].townName
							status != 'default' && this.setState({ county })
						}
						this.setState({ countyIds }, () => { this.backAdress() })
					}
				);
			}
		});
	};

	//省份
	_dropdown_1_renderButtonText(rowData) {
		return rowData.provinceName
	}
	//省份
	_dropdown_1_renderRow(rowData, rowID, highlighted) {
		return (
			<View style={{ width: (width - 60) * 0.32, padding: 15 }}>
				<Text style={{ color: '#666' }}>
					{rowData.provinceName}
				</Text>
			</View>
		);
	}
	selectBtn1 = (key) => {
		let id = this.state.provinces[key].provinceId
		this.setState({ provinceIds: id, selectFirst: false }, () => {
			this.RewardUserDistricts('', id)
		})
	}


	//市
	_dropdown_2_renderButtonText(rowData) {
		return rowData.districtName
	}
	//市
	_dropdown_2_renderRow(rowData, rowID, highlighted) {
		return (
			<View style={{ width: (width - 60) * 0.32, padding: 15 }}>
				<Text style={{ color: '#666' }}>
					{rowData.districtName}
				</Text>
			</View>
		);
	}
	selectBtn2 = (key) => {
		let id = this.state.cities[key].districtId
		this.setState({ cityIds: id }, () => {
			this.RewardUserRewardTown('', id)
		})
	}


	//区
	_dropdown_3_renderButtonText(rowData) {
		return rowData.townName
	}
	//区
	_dropdown_3_renderRow(rowData, rowID, highlighted) {
		return (
			<View style={{ width: (width - 60) * 0.32, padding: 15 }}>
				<Text style={{ color: '#666' }}>
					{rowData.townName}
				</Text>
			</View>
		);
	}
	selectBtn3 = (key) => {
		let id = this.state.counties[key].townId
		this.setState({ countyIds: id }, () => { this.backAdress() })
	}

	backAdress() {

		this.props.AddressState({
			province: this.state.provinceIds,
			city: this.state.cityIds,
			county: this.state.countyIds,
		})
	}

	render() {
		console.log(this.state.provinces);
		const { provinces, cities, counties, province, city, county, selectFirst } = this.state;
		console.log(cities);
		let readOnly = this.props.pagetype == 'readOnly' ? true : false;
		let disables = this.props.pagetype == 'readOnly' ? true : selectFirst
		return (
			<View style={{ flex: 1 }}>
				{provinces.length > 0 ? (
					<View style={{ width: width - 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
						<View style={styles.selectView}>
							<ModalDropdown
								ref={el => (this._dropdown_1 = el)}
								defaultValue={province}
								disabled={readOnly}
								textStyle={styles.dropdown_D_text}
								dropdownStyle={styles.dropdown_DX_dropdown}
								options={provinces}
								renderButtonText={rowData =>
									this._dropdown_1_renderButtonText(rowData)
								}
								renderRow={this._dropdown_1_renderRow.bind(this)}
								onSelect={this.selectBtn1}
							/>
							<View style={{ position: 'absolute', right: 10, top: 10, zIndex: -1 }}>
								<Image resizeMode='stretch' source={require('../../../../images/down.png')} style={{ width: 16, height: 16 }} />
							</View>
						</View>

						<View style={styles.selectView}>
							{
								cities.length > 0 &&
								<ModalDropdown
									ref={el => (this._dropdown_2 = el)}
									defaultValue={city}
									disabled={disables}
									textStyle={styles.dropdown_D_text}
									dropdownStyle={styles.dropdown_DX_dropdown}
									options={cities}
									renderButtonText={rowData =>
										this._dropdown_2_renderButtonText(rowData)
									}
									renderRow={this._dropdown_2_renderRow.bind(this)}
									onSelect={this.selectBtn2}
								/>
							}
							<View style={{ position: 'absolute', right: 10, top: 10, zIndex: -1 }}>
								<Image resizeMode='stretch' source={require('../../../../images/down.png')} style={{ width: 16, height: 16 }} />
							</View>
						</View>

						<View style={styles.selectView}>
							{
								counties.length > 0 &&
								<ModalDropdown
									ref={el => (this._dropdown_3 = el)}
									defaultValue={county}
									disabled={disables}
									textStyle={styles.dropdown_D_text}
									dropdownStyle={styles.dropdown_DX_dropdown}
									options={counties}
									renderButtonText={rowData =>
										this._dropdown_3_renderButtonText(rowData)
									}
									renderRow={this._dropdown_3_renderRow.bind(this)}
									onSelect={this.selectBtn3}
								/>
							}
							<View style={{ position: 'absolute', right: 10, top: 10, zIndex: -1 }}>
								<Image resizeMode='stretch' source={require('../../../../images/down.png')} style={{ width: 16, height: 16 }} />
							</View>
						</View>
					</View>
				) : null}
			</View>
		);
	}
}

export default CeshiContainer;

const styles = StyleSheet.create({
	dropdown_D_text: {
		paddingBottom: 3,
		fontSize: 14,
		color: "#666666",
		textAlignVertical: "center",
		lineHeight: 30,
		paddingLeft: 10,
		width: (width - 60) * 0.33,
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
	selectView: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		width: (width - 60) * 0.33,
		height: 40,
		borderWidth: 1,
		borderColor: '#E3E3E8',
		borderRadius: 5,
	},
})
