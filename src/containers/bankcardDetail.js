import React from 'react';
import { StyleSheet, Text, TextStyle, Image, View, ViewStyle, ScrollView, TouchableOpacity, Dimensions, WebView, Platform, FlatList, RefreshControl, Modal } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Accordion from 'react-native-collapsible/Accordion';
import { Toast, Carousel, Flex, Picker, List, Tabs, DatePicker } from 'antd-mobile-rn';
import Touch from 'react-native-touch-once';
import ModalDropdown from 'react-native-modal-dropdown';
const locatData = require('./locatData.json');
import HTMLView from 'react-native-htmlview';
import { GetDateStr } from '../utils/date'
import LivechatDragHoliday from "./LivechatDragHoliday"  //可拖動懸浮
import { connect } from "react-redux"; import moment from 'moment'
const {
	width, height
} = Dimensions.get('window')

class News extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	render() {
		const { detail } = this.props
		return (
			<View style={{ flex: 1, backgroundColor: '#EFEFF4' }}>
				<View style={{ marginHorizontal: 10, marginTop: 15, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 20 }}>
					<View>
						<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
							<Text style={{ width: 100, color: '#999999' }}>银行名称</Text>
							<Text style={{ width: width - 160, color: '#000' }}>{detail.BankName}</Text>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
							<Text style={{ width: 100, color: '#999999' }}>银行账号</Text>
							<Text style={{ width: width - 160, color: '#000' }}>*************{detail.AccountNumber && detail.AccountNumber.slice(-3)}</Text>
						</View><View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
							<Text style={{ width: 100, color: '#999999' }}>省/自治区</Text>
							<Text style={{ width: width - 160, color: '#000' }}>{detail.Province}</Text>
						</View><View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
							<Text style={{ width: 100, color: '#999999' }}>城市/城镇</Text>
							<Text style={{ width: width - 160, color: '#000' }}>{detail.City}</Text>
						</View><View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 0 }}>
							<Text style={{ width: 100, color: '#999999' }}>分行</Text>
							<Text style={{ width: width - 160, color: '#000' }}>{detail.Branch}</Text>
						</View>
					</View>
				</View>
			</View>
		)
	}
}


const mapStateToProps = state => ({
	userInfo: state.userInfo,
	maintainStatus: state.maintainStatus,
	userSetting: state.userSetting
});

export default connect(mapStateToProps)(News);



const styles = StyleSheet.create({

});