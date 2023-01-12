import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Dimensions, TextInput, Modal, TouchableHighlight, ScrollView, Image, Alert } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import ModalDropdown from 'react-native-modal-dropdown'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Toast, Picker, List, Tabs, DatePicker } from 'antd-mobile-rn'
import CheckBox from 'react-native-check-box'

export const RealNameReg = /^[\u4e00-\u9fa5\u0E00-\u0E7F ]{2,15}$/
export const ProvinceReg = /^[a-zA-Z\u4e00-\u9fa5\u0E00-\u0E7F\s ]+$/
export const CityReg = /^[a-zA-Z\u4e00-\u9fa5\u0E00-\u0E7F\s ]+$/
export const BranchReg = /^[a-zA-Z0-9\u4e00-\u9fa5\u0E00-\u0E7F\s ]+$/
export const EmailReg = /^\w+[-.`~!@$%^*()={}|?\w]+@([\w.]{2,})+?\.[a-zA-Z]{2,9}$/
export const HouseNumberReg = /^[^;:：；<>《》]+$/
const locatData = require('./locatData.json');
const { width, height } = Dimensions.get('window')
const RegObj = {
    accountHolderName: RealNameReg,
    province: ProvinceReg,
    city: CityReg,
    branch: BranchReg
}
locatData.forEach(item => {
    item.value = item.label;
    item.children.forEach((val) => {
        val.value = val.label;
        val.children.forEach((v) => {
            v.value = v.label;
        })
    })
});

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

class NewBankContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bankList: [],
            banksIndex: 0,
            bankType: this.props.bankType,//提款或充值银行卡
            accountHolderName: '',
            accountHolderNameErr: true,
            accountNumber: '',
            province: '',//省份
            provinceErr: true,
            city: '',//城市
            cityErr: true,
            branch: '',//分行
            branchErr: true,
            addDisalbed: false,
            checkBox: false,
            arrowFlag: false,
            name: '',
            eligible: false,
            isShowCtcModal: false
        }
    }

    componentDidMount() {
        if (this.props.bankType === 'W') {
            this.getWithdrawalLbBankAction()
        }
    }

    getWithdrawalLbBankAction() {
        global.storage.load({
            key: 'WithdrawalsLbBanks',
            id: 'WithdrawalsLbBanks'
        }).then(data => {
            this.setState({
                bankList: data
            })
        }).catch(() => {
        })

        fetchRequest(window.ApiPort.PaymentDetails + '?transactionType=Withdrawal&method=LB&isMobile=true&', 'GET').then(res => {

            let withdrawalsBank = res.Banks
            this.setState({
                bankList: withdrawalsBank
            })
            global.storage.save({
                key: 'WithdrawalsLbBanks',
                id: 'WithdrawalsLbBanks',
                data: withdrawalsBank,
                expires: null
            })
        }).catch((err) => {
            Toast.hide()
        })
    }

    getDepositLbBank(props) {
        if (props) {
            let depositLbBankData = props.depositLbBankData
            if (Array.isArray(depositLbBankData)) {
                this.setState({
                    bankList: depositLbBankData
                })
            }
        }
    }


    GetOnlyNumReg(str) {
        return (str + '').replace(/[^\d]/g, '')
    }

    //添加
    addBank() {
        const { bankList, addDisalbed, accountNumber, accountHolderName, city, province, branch, banksIndex, checkBox } = this.state
        if (!addDisalbed) { return '' }
        let params = {
            accountNumber: accountNumber,
            accountHolderName: accountHolderName,
            bankName: bankList[banksIndex].Name,
            city: city,
            province: province,
            branch: branch,
            type: this.props.bankType,
            isDefault: checkBox
        }
        Toast.loading('加载中,请稍候...', 2000)
        fetchRequest(window.ApiPort.MemberBanks, 'POST', params).then(data => {
            Toast.hide()
            if (data.isSuccess == true) {
                this.props.getWithdrawalUserBankAction()
                Toasts.success('银行卡添加成功', 2)
                Actions.pop()
            } else {
                Toasts.fail(data.message, 1.5)
            }
        }).catch(error => {
            Toast.hide()
        })

        PiwikEvent('Withdrawal Nav', 'Click', 'Save_BankCard_Withdrawal')
    }

    submitName(name) {
        const { eligible } = this.state
        if (this.state.name) {
            this.props.getMemberInforAction()
            Actions.pop()
            Actions.FreeBetPage({
                fillType: 'game',
                isGetFreeBet: true
            })
            return
        }
        const params = {
            key: 'FirstName',
            value1: name.trim(),
            value2: ''
        }

        Toast.loading('加载中,请稍候...', 2000)
        fetchRequest(window.ApiPort.Member, 'PATCH', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                this.props.getMemberInforAction()
                Actions.pop()
                Actions.FreeBetPage({
                    fillType: 'game',
                    isGetFreeBet: true
                })
            } else {
                Toasts.fail('Cài đặt không thành công', 2)
            }
        }).catch(() => {
            Toast.hide()
        })
    }

    changeInputValue(type, value) {
        let Err = RegObj[type].test(value)
        this.setState({
            [`${type}Err`]: Err,
            [type]: value
        }, () => {
            this.changeBtnStatus()
        })
    }

    changeBtnStatus() {
        const { bankList, accountHolderName, accountHolderNameErr, province, provinceErr, city, cityErr, branch, branchErr, accountNumber, banksIndex } = this.state
        let addDisalbed = Array.isArray(bankList) && bankList.length > 0 &&
            accountHolderName.length > 0 && accountNumber.length > 0 &&
            city.length > 0 && province.length > 0 && branch.length > 0 && accountHolderNameErr && branchErr && cityErr
        this.setState({
            addDisalbed
        })
    }

    changeArrowStatus(arrowFlag) {
        this.setState({
            arrowFlag
        })
    }

    render() {
        const {
            banksIndex,
            bankList,
            accountHolderName,
            accountNumber,
            province,//省份
            city,//城市
            branch,//分行
            addDisalbed,
            checkBox,
            accountHolderNameErr,
            provinceErr,
            cityErr,
            branchErr,
            arrowFlag,
            isShowCtcModal
        } = this.state
        const PlaceholderTextColor = true ? 'rgba(0, 0, 0, .4)' : '#fff'
        const PasswordInput = { backgroundColor: true ? '#fff' : '#000', color: true ? '#3C3C3C' : '#fff', borderColor: true ? '#F2F2F2' : '#00AEEF' }
        return <View style={{ flex: 1, backgroundColor: true ? '#fff' : '#0F0F0F', paddingHorizontal: 10 }}>
            <Modal visible={isShowCtcModal} transparent={true} animationType='fade'>
                <TouchableHighlight onPress={() => {
                    this.setState({
                        isShowCtcModal: false
                    })
                }} style={styles.modalCOntainer}>
                    <View style={styles.modalWrap}>
                        <Text style={styles.modalHeadTitle}>银行名称</Text>
                        <ScrollView
                            automaticallyAdjustContentInsets={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                        >
                            <View >
                                <View>
                                    {
                                        bankList.map((v, i) => {
                                            return <TouchableOpacity style={styles.bankListstyle}
                                                onPress={() => {
                                                    this.setState({
                                                        banksIndex: i,
                                                        isShowCtcModal: false
                                                    })
                                                }}
                                            >
                                                <View>
                                                    <Text style={{ color: '#999999' }}>{v.Name}</Text>
                                                </View>

                                                <View style={{
                                                    borderRadius: 10000,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderWidth: 1,
                                                    borderColor: banksIndex == i ? '#00A6FF' : '#BCBEC3',
                                                    width: 20,
                                                    height: 20,
                                                    backgroundColor: banksIndex != i ? '#fff' : '#00A6FF'
                                                }}>
                                                    {
                                                        banksIndex == i && <View style={styles.virvleBox}></View>
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                        })
                                    }
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </TouchableHighlight>
            </Modal>



            <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
                {/* 银行选择 */}
                <View style={[styles.limitLists, { paddingTop: 15 }]}>
                    <Text style={[styles.withdrawalText, { color: true ? '#000' : '#fff' }]}>银行名称</Text>
                    {
                        bankList.length > 0 && <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    isShowCtcModal: true
                                })
                            }}
                            style={[styles.targetWalletBox, PasswordInput]}>
                            <Text style={[styles.toreturnModalDropdownText, { color: true ? '#000' : '#fff' }]}>{bankList[banksIndex].Name}</Text>
                            <Image
                                resizeMode="stretch"
                                source={false ? require("./../images/up.png") : require("./../images/down.png")}
                                style={{
                                    width: 16,
                                    height: 16,
                                    position: "absolute",
                                    right: 10
                                }}
                            />
                        </TouchableOpacity>
                    }
                </View>
                {/* 姓名 */}
                <View style={styles.limitLists}>
                    <Text style={[styles.withdrawalText, { color: true ? '#000' : '#fff' }]}>账户持有者全名</Text>
                    <TextInput
                        value={accountHolderName}
                        maxLength={50}
                        placeholderTextColor={PlaceholderTextColor}
                        style={[styles.limitListsInput, PasswordInput]}
                        onChangeText={this.changeInputValue.bind(this, 'accountHolderName')}
                    />
                    {
                        !accountHolderNameErr && <View style={{ backgroundColor: '#FEE0E0', height: 40, justifyContent: 'center', paddingLeft: 15, marginTop: 10, borderRadius: 4 }}>
                            <Text style={{ color: '#EB2121' }}>格式不正确  </Text>
                        </View>
                    }
                </View>
                {/* 银行卡号 */}
                <View style={styles.limitLists}>
                    <Text style={[styles.withdrawalText, { color: true ? '#000' : '#fff' }]}>银行账户号码</Text>
                    <TextInput
                        value={accountNumber}
                        maxLength={19}
                        keyboardType='number-pad'
                        placeholderTextColor={PlaceholderTextColor}
                        style={[styles.limitListsInput, PasswordInput]}
                        onChangeText={value => {
                            let accountNumber = this.GetOnlyNumReg(value)
                            this.setState({
                                accountNumber
                            }, () => {
                                this.changeBtnStatus()
                            })
                        }}
                    />
                </View>
                {
                    <View>
                        {/* 省份 */}
                        <View style={styles.limitLists}>
                            <Text style={[styles.withdrawalText, { color: true ? '#000' : '#fff' }]}>省/自治区</Text>
                            {/* <TextInput
                                value={province}

                                maxLength={20}
                                placeholderTextColor={PlaceholderTextColor}
                                style={[styles.limitListsInput, PasswordInput]}
                                onChangeText={this.changeInputValue.bind(this, 'province')}
                            /> */}

                            <Picker
                                title='省/自治区'
                                onChange={value => {
                                    this.setState({
                                        province: value[0]
                                    }, () => {
                                        this.changeBtnStatus()
                                    })
                                }}
                                data={locatData}
                                cols={1}
                            >
                                <List.Item styles={StyleSheet.create(ListItemstyles)}>
                                    <View style={[styles.limitListsInput, PasswordInput]}>
                                        <Text>{province}</Text>
                                    </View>
                                </List.Item>
                            </Picker>
                            {/* {
                                !provinceErr && <Text style={{ color: 'red', marginTop: 10 }}>Định dạng không đúng.</Text>
                            } */}
                        </View>
                        {/* 城市 */}
                        <View style={styles.limitLists}>
                            <Text style={[styles.withdrawalText, { color: true ? '#000' : '#fff' }]}>城市/城镇</Text>
                            <TextInput
                                value={city}
                                maxLength={20}
                                placeholderTextColor={PlaceholderTextColor}
                                style={[styles.limitListsInput, PasswordInput]}
                                onChangeText={this.changeInputValue.bind(this, 'city')}
                            />
                            {
                                !cityErr && <View style={{ backgroundColor: '#FEE0E0', height: 40, justifyContent: 'center', paddingLeft: 15, marginTop: 10, borderRadius: 4 }}>
                                    <Text style={{ color: '#EB2121' }}>格式不正确  </Text>
                                </View>
                            }
                            {/* {
                                !cityErr && <Text style={{ color: 'red', marginTop: 10 }}>Định dạng không đúng.</Text>
                            } */}
                        </View>
                        {/* 分行 */}
                        <View style={styles.limitLists}>
                            <Text style={[styles.withdrawalText, { color: true ? '#000' : '#fff' }]}>分行</Text>
                            <TextInput
                                value={branch}
                                maxLength={20}
                                placeholderTextColor={PlaceholderTextColor}
                                style={[styles.limitListsInput, PasswordInput]}
                                onChangeText={this.changeInputValue.bind(this, 'branch')}
                            />
                            {
                                !branchErr && <View style={{ backgroundColor: '#FEE0E0', height: 40, justifyContent: 'center', paddingLeft: 15, marginTop: 10, borderRadius: 4 }}>
                                    <Text style={{ color: '#EB2121' }}>格式不正确  </Text>
                                </View>
                            }
                            {/* {
                                !branchErr && <Text style={{ color: 'red', marginTop: 10 }}>Định dạng không đúng.</Text>
                            } */}
                        </View>

                    </View>
                }

                <View style={styles.limitLists}>
                    <CheckBox
                        checkBoxColor={'#F2F2F2'}
                        checkedCheckBoxColor={'#25AAE1'}
                        onClick={() => {
                            this.setState({ checkBox: !checkBox })
                        }}
                        isChecked={checkBox}
                        rightTextView={<Text style={{ color: true ? '#000' : '#fff', fontSize: 12, marginLeft: 10 }}>设定为首选银行账户</Text>}
                    />
                </View>
            </KeyboardAwareScrollView>
            <TouchableOpacity style={[styles.LBdepositPageBtn1, { backgroundColor: addDisalbed ? '#1CBD64' : (true ? 'rgba(0, 0, 0, .4)' : '#5C5C5C') }]} onPress={this.addBank.bind(this)}>
                <Text style={styles.LBdepositPageBtnText1}>保存</Text>
            </TouchableOpacity>

        </View>
    }
}

export default NewBank = connect(
    (state) => {
        return {

        }
    }, (dispatch) => {
        return {

        }
    }
)(NewBankContainer)

const styles = StyleSheet.create({
    virvleBox: {
        borderRadius: 10000,
        width: 10,
        height: 10,
        backgroundColor: '#fff'
    },
    bankListstyle: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: 42,
        marginBottom: 10,
        borderRadius: 8,
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'space-between'
    },
    modalHeadTitle: {
        textAlign: 'center',
        fontSize: 16,
        paddingBottom: 25,
        color: '#000000',
        fontWeight: '600'
    },
    modalWrap: {
        backgroundColor: '#EFEFF4',
        paddingTop: 15,
        paddingHorizontal: 10,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingBottom: 60,
        height: height * .6
    },
    modalCOntainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, .4)',
        width,
        height,
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 10000,
        justifyContent: 'flex-end'
    },
    limitLists: {
        marginBottom: 10
    },
    LBdepositPageBtn2: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width,
        marginTop: 15
    },
    LbAddBankBox: {
        paddingTop: 10,
        position: 'absolute',
        width,
        bottom: 0,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    LBdepositPageBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#25AAE1'
    },
    LBdepositPageBtn: {
        width: .9 * width,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#25AAE1'
    },
    limitListsInput: {
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 14,
        height: 40,
        width: width - 20,
        borderRadius: 4,
        justifyContent: 'center'
    },
    withdrawalText: {
        color: '#000',
        marginBottom: 5
    },
    targetWalletBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        height: 40,
        borderWidth: 1,
        borderBottomWidth: 2,
        borderColor: '#4C4C4C34',
        alignItems: 'center',
        borderRadius: 4,
        // shadowColor: '#4C4C4C34',
        // shadowRadius: 4,
        // shadowOpacity: .6,
        // shadowOffset: { width: 2, height: 2 },
        // elevation: 4,
    },
    toreturnModalDropdown: {
        justifyContent: 'center',
        width: width - 20,
    },
    toreturnDropdownStyle: {
        width: width - 20,
        shadowColor: '#DADADA',
        shadowRadius: 4,
        shadowOpacity: .6,
        shadowOffset: { width: 2, height: 2 },
        elevation: 4,
    },
    toreturnModalDropdownList: {
        // height: 30,
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingVertical: 6
    },
    dropdown: {
        position: 'absolute',
        right: 10,
        width: 0,
        height: 0,
        zIndex: 9,
        borderStyle: 'solid',
        borderWidth: 5,
        marginTop: 5,
        borderTopColor: '#58585B',//下箭头颜色
        borderLeftColor: '#fff',//右箭头颜色
        borderBottomColor: '#fff',//上箭头颜色
        borderRightColor: '#fff'//左箭头颜色 
    },
    LBdepositPageBtn1: {
        position: 'absolute',
        bottom: 0,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1CBD64',
        width
    },
    LBdepositPageBtnText1: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
})