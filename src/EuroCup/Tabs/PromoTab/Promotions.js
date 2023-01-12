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
	ActivityIndicator,
	NativeModules,
	Alert,
	UIManager,
	Modal
} from "react-native";
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';
import React from 'react';
class Promotions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activetab: 0,
			Promotionsdata: ''
		};
	}

	render() {
		const { Promotionsdata } = this.props;

		return (
			<View style={{ flex: 1, paddingBottom: 25 }}>
				<View>
					{Promotionsdata != '' ? (
						Promotionsdata.map((data, index) => {
							return (
								(data.type == 'Bonus' || data.type == 'Manual' || data.type == 'Other') && (data.status == 'Eligible' || data.status == 'Available' || data.status == 'Serving' || data.status == 'Release' || data.status == '' )  &&
								<Touch
									style={styles.list}
									key={index}
									onPress={() => {
										PiwikEvent('Promo Nav', 'View​', `PromoTnC_(${data.contentId})`)
										Actions.PromotionsDetail({ Detail: data })
										// Router.push(
										// 	{
										// 		pathname: `/promotions/[details]?id=${data.contentId}`,
										// 		query: { details: 'promodetail', id: data.contentId }
										// 	},
										// 	`/promotions/promodetail?id=${data.contentId}`
										// );
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
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	list: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width,
		marginTop: 12,
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
})

export default Promotions;
