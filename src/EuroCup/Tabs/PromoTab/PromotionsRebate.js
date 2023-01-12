
const { width, height } = Dimensions.get("window");
import CalendarPicker from 'react-native-calendar-picker';
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
import React from 'react';
import moment from 'moment';
import { ApiPort } from '$LIB/SPORTAPI';
// import DateRange from '@/DateRange/';
const minDate = [new Date(new Date().getTime() - 7257600000), new Date(new Date().getTime() - 7257600000)];
const maxDate = [new Date(), new Date()];
/* 最近30天 */
let Last30days = new Date(moment(new Date()).subtract(1, 'months').format('YYYY/MM/DD HH:mm:ss'));
/* 今天 */
let Today = new Date();
class PromotionsRebate extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activetab: 0,
			dateRangeVisible: false,
			DateFrom: Last30days,
			DateTo: Today,
			active: true,
			isLogin: false,
			Rebatedata: '',
			Loading: true,
			rebatepromotion: [],
			ActiveTime: false
		};
	}

	componentWillMount() {
		if (localStorage.getItem('loginStatus') != 1) {
			//获取未登录反水
			this.RebateList()
		} else {
			this.setState({ isLogin: true })
			this.PromotionsRebate();
		}
	}

	RebateList = () => {
		// let query = `promoCategory=SPORT&promoSecondType=rebatepromotion&eventCategoryType=Euro2021&`;
		let query = `promoCategory=SPORT&promoSecondType=rebatepromotion&`;
		this.setState({
			Loading: true
		});
		fetchRequest(ApiPort.GetPromotions + query, 'GET')
			.then((res) => {
				console.log(res);
				if (res && res.length) {
					this.setState({
						rebatepromotion: res
					});
				}
				this.setState({
					Loading: false
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	/**
	 * @description: 获取优惠返水的数据
	*/
	PromotionsRebate = () => {
		const { DateFrom, DateTo } = this.state;
		/* ---------------------开始时间------------------------ */
		let From = moment(DateFrom).format('YYYY-MM-DD HH:mm:ss');
		/* ---------------------结束时间------------------------ */
		let To = moment(DateTo).format('YYYY-MM-DD HH:mm:ss');
		// let query = `promoCategory=SPORT&promoSecondType=rebatepromotion&eventCategoryType=Euro2021&DateFrom=${From}&DateTo=${To}&`;
		let query = `promoCategory=SPORT&promoSecondType=rebatepromotion&DateFrom=${From}&DateTo=${To}&`;
		this.setState({
			dateRangeVisible: false,
			Loading: true
		});
		fetchRequest(ApiPort.GetPromotions + query, 'GET')
			.then((res) => {
				if (res && res.length) {
					this.setState({
						Rebatedata: res
					});
					localStorage.setItem('Rebatedata', JSON.stringify(res));
				}
				this.setState({
					Loading: false
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	onDateChange = (date, type) => {
		if (type === 'END_DATE') {
			this.setState({
				DateTo: date,
			});
		} else {
			this.setState({
				DateFrom: date,
			});
		}
	}

	render() {
		const { dateRangeVisible, DateFrom, DateTo, active, Rebatedata, Loading, ActiveTime, isLogin, rebatepromotion } = this.state;
		const startDate = DateFrom ? DateFrom.toString() : '';
		const endDate = DateTo ? DateTo.toString() : '';
		return !isLogin ? (<View style={{ flex: 1, paddingBottom: 25 }}>
			{rebatepromotion && rebatepromotion.length > 0 ? (
				rebatepromotion.map((data, index) => {
					return (
						<Touch
							style={styles.list}
							key={index}
							onPress={() => {

								Actions.PromotionsDetail({ Detail: data })
							}}
						>
							<Image style={{ width: width * 0.92, height: width * 0.92 * 0.38 }} source={{ uri: data.thumbnailMobileImage || '' }} defaultSource={require('../../../images/euroCup/bg2.jpg')} />
						</Touch>
					);
				})
			) :
				(
					[...Array(3)].map((i, k) => {
						return <View style={styles.loding} key={k} >
							<View style={styles.lodingView}><ActivityIndicator color="#fff" /></View>
						</View>;
					})
				)

			}
		</View>) : (
			<View style={{ flex: 1, paddingBottom: 25 }}>
				<View style={styles.Menu}>
					<Text style={{ color: '#666666', fontSize: 12, }}>
						总得返水: ￥{Rebatedata != '' ? Rebatedata[0].memberPromotionRebateViewData.totalPayout : 0}
					</Text>
					<View style={styles.dateView}>
						<Touch
							style={[!ActiveTime ? styles.activeDate : styles.noActiveDate]}
							onPress={() => {
								this.setState(
									{
										active: true,
										DateFrom: Last30days,
										DateTo: Today
									},
									() => {
										this.PromotionsRebate();
									}
								);
							}}

						>
							<Text style={{ color: !ActiveTime ? '#00A6FF' : '#666666', fontSize: 12 }}>近30天</Text>
						</Touch>
						<Touch
							style={[ActiveTime ? styles.activeDate : styles.noActiveDate]}
							onPress={() => {
								this.setState({
									dateRangeVisible: true,
									active: false
								});
							}}
						>
							<Text style={{ color: ActiveTime ? '#00A6FF' : '#666666', fontSize: 12, paddingRight: 8, }}>
								{ActiveTime ? (
									`${moment(DateFrom).format('MM/DD')}至${moment(DateTo).format('MM/DD')}`
								) : (
									'日期'
								)}
							</Text>
							<Image style={{ width: 13, height: 13 }} source={ActiveTime ? require('../../../images/euroCup/calendar.png') : require('../../../images/euroCup/calendarW.png')} />
						</Touch>
					</View>

					{/* 日期范围 */}
					{/* <DateRange
						dateRangeVisible={dateRangeVisible}
						onClose={(type) => {
							this.setState({ dateRangeVisible: false }, () => {
								if (type == '确认') {
									this.PromotionsRebate();
								}
							});
						}}
						onChange={(time) => {
							this.setState({
								DateFrom: time[0],
								DateTo: time[1],
								ActiveTime: true
							});
						}}
						value={[ DateFrom, DateTo ]}
						note={'搜索时间范围为30天内，并可搜索90天之内的返水记录。'}
					/> */}
				</View>

				{Rebatedata != '' && !Loading ? (
					Rebatedata.map((data, index) => {
						const { rebatesSummary } = data.memberPromotionRebateViewData;
						let Nulldata = rebatesSummary.length == 0;
						let memberCategory = !Nulldata ? rebatesSummary[0].memberCategory : 'Normal';
						let totalTurnover = !Nulldata ? rebatesSummary[0].totalTurnover : '-';
						let totalRebateAmount = !Nulldata ? '￥' + rebatesSummary[0].totalRebateAmount : '-';

						return (
							<View style={styles.Content} key={index}>
								<Image style={{ width: 80, height: 80 }} source={{ uri: data.thumbnailMobileImage || '' }} />
								<View style={styles.ContentRight}>
									<View style={styles.lists}>
										<Text style={styles.listTxt}>会员等级</Text>
										<Text style={styles.listTxt}>{memberCategory == 'Normal' ? '普通会员' : 'VIP会员'}</Text>
									</View>
									<View style={styles.lists}>
										<Text style={styles.listTxt}>30天内所达流水</Text>
										<Text style={styles.listTxt}>{totalTurnover == '' ? '-' : totalTurnover}</Text>
									</View>
									<View style={styles.lists}>
										<Text style={styles.listTxt}>30天内所得返水</Text>
										<Text style={styles.listTxt}>{totalRebateAmount == '' ? '-' : totalRebateAmount}</Text>
									</View>
									{!Nulldata ? (
										<Touch
											style={styles.goDetaile}
											onPress={() => {
												PiwikEvent('Promo History', 'View', `RebateRecord_EUROPage`)
												Actions.PromoRebateHistory({ contentId: data.contentId })
												// Router.push(
												// 	{
												// 		pathname: `/promotions/[details]?id=${data.contentId}`,
												// 		query: { details: 'rebatehistory', id: data.contentId }
												// 	},
												// 	`/promotions/rebatehistory?id=${data.contentId}`
												// );
											}}
										>
											<Text style={{ fontSize: 12, color: '#00A6FF' }}>查看历史</Text>
										</Touch>
									) : (
										<View style={styles.naData}>
											<Text style={{ fontSize: 12, color: '#BCBEC3' }}>暂时无记录，快开始投注吧！</Text>
										</View>
									)}
								</View>
							</View>
						);
					})
				) : Loading ? (
					[...Array(3)].map((i, k) => {
						return <View style={styles.loding} key={k} >
							<View style={styles.lodingView}><ActivityIndicator color="#fff" /></View>
						</View>;
					})
				) : (
					<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
						<Image style={{ width: 68, height: 68 }} source={require('../../../images/euroCup/nodata.png')} />
						<Text style={{ color: '#999999', lineHeight: 30 }}>暂无数据</Text>
					</View>
				)}


				<Modal transparent={true} animationType={'slide'} visible={this.state.dateRangeVisible} onRequestClose={() => { }}>
					<View style={{ width, height, position: 'relative' }}>
						<View style={{ flex: 1 }}>
							<TouchableOpacity onPress={() => this.setState({ dateRangeVisible: false })}>
								<View style={{ position: 'absolute', width, height, top: 0, left: 0, backgroundColor: 'rgba(0,0,0,.5)' }} />
							</TouchableOpacity>
						</View>

						<View style={{ flex: 1.4, justifyContent: 'flex-end', paddingBottom: 35, backgroundColor: '#fff' }}>
							<View style={{ width: width, backgroundColor: '#fff', marginTop: 15, }}>
								<View style={styles.mass}>
									<Text style={{ color: '#83630B', fontSize: 12 }}>搜索时间范围为30天内，并可搜索90天之内的返水记录。</Text>
								</View>
							</View>
							<View style={{ paddingTop: 10, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
								<View style={{ flex: 1, left: 18 }}>
									<TouchableOpacity onPress={() => this.setState({ dateRangeVisible: false })}>
										<Text style={{ color: '#00a6ff' }}>关闭</Text>
									</TouchableOpacity>
								</View>

								<View style={{ flex: 1 }}><Text>选择日期</Text></View>
								<View style={{ flex: 0.3 }}>
									<TouchableOpacity onPress={() => { this.PromotionsRebate(); this.setState({ ActiveTime: true }) }}>
										<Text style={{ color: '#00a6ff' }}>确认</Text>
									</TouchableOpacity>
								</View>
							</View>

							<View style={{ paddingTop: 20, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
								<View style={styles.textDateA}>
									<Text style={{ color: '#00a6ff', flex: 0.9, paddingLeft: 10 }}>从</Text>
									<Text style={{ color: '#00a6ff' }}>{moment(startDate).format('YYYY-MM-DD')} </Text>
								</View>

								<View style={{ width: 20 }}></View>
								<View style={styles.textDateB}>
									<Text style={{ color: '#000', flex: 0.9, paddingLeft: 10 }}>至</Text>
									<Text style={{ color: '#000' }}>{moment(endDate || (new Date())).format('YYYY-MM-DD')} </Text>
								</View>

							</View>

							<View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
								<CalendarPicker
									startFromMonday={true}
									allowRangeSelection={true}
									minDate={moment(minDate[0]).format('YYYY-MM-DD')}
									maxDate={moment(maxDate[0]).format('YYYY-MM-DD')}
									weekdays={['一', '二', '三', '四', '五', '六', '日']}
									months={['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一', '十二']}
									previousTitle="<"
									nextTitle=">"
									selectedDayColor="#00a6ff"
									selectedDayTextColor="#fff"
									scaleFactor={375}
									textStyle={{
										fontFamily: 'Cochin',
										color: '#000000',
									}}
									onDateChange={this.onDateChange}
								/>


							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	mass: {
		backgroundColor: '#FFF5BF',
		width: width - 30,
		borderRadius: 10,
		padding: 10,
		marginLeft: 15,
	},
	loding: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width,
		marginTop: 12,
	},
	lodingView: {
		width: width * 0.92,
		height: width * 0.92 * 0.38,
		backgroundColor: '#00000033',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	Menu: {
		width: width,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		padding: 15,
	},
	activeDate: {
		borderWidth: 1,
		borderColor: '#00A6FF',
		borderRadius: 50,
		padding: 7,
		paddingLeft: 12,
		paddingRight: 12,
		marginLeft: 10,
		marginLeft: 10,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	noActiveDate: {
		borderWidth: 1,
		borderColor: '#666666',
		borderRadius: 50,
		padding: 7,
		paddingLeft: 12,
		paddingRight: 12,
		marginLeft: 10,
		marginLeft: 10,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	dateView: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	Content: {
		width: width - 30,
		marginLeft: 15,
		borderRadius: 10,
		padding: 15,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#fff',
		marginTop: 15,
	},
	ContentRight: {
		paddingLeft: 12,
	},
	lists: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
	},
	listTxt: {
		width: width * 0.3,
		color: '#000',
		fontSize: 12,
		lineHeight: 25,
	},
	naData: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#EFEFF4',
		borderRadius: 5,
		width: width * 0.6,
		height: 38,
	},
	goDetaile: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: '#00A6FF',
		borderWidth: 1,
		borderRadius: 5,
		width: width * 0.6,
		height: 36,
	},



	list: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width,
		marginTop: 12,
	},

})

export default PromotionsRebate;
