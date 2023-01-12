import React from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity, Dimensions, Image } from 'react-native'
import { Toast } from 'antd-mobile-rn'
import Touch from "react-native-touch-once";
import { Actions } from 'react-native-router-flux';
const { width, height } = Dimensions.get('window')

/* 提款确认到账弹窗 */
class AbleCompleteFromUIPop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rebateAmountPopMsg: '额外奖励错误',
            rebateAmountPop: '',
        }

    }

    componentDidMount() { }

    componentWillUnmount() { }

    //存款确认到账
    IsAbleCompleteFromUI() {
        const { AbleCompleteFromData } = this.props
        this.props.PopChange()
        PiwikEvent('Transaction_Record', 'Submit', 'Receive_SmallRiver_Withdrawal')

        Toast.loading('确认中,请稍候...', 20);
        fetchRequest(`${ApiPort.ConfirmWithdrawalComplete}withdrawalId=${AbleCompleteFromData.TransactionId}&`, 'POST')
            .then((res) => {
                Toast.hide()
                if (res.isSuccess) {
                    if (res.result && Number(res.result.RebateAmount) > 0) {
                        //额外奖励成功pop
                        this.setState({
                            rebateAmountPop: 'success',
                            rebateAmountPopMsg: `额外奖励 ${res.result.RebateAmount} 元已到账\n您可前往交易记录查询`,
                        })
                    } else {
                        Toasts.success("确认到账", 2);
                    }
                } else {
                    let errors = res.errors && res.errors[0]? res.errors[0] : ''
                    if (errors) {
                        //额外奖励失败pop
                        let rebateAmountPopMsg = errors.errorCode == 'GEN0006' ? `亲爱的会员，因请求异常导致您的提款未能成功，\n请您重新提交或使用其他提款方式。` : errors.description
                        this.setState({ rebateAmountPop: 'err', rebateAmountPopMsg })
                    } else {
                        Toasts.fail('网络错误，请稍后重试', 3)
                    }
                }
                this.props.getDepositWithdrawalsRecords()
            })
            .catch(() => {
                Toasts.fail('网络错误，请稍后重试', 3)
            })
    }


    render() {
        const {
            rebateAmountPopMsg,
            rebateAmountPop,
        } = this.state
        return (
            <View>
                {/* 确认到账弹窗 */}
                <Modal animationType='fade' transparent={true} visible={this.props.IsAbleCompleteFromUIPop}>
                    <View style={[styles.modalContainer]}>
                        <View style={[styles.modalBox]}>
                            <View style={styles.modalBody}>
                                <Touch style={styles.modalClose} onPress={() => { this.props.PopChange() }}>
                                    <Image
                                        source={require('../../images/close.png')}
                                        resizeMode='stretch'
                                        style={{ width: 16, height: 16 }}
                                    />
                                </Touch>
                                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20, }}>
                                    <Image
                                        source={require('../../images/warn.png')}
                                        resizeMode='stretch'
                                        style={{ width: 52, height: 52 }}
                                    />
                                </View>
                                <View style={{ backgroundColor: '#FFF5BF', marginHorizontal: 0, borderRadius: 10, padding: 15 }}>
                                <View style={styles.modalContainerList}>
                                    <Text style={styles.modalContainerText}>1. </Text>
                                    <Text style={styles.modalContainerText}>
                                    请注意，乐天堂不会在金额还没到账前通知会员点击“确认到账”。
                                    <Text style={{ color: '#E30000' }}>请留意您的资金安全</Text>。
                                    </Text>
                                </View>
                                <View style={styles.modalContainerList}>
                                    <Text style={styles.modalContainerText}>2. </Text>
                                    <Text style={styles.modalContainerText}>
                                    若您在尚未检查的情况下点击 “确认到账”， 所产生的损失乐天堂<Text style={{ color: '#E30000' }}>概不负责赔偿</Text>。
                                    </Text>
                                </View>
                                <View style={styles.modalContainerList}>
                                    <Text style={styles.modalContainerText}>3. </Text>
                                    <Text style={styles.modalContainerText}>
                                    请确认您的金额是否已到账。
                                    </Text>
                                </View>
                                </View>
                                <View style={styles.modalBtnBox}>
                                    <TouchableOpacity style={[styles.modalBtn, { borderColor: '#00A6FF' }]} onPress={() => { this.props.PopChange() }}>
                                        <Text style={[styles.modalBtnText, { color: '#00A6FF' }]}>还没到账 ​</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.modalBtn, { backgroundColor: '#00A6FF', borderColor: '#00A6FF' }]}
                                        onPress={() => { this.IsAbleCompleteFromUI() }}
                                    >
                                        <Text style={[styles.modalBtnText, { color: '#fff' }]}>确认到账</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                {/* 额外奖励提示弹窗 */}
                <Modal animationType='fade' transparent={true} visible={rebateAmountPop == 'success' || rebateAmountPop == 'err'}>
                    <View style={[styles.modalContainer]}>
                        <View style={[styles.modalBox]}>
                            <View style={[styles.modalBody,{paddingLeft: 0, paddingRight: 0}]}>
                                <Touch style={styles.modalClose} onPress={() => { this.setState({ rebateAmountPop: '' }) }}>
                                    <Image
                                        source={require('../../images/close.png')}
                                        resizeMode='stretch'
                                        style={{ width: 16, height: 16 }}
                                    />
                                </Touch>
                                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20, }}>
                                    <Image
                                        source={rebateAmountPop == 'success' ? require('../../images/icon-done.png') : require('../../images/warn.png')}
                                        resizeMode='stretch'
                                        style={{ width: 52, height: 52 }}
                                    />
                                </View>
                                <Text style={[styles.modalContainerText, { textAlign: 'center' }]}>{`${rebateAmountPopMsg}`}</Text>
                                <View style={styles.modalBtnBox}>
                                    <TouchableOpacity
                                        style={[styles.modalBtn, { backgroundColor: '#00A6FF', borderColor: '#00A6FF', width: (width * .9 - 30) }]}
                                        onPress={() => {
                                            this.setState({ rebateAmountPop: '' }, () => {
                                                
                                                if(rebateAmountPop == 'success') {
                                                    if(this.props.recordes == 'recordsDatails') {
                                                        Actions.pop()
                                                    }
                                                    //查看转账记录
                                                    this.props.changeBettingHistoryDatesIndex()
                                                }
                                            })
                                        }}
                                    >
                                        <Text style={[styles.modalBtnText, { color: '#fff', fontSize: 15 }]}>{rebateAmountPop == 'success' ? '查看交易记录' : '我知道了'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .6)'
    },
    modalBox: {
        backgroundColor: '#fff',
        borderRadius: 10,
        width: width * .9,
        overflow: 'hidden'
    },
    modalBody: {
        padding: 15,
        paddingTop: 20,
        paddingBottom: 15,
    },
    modalClose: {
        position: 'absolute',
        top: 25,
        right: 25,
        zIndex: 99,
    },
    modalContainerText: {
        color: '#333333',
        fontSize: 13,
        lineHeight: 22,
    },
    modalContainerList: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        paddingLeft: 6,
        paddingRight: 6,
    },
    modalBtnBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    },
    modalBtn: {
        height: 40,
        width: (width * .9 - 30) / 2.1,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    modalBtnText: {
        fontWeight: 'bold',
        color: '#58585B'
    },
})

export default AbleCompleteFromUIPop;