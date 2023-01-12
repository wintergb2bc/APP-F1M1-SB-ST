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
	UIManager,
	Modal
} from "react-native";
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';
import React from 'react';
import { ApiPort } from '$LIB/SPORTAPI';
/* --------优惠列表--------*/
import Promotions from './Promotions';
/* ----------返水----------*/
import PromotionsRebate from './PromotionsRebate';
// /* --------每日好礼--------*/
import PromotionsEverydayGift from './PromotionsEverydayGift';
// /* --------我的优惠--------*/
import PromotionsMy from './PromotionsMy';
class PromoTab extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activetab: 0,
			ScrollTop: false,
			Promotionsdata: ''
		};
	}

	componentDidMount() {

		/*------------------ 获取本地优惠，加快访问速度 ----------------- */
		let Promotionsdata = JSON.parse(localStorage.getItem('Promotionsdata'));
		if (Promotionsdata) {
			this.setState({
				Promotionsdata: Promotionsdata
			});
		}
		this.Promotions();
	}

	/**
	 * @description: 获取优惠数据
	 * @return {*} 优惠列表
	*/

	Promotions = () => {
		// fetchRequest(ApiPort.GetPromotions + 'promoCategory=SPORT&eventCategoryType=Euro2021&', 'GET')
		fetchRequest(ApiPort.GetPromotions + 'promoCategory=SPORT&', 'GET')
			.then((res) => {
				if (res && res.length) {
					this.setState({
						Promotionsdata: res
					});
					localStorage.setItem('Promotionsdata', JSON.stringify(res));
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	piwikClick(key) {
		if(key == 0) PiwikEvent('Promo Nav', 'View​', 'Promo_EUROPage')
		if(key == 1) PiwikEvent('Promo History​​', 'View​', 'MyPromo_EUROPage')
		if(key == 2) PiwikEvent('Promo Nav', 'View​', 'Rebate_EUROPage')
		if(key == 3) PiwikEvent('Promo Nav', 'View​', 'DailyDeal')
	}

	render() {
		const { activetab, Promotionsdata, ScrollTop } = this.state;

		window.PromotionsMyType = () => {
			this.setState({ activetab: 1 });
			this.Promotions();
		}
		
		return (
			<View style={{flex: 1,}}>
				<View style={styles.headerNav}>
					<View style={{width: 30, height: 30}} />
					<Text style={{color: '#fff', fontSize: 16}}>优惠</Text>
					<Touch onPress={() => {LiveChatOpenGlobe()}} style={{width: 30,height: 25}}>
						<View>
							<Image source={require('.././../../images/cs.png')} style={{ width: 26, height: 26 }} />
						</View>
					</Touch>
				</View>

				<View style={styles.tabsView}>
					{/* {['优惠', '我的优惠', '返水', '每日好礼'].map((name, index) => { */}
					{['优惠', '我的优惠', '返水'].map((name, index) => {
						return (
							<Touch
								style={[activetab == index ? styles.activetab : styles.tabs]}
								key={index}
								onPress={() => {
									this.setState({
										activetab: index
									});
									this.piwikClick(index)
									this.Promotions();
								}}
							>
								<Text style={[styles.tabTxt, {color: activetab == index? '#fff': '#CCEDFF'}]}>{name}</Text>
							</Touch>
						);
					})}
				</View>
				<ScrollView
					onScroll={(e) => {
						let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
						if(offsetY > 80 && !ScrollTop) {
							this.setState({ScrollTop: true})
						}
						if(offsetY < 80 && ScrollTop) {
							this.setState({ScrollTop: false})
						}
					}}
					scrollEventThrottle={16}
					ref={res => { this._ScrollTop = res}}
				>
					{/* ------------------优惠----------------- */}
					{activetab == 0 && <Promotions Promotionsdata={Promotionsdata} />}
					{/* ----------------我的优惠-------------- */}
					{activetab == 1 && (
						<PromotionsMy
							Promotionsdata={Promotionsdata}
							Promotions={() => {
								this.Promotions();
							}}
						/>
					)}
					{/* ----------------返水--------------------*/}
					{activetab == 2 && <PromotionsRebate />}
					{/* -----------------每日好礼-------------- */}
					{/* {activetab == 3 && <PromotionsEverydayGift />} */}
				</ScrollView>
				{
					ScrollTop &&
					<View style={styles.goTop}>
						<Touch onPress={() => {
							this._ScrollTop && this._ScrollTop.scrollTo({ x: 0, y: 0 })
							this.setState({ScrollTop: false})
						}}>
							<Image resizeMode='stretch' source={require('../../../images/goTop.png')} style={{width: 80,height: 80}} />
						</Touch>
					</View>
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	goTop: {
		position: 'absolute',
		bottom: 20,
		zIndex: 9999,
		right: 0,
	},
	headerNav: {
		display: 'flex',
		justifyContent: 'space-between',
		width: width,
		height: 50,
		backgroundColor: '#00A6FF',
		flexDirection:  'row',
		alignItems: 'center'
	},
	tabTxt: {
		lineHeight: 38,
		textAlign: 'center',
	},
	tabs: {
		width: width / 4,
		borderBottomWidth: 3,
		borderBottomColor: 'transparent',

	},
	activetab: {
		width: width / 4,
		borderBottomWidth: 4,
		borderBottomColor: '#fff',
		
	},
	tabsView: {
		width: width,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#00A6FF'
	}
})

export default PromoTab;
