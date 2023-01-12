import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Clipboard, Modal, TouchableHighlight, Dimensions } from 'react-native'
import { Toast } from 'antd-mobile-rn'
import { Actions } from 'react-native-router-flux'
import moment from 'moment'
import ViewShot from 'react-native-view-shot'
import { bankIcons } from '../Help/bankIcons'
import AbleCompleteFromUIPop from './AbleCompleteFromUIPop'
import Touch from "react-native-touch-once";
import ImagePicker from 'react-native-image-picker'
const ManualDepositText = [
    '请您按照以下提示操作重新提交:   ',
    '1.点击"是的，我明白了"。',
    '2.点击"提交"。',
    '3.您无需转账，请等待存款记录显示后关闭。'
]

const CTCMethods = {
    OTC: "虚拟币交易所 (OTC)",
    INVOICE: "虚拟币支付 1",
    INVOICE_AUT: "虚拟币支付 2",
    CHANNEL: '极速虚拟币支付'
}


const DepositMethodType = {
    LB: {
        ALIQR: 'ZFB 转 支付宝',
        LOCALBANK: 'Local Bank'
    }
}

const { width, height } = Dimensions.get('window')
const DepositStatusPending = {//'Pending'

    text1: '处理中',
    color1: '#FABE47',
    borderColor1: '#BCBEC3',
    backgroundColor1: '#009DE3',
    opacity1: 1,

    text2: '存款成功',
    color2: '#BCBEC3',
    borderColor2: '#B2B2B2',
    backgroundColor2: '#B2B2B2',
    opacity2: .6,
}
const DepositStatus = {
    StatusId1: DepositStatusPending,//'Pending'
    StatusId2: {// 'Approved'

        text1: '处理中',
        color1: '#BCBEC3',
        borderColor1: '#BCBEC3',
        backgroundColor1: '#009DE3',
        opacity1: 1,

        text2: '存款成功',
        color2: '#0CCC3C',
        borderColor2: '#BCBEC3',
        backgroundColor2: '#83E300',
        opacity2: 1,
    },
    StatusId3: {//'Rejected'

        text1: '处理中',
        color1: '#BCBEC3',
        borderColor1: '#BCBEC3',
        backgroundColor1: '#009DE3',
        opacity1: 1,


        text2: '存款失败',
        color2: '#EB2121',
        borderColor2: '#BCBEC3',
        backgroundColor2: '#E30000',
        opacity2: 1,
    },
    StatusId4: DepositStatusPending,//' Vendor Processing'
}

const WithdrawalStatusPend = {//'等待浏览'

    text1: '待处理',
    color1: '#009DE3',
    borderColor1: '#BCBEC3',
    backgroundColor1: '#fff',
    opacity1: 1,

    text2: '处理中',
    color2: '#BCBEC3',
    borderColor2: '#B2B2B2',
    backgroundColor2: '#B2B2B2',
    opacity2: .6,


    text3: '提款成功',
    color3: '#BCBEC3',
    borderColor3: '#B2B2B2',
    backgroundColor3: '#B2B2B2',
    opacity3: .6,
}
const WithdrawalStatusPending = {//'进行中'

    text1: '待处理',
    color1: '#BCBEC3',
    borderColor1: '#BCBEC3',
    backgroundColor1: '#fff',
    opacity1: 1,


    text2: '处理中',
    color2: '#FABE47',
    borderColor2: '#BCBEC3',
    backgroundColor2: '#009DE3',
    opacity2: 1,


    text3: '提款成功',
    color3: '#BCBEC3',
    borderColor3: '#B2B2B2',
    backgroundColor3: '#B2B2B2',
    opacity3: .6,
}
const WithdrawalStatus = {
    StatusId1: WithdrawalStatusPend,
    StatusId2: WithdrawalStatusPending,
    StatusId3: WithdrawalStatusPending,
    StatusId4: {//'已完成'

        text1: '待处理',
        color1: '#BCBEC3',
        borderColor1: '#BCBEC3',
        backgroundColor1: '#fff',
        opacity1: 1,


        text2: '处理中',
        color2: '#BCBEC3',
        borderColor2: '#BCBEC3',
        backgroundColor2: '#009DE3',
        opacity2: 1,


        text3: '提款成功',
        color3: '#0CCC3C',
        borderColor3: '#BCBEC3',
        backgroundColor3: '#83E300',
        opacity3: 1,
    },
    StatusId5: {//'拒绝'

        text1: '待处理',
        color1: '#BCBEC3',
        borderColor1: '#BCBEC3',
        backgroundColor1: '#fff',
        opacity1: 1,


        text2: '处理中',
        color2: '#BCBEC3',
        borderColor2: '#BCBEC3',
        backgroundColor2: '#009DE3',
        opacity2: 1,


        text3: '提款失败',
        color3: '#EB2121',
        borderColor3: '#BCBEC3',
        backgroundColor3: '#E30000',
        opacity3: 1,
    },
    StatusId6: {//'取消'

        text1: '待处理',
        color1: '#BCBEC3',
        borderColor1: '#BCBEC3',
        backgroundColor1: '#fff',
        opacity1: 1,

        text2: '处理中',
        color2: '#BCBEC3',
        borderColor2: '#BCBEC3',
        backgroundColor2: '#009DE3',
        opacity2: 1,


        text3: '取消',
        color3: '#E30000',
        borderColor3: '#E30000',
        backgroundColor3: '#E30000',
        opacity3: 1,
    },
    StatusId7: WithdrawalStatusPend,
    StatusId8: WithdrawalStatusPending,
    StatusId9: WithdrawalStatusPending,
    StatusId10: {//'已完成'

        text1: '待处理',
        color1: '#BCBEC3',
        borderColor1: '#BCBEC3',
        backgroundColor1: '#fff',
        opacity1: 1,


        text2: '处理中',
        color2: '#BCBEC3',
        borderColor2: '#BCBEC3',
        backgroundColor2: '#009DE3',
        opacity2: 1,


        text3: '部分成功',
        color3: '#0CCC3C',
        borderColor3: '#BCBEC3',
        backgroundColor3: '#83E300',
        opacity3: 1,
    },
}

const PageTitle = {
    deposit: '存款记录',
    withdrawal: '提款记录'
}

class recordsDatails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            recordsDatails: this.props.recordsDatails,
            datailsType: this.props.datailsType,
            isShowPisker: false,
            isShowModal: false,
            isCancleFiance: false,
            ctcDetailData: {},
            isSHowUploadText: false,
            iscancledDepost: false,
            IsAbleCompleteFromUIPop: false,//确认到账弹窗
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            title: PageTitle[this.props.datailsType]
        })

        this.GetTransactionHistory()
    }

    async copyTXT(txt, bankIndex) {
        Clipboard.setString(txt)
        Toasts.success('复制成功', 1.5)
        this.setState({
            bankIndex,
            isCopy: true
        })

        setTimeout(() => {
            this.setState({
                bankIndex: -9999999999,
                isCopy: false
            })
        }, 1500);
    }

    cancleFiance() {
        this.setState({
            isCancleFiance: false
        })
        const { Amount, recordsDatails, datailsType } = this.state
        let parmas = {
            'TransactionType': datailsType,
            'Remark': 'test',
            'Amount': Amount
        }
        // console.log(recordsDatails)
        // return
        Toast.loading('加载中,请稍候...', 2000)

        let postUrl = window.ApiPort.POSTNoCancellation + recordsDatails.TransactionId + '/Cancellation?'
        if (datailsType === 'deposit') {
            postUrl = window.ApiPort.MemberRequestDepositReject + `transactionId=${recordsDatails.TransactionId}&`
            parmas = ''
        }

        fetchRequest(postUrl, 'POST', parmas).then(data => {
            Toast.hide()
            //  debugger;
            if (data.isSuccess || data.IsSuccess) {
                this.props.getDepositWithdrawalsRecords()
                this.setState({
                    iscancledDepost: true
                })
                Toasts.success('取消申请已送出')
                if (datailsType === 'deposit') {
                    PiwikEvent('Deposit_History', 'Submit', 'Cancel_Deposit')
                } else {
                    PiwikEvent('Transaction_Record', 'Submit', 'Cancel_LocalBank_Withdrawal')
                }
                Actions.pop()
            } else {
                Toasts.fail('取消失败')
            }
        }).catch(error => {
            Toast.hide()
        })
    }


    GetTransactionHistory() {
        const { recordsDatails, datailsType } = this.state
        //if (!((recordsDatails.PaymentMethodId.toLocaleUpperCase() == 'CTC' && recordsDatails.MethodType.toLocaleUpperCase() != "INVOICE") || ['LB', 'PPB', 'AP', 'CC'].includes(recordsDatails.PaymentMethodId.toLocaleUpperCase()))) return
        Toast.loading("加载中,请稍候...", 300);
        fetchRequest(window.ApiPort.GetTransactionHistory + 'transactionID=' + recordsDatails.TransactionId + '&transactionType=' + datailsType + '&', 'GET').then(data => {
            Toast.hide()
            this.setState({
                ctcDetailData: data
            })
        }).catch(() => {
            Toast.hide()
        })
    }

    uploadImg() {
        const ImagePickerOption = {
            title: '选择图片', //TODO:CN-DONE 选择图片
            cancelButtonTitle: '取消', //TODO:CN-DONE 取消
            chooseFromLibraryButtonTitle: '确认', //TODO:CN-DONE 选择图片
            cameraType: 'back',
            mediaType: 'photo',
            videoQuality: 'high',
            durationLimit: 10,
            maxWidth: 6000000,
            maxHeight: 6000000,
            quality: 1,
            angle: 0,
            allowsEditing: false,
            noData: false,
            storageOptions: {
                skipBackup: true
            },
            includeBase64: true,
            saveToPhotos: true
        }

        ImagePicker.launchImageLibrary(ImagePickerOption, response => {
            if (response.didCancel) {
            } else if (response.error) {
                // Alert.alert('Lỗi quyền hình ảnh', ImgPermissionsText)
            } else if (response.customButton) {
            } else {
                // let source = { uri: 'data:image/jpegbase64,' + response.data }
                let source = { uri: response.data }
                //后缀要求小写

                if (!response.fileName) { return }
                let idx = response.fileName.lastIndexOf('.')
                let newfileName = response.fileName.substring(0, idx) + response.fileName.substring(idx).toLowerCase()
                let avatarName = newfileName
                let avatarSize = response.fileSize
                let avatarSource = source
                let fileSize = response.fileSize
                let fileImgFlag = !(response.fileSize <= 1024 * 1024 * 2 && ['JPG', 'GIF', 'BMP', 'PNG', 'DOC', 'DOCX', 'PDF', 'HEIC ', 'HEIF'].includes((response.fileName.split('.')[response.fileName.split('.').length - 1]).toLocaleUpperCase()))


                const { recordsDatails } = this.state

                let params = {
                    "DepositID": recordsDatails.TransactionId,
                    "PaymentMethod": recordsDatails.PaymentMethodId,
                    "FileName": avatarName,
                    "byteAttachment": avatarSource.uri,
                    "RequestedBy": userNameDB
                }

                Toast.loading("加载中,请稍候...", 300);
                fetchRequest(window.ApiPort.UploadAttachment, 'POST', params).then(data => {
                    Toast.hide()
                    if (data.isSuccess) {
                        Toasts.success('存款回执单已上传')
                        this.setState({
                            isSHowUploadText: true
                        })
                        this.props.getDepositWithdrawalsRecords()
                        Actions.pop()
                    } else {
                        Toasts.fail('存款回执单上传失败')
                    }
                }).catch(() => {
                    Toast.hide()
                })
            }
        })
    }


    createBtnStatus() {
        const { recordsDatails, isSHowUploadText, datailsType } = this.state
        const {
            IsContactCS, // 联系在线客服
            IsSubmitNewTrans,//再次存款
            IsUploadSlip,  //上传存款回执单
            IsAbleRequestRejectDeposit, //取消存款
            IsUploadDocument,
            ResubmitFlag
        } = recordsDatails
        const statusId = recordsDatails.StatusId

        //const ResubmitFlag = 1
        // const statusId = 3
        // const IsContactCS = true
        // const IsUploadSlip = !true
        // const IsAbleRequestRejectDeposit = true
        // const IsSubmitNewTrans = true
        if (datailsType === 'deposit') {
            if (ResubmitFlag == true) {
                return <View>
                    <Text style={{ marginBottom: 10 }}>您输入的存款金额不一致，请点击"重新提交"并确认正确的存款金额。</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1, { backgroundColor: '#FFFFFF' }]} onPress={() => {
                            LiveChatOpenGlobe()
                        }}>
                            <Text style={[styles.recordsDatailsBtnText, {
                                color: '#00A6FF'
                            }]}>联系在线客服</Text>{/* 取消提款 */}
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1]} onPress={() => {
                            this.setState({
                                isShowModal: true
                            })
                        }}>
                            <Text style={styles.recordsDatailsBtnText}>重新提交</Text>{/* 取消提款 */}
                        </TouchableOpacity>
                    </View>
                </View>
            }

            if (statusId == 1 || statusId == 4) {
                if ((IsAbleRequestRejectDeposit && IsContactCS && IsUploadSlip)) {
                    return <View>
                        {
                            Boolean(recordsDatails.ReasonMsg) && <Text style={styles.reasonMsg}>{recordsDatails.ReasonMsg}</Text>
                        }
                        <TouchableOpacity style={[styles.recordsDatailsBtn]} onPress={() => {
                            this.setState({
                                isCancleFiance: true
                            })
                        }}>
                            <Text style={styles.recordsDatailsBtnText}>取消存款</Text>{ }
                        </TouchableOpacity>

                        {
                            !isSHowUploadText && <View style={styles.btnBox}>
                                <TouchableOpacity
                                    onPress={() => { LiveChatOpenGlobe() }}
                                    style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1, { backgroundColor: '#fff' }]}>
                                    <Text style={{ color: '#00A6FF' }}>联系在线客服</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.uploadImg.bind(this)}
                                    style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1]}>
                                    <Text style={{ color: '#fff' }}>上传存款回执单</Text>
                                </TouchableOpacity>
                            </View>
                        }

                        {
                            isSHowUploadText && <View>
                                <Text style={{ color: '#00A6FF', marginBottom: 10 }}>* 您已上传存款回执单。</Text>
                                <TouchableOpacity style={[styles.recordsDatailsBtn]} onPress={() => { LiveChatOpenGlobe() }}>
                                    <Text style={styles.recordsDatailsBtnText}>联系在线客服</Text>{ }
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                }


                if (recordsDatails.PaymentMethodId.toLocaleUpperCase() == 'CTC' && recordsDatails.MethodType.toLocaleUpperCase() == "CHANNEL") {
                    return <View>{recordsDatails.ReasonMsg != '' && <Text style={styles.reasonMsg}>{`${recordsDatails.ReasonMsg}`}</Text>}</View>
                }

                if ((IsContactCS && IsUploadSlip)) {
                    return <View>
                        {
                            Boolean(recordsDatails.ReasonMsg) && <Text style={styles.reasonMsg}>{recordsDatails.ReasonMsg}</Text>
                        }
                        {
                            !isSHowUploadText && <View style={styles.btnBox}>
                                <TouchableOpacity
                                    onPress={() => { LiveChatOpenGlobe() }}
                                    style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1, { backgroundColor: '#fff' }]}>
                                    <Text style={{ color: '#00A6FF' }}>联系在线客服</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.uploadImg.bind(this)}
                                    style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1]}>
                                    <Text style={{ color: '#fff' }}>上传存款回执单</Text>
                                </TouchableOpacity>
                            </View>
                        }

                        {
                            isSHowUploadText && <View>
                                <Text style={{ color: '#00A6FF', marginBottom: 10 }}>* 您已上传存款回执单。</Text>
                                <TouchableOpacity style={[styles.recordsDatailsBtn]} onPress={() => { LiveChatOpenGlobe() }}>
                                    <Text style={styles.recordsDatailsBtnText}>联系在线客服</Text>{ }
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                }


                if ((IsContactCS && IsAbleRequestRejectDeposit)) {
                    return <View>
                        {
                            Boolean(recordsDatails.ReasonMsg) && <Text style={styles.reasonMsg}>{recordsDatails.ReasonMsg}</Text>
                        }

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1, { backgroundColor: '#FFFFFF' }]} onPress={() => {
                                LiveChatOpenGlobe()
                            }}>
                                <Text style={[styles.recordsDatailsBtnText, {
                                    color: '#00A6FF'
                                }]}>联系在线客服</Text>{/* 取消提款 */}
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1]} onPress={() => {
                                this.setState({
                                    isCancleFiance: true
                                })
                            }}>
                                <Text style={styles.recordsDatailsBtnText}>取消存款</Text>{/* 取消提款 */}
                            </TouchableOpacity>
                        </View>
                    </View>
                }

                if ((IsUploadSlip && IsAbleRequestRejectDeposit)) {
                    return <View>
                        {
                            Boolean(recordsDatails.ReasonMsg) && <Text style={styles.reasonMsg}>{recordsDatails.ReasonMsg}</Text>
                        }

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                style={[styles.recordsDatailsBtn, !isSHowUploadText ? { width: (width - 40) * .45, backgroundColor: '#fff' } : { width: width - 45 }]}
                                onPress={() => {
                                    this.setState({
                                        isCancleFiance: true
                                    })
                                }}
                            >
                                <Text style={[styles.recordsDatailsBtnText, { color: '#00A6FF' }]}>取消交易</Text>{/* 取消提款 */}
                            </TouchableOpacity>
                            {
                                !isSHowUploadText &&
                                <TouchableOpacity style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1]} onPress={this.uploadImg.bind(this)}>
                                    <Text style={[styles.recordsDatailsBtnText]}>上传存款凭证</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                }


                if (IsAbleRequestRejectDeposit) {
                    return <View>
                        {
                            Boolean(recordsDatails.ReasonMsg) && <Text style={styles.reasonMsg}>{recordsDatails.ReasonMsg}</Text>
                        }

                        <TouchableOpacity style={[styles.recordsDatailsBtn]} onPress={() => {
                            this.setState({
                                isCancleFiance: true
                            })
                        }}>
                            <Text style={styles.recordsDatailsBtnText}>取消存款</Text>{ }
                        </TouchableOpacity>
                    </View>

                }


                if (IsContactCS) {
                    return <View>
                        {
                            Boolean(recordsDatails.ReasonMsg) && <Text style={styles.reasonMsg}>{recordsDatails.ReasonMsg}</Text>
                        }
                        <TouchableOpacity style={[styles.recordsDatailsBtn]} onPress={() => { LiveChatOpenGlobe() }}>
                            <Text style={styles.recordsDatailsBtnText}>联系在线客服</Text>{ }
                        </TouchableOpacity>
                    </View>
                }
                if (!IsAbleRequestRejectDeposit && !IsContactCS && !IsUploadSlip) {
                    return <View>{recordsDatails.ReasonMsg != '' && <Text style={styles.reasonMsg}>{`${recordsDatails.ReasonMsg}`}</Text>}</View>
                }
            } else if (statusId == 3) {
                if ((IsContactCS && IsSubmitNewTrans)) {
                    return <View>
                        {
                            Boolean(recordsDatails.ReasonMsg) && <Text style={styles.reasonMsg}>{recordsDatails.ReasonMsg}</Text>
                        }

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1, { backgroundColor: '#FFFFFF' }]} onPress={() => {
                                LiveChatOpenGlobe()
                            }}>
                                <Text style={[styles.recordsDatailsBtnText, {
                                    color: '#00A6FF'
                                }]}>联系在线客服</Text>{/* 取消提款 */}
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1]} onPress={() => {
                                Actions.DepositCenter()
                            }}>
                                <Text style={styles.recordsDatailsBtnText}>再次存款</Text>{/* 取消提款 */}
                            </TouchableOpacity>
                        </View>
                    </View>
                }

                if (recordsDatails.PaymentMethodId.toLocaleUpperCase() == 'CTC' && Boolean(recordsDatails.ConvertedCurrencyCode) && Boolean(recordsDatails.CryptoExchangeRate)) {
                    return <View>
                        <Text style={{}}>参考汇率 : {`1 ${recordsDatails.ConvertedCurrencyCode} = ${recordsDatails.CryptoExchangeRate} 人民币`}</Text>
                    </View>
                } else {
                    return <View>{recordsDatails.ReasonMsg != '' && <Text style={styles.reasonMsg}>{`${recordsDatails.ReasonMsg}`}</Text>}</View>
                }
            } else if (statusId == 2) {
                if (recordsDatails.PaymentMethodId.toLocaleUpperCase() == 'CTC' && Boolean(recordsDatails.ConvertedCurrencyCode) && Boolean(recordsDatails.CryptoExchangeRate)) {
                    return <View>
                        <Text style={{}}>参考汇率 : {`1 ${recordsDatails.ConvertedCurrencyCode} = ${recordsDatails.CryptoExchangeRate} 人民币`}</Text>
                    </View>
                }
            }

        } else {
            if (recordsDatails.PaymentMethodId.toLocaleUpperCase() == 'LB') {
                if (recordsDatails.IsAbleCompleteFromUI) {
                    //确认到账按钮
                    return (
                        <View>
                            <TouchableOpacity
                                style={styles.recordsDatailsBtn}
                                onPress={() => { this.setState({ IsAbleCompleteFromUIPop: true }) }}
                            >
                                <Text style={styles.recordsDatailsBtnText}>确认到账</Text>
                            </TouchableOpacity>
                            {
                                Boolean(recordsDatails.ReasonMsg) &&
                                <View style={styles.ableCompleteReasonMsg}>
                                    <Text style={{ color: '#666', fontSize: 14 }}>乐天使温馨提醒 ：</Text>
                                    <Text style={{ color: '#999', fontSize: 12, paddingTop: 5 }}>
                                        { recordsDatails.ReasonMsg }
                                    </Text>
                                </View>
                            }
                        </View>
                    )
                }
                if (statusId === 1) {
                    if ((IsContactCS && IsUploadSlip)) {
                        return <View>
                            {
                                Boolean(recordsDatails.ReasonMsg) && <Text style={styles.reasonMsg}>{recordsDatails.ReasonMsg}</Text>
                            }

                            <TouchableOpacity
                                style={[styles.recordsDatailsBtn, { marginBottom: 20 }]}
                                onPress={() => {
                                    this.setState({
                                        isCancleFiance: true
                                    })
                                }}
                            >
                                <Text style={styles.recordsDatailsBtnText}>取消提款</Text>{/* 取消提款 */}
                            </TouchableOpacity>

                            <View style={styles.btnBox}>
                                <TouchableOpacity
                                    onPress={() => { LiveChatOpenGlobe() }}
                                    style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1, { backgroundColor: '#fff' }]}>
                                    <Text style={{ color: '#00A6FF' }}>联系在线客服</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.uploadImg.bind(this)}
                                    style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1]}>
                                    <Text style={{ color: '#fff' }}>上载文档</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }

                    if (IsContactCS) {
                        return <View>
                            {
                                Boolean(recordsDatails.ReasonMsg) && <Text style={styles.reasonMsg}>{recordsDatails.ReasonMsg}</Text>
                            }
                            <View style={styles.btnBox}>
                                <TouchableOpacity
                                    onPress={() => { LiveChatOpenGlobe() }}
                                    style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1, { backgroundColor: '#fff' }]}>
                                    <Text style={{ color: '#00A6FF' }}>联系在线客服</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            isCancleFiance: true
                                        })
                                    }}
                                    style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1]}>
                                    <Text style={{ color: '#fff' }}>取消提款</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    }

                    return <View>
                        {
                            Boolean(recordsDatails.ReasonMsg) && <Text style={styles.reasonMsg}>{recordsDatails.ReasonMsg}</Text>
                        }
                        <View style={styles.btnBox}></View>
                        <TouchableOpacity
                            style={[styles.recordsDatailsBtn, { marginTop: 20 }]}
                            onPress={() => {
                                this.setState({
                                    isCancleFiance: true
                                })
                            }}
                        >
                            <Text style={styles.recordsDatailsBtnText}>取消提款</Text>{/* 取消提款 */}
                        </TouchableOpacity>
                    </View>

                } else {
                    if (statusId == 5) {
                        if ((IsContactCS && IsSubmitNewTrans)) {
                            return <View>
                                {
                                    Boolean(recordsDatails.ReasonMsg) && <Text style={styles.reasonMsg}>{recordsDatails.ReasonMsg}</Text>
                                }

                                <View style={styles.btnBox}>
                                    <TouchableOpacity
                                        onPress={() => { LiveChatOpenGlobe() }}
                                        style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1, { backgroundColor: '#fff' }]}>
                                        <Text style={{ color: '#00A6FF' }}>联系在线客服</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            Actions.withdrawal()
                                        }}
                                        style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1]}>
                                        <Text style={{ color: '#fff' }}>再次提款</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    } else if ([2, 3, 8, 9].includes(statusId)) {
                        if (recordsDatails.TotalTransactionCount > 1 && recordsDatails.PaymentMethodId == "LB") return
                        return <View>
                            <Text style={styles.reasonMsg}>此事务需要比预期更长的时间。 抱歉给你带来不便。 需要更多信息，请联系在线客服。</Text>
                            <TouchableOpacity style={[styles.recordsDatailsBtn]} onPress={() => {
                                LiveChatOpenGlobe()
                            }}>
                                <Text style={styles.recordsDatailsBtnText}>联系在线客服</Text>{/* 取消提款 */}
                            </TouchableOpacity>
                        </View>
                    } else if (statusId == 10) {
                        let SubTransactionCount = recordsDatails.SubTransactionCount
                        let TotalTransactionCount = recordsDatails.TotalTransactionCount
                        if (SubTransactionCount != TotalTransactionCount) {
                            return <Text>余额已退还到您的主钱包。</Text>
                        }
                    }
                }
            } else {
                if (statusId == 1) {
                    if ((IsContactCS && IsUploadSlip)) {
                        return <View>
                            {
                                Boolean(recordsDatails.ReasonMsg) && <Text style={styles.reasonMsg}>{recordsDatails.ReasonMsg}</Text>
                            }
                            <TouchableOpacity
                                style={[styles.recordsDatailsBtn, { marginBottom: 20 }]}
                                onPress={() => {
                                    this.setState({
                                        isCancleFiance: true
                                    })
                                }}
                            >
                                <Text style={styles.recordsDatailsBtnText}>取消提款</Text>{/* 取消提款 */}
                            </TouchableOpacity>

                            <View style={styles.btnBox}>
                                <TouchableOpacity
                                    onPress={() => { LiveChatOpenGlobe() }}
                                    style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1, { backgroundColor: '#fff' }]}>
                                    <Text style={{ color: '#00A6FF' }}>联系在线客服</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.uploadImg.bind(this)}
                                    style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1]}>
                                    <Text style={{ color: '#fff' }}>上载文档</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                } else if (statusId == 4) {
                    return <View>
                        {
                            recordsDatails.ReasonMsg != '' && <Text style={styles.reasonMsg}>{`${recordsDatails.ReasonMsg}`}</Text>
                        }
                    </View>
                }


            }

        }
    }

    render() {
        const { iscancledDepost, isSHowUploadText, recordsDatails, datailsType, isShowPisker, isShowModal, isCancleFiance, ctcDetailData, IsAbleCompleteFromUIPop, } = this.state
        const statusId = recordsDatails.StatusId
        let recordsStatus = datailsType === 'deposit' ? DepositStatus : WithdrawalStatus
        let recordsStatusItem = recordsStatus[`StatusId${statusId}`]
        let ResubmitFlag = recordsDatails.ResubmitFlag  // 1
        let ViewIcon = <View style={{ width: 20, height: 20, borderWidth: 1, borderColor: '#DCDCE0', borderRadius: 1000, transform: [{ scale: .8 }] }}></View>
        console.log(recordsDatails, 88)
        return <ViewShot style={[styles.viewContainer]} ref='viewShot' options={{ format: 'jpg', quality: 0.9 }}>
            <Modal visible={isShowPisker} transparent={true} animationType='fade'>
                <TouchableHighlight
                    onPress={() => {
                        this.setState({
                            isShowPisker: false
                        })
                    }}
                    style={styles.modalBg}>
                    <View style={styles.modalBgContainer}>
                        <Text style={styles.modalBgContainerText}>{datailsType === 'withdrawal' ? '提款信息' : '存款信息'}</Text>

                        {
                            datailsType == 'deposit' && <View style={{ backgroundColor: '#fff', borderRadius: 10 }}>
                                <View style={styles.modalListStyle}>
                                    <Text style={styles.modalListStyleText}>存款金额</Text>
                                    <Text style={styles.modalListStyleText1}><Text style={{ fontSize: 14 }}>￥</Text>{ctcDetailData.Amount}</Text>
                                </View>

                                {
                                    recordsDatails.PaymentMethodId.toLocaleUpperCase() == 'CTC' && (recordsDatails.MethodType.toLocaleUpperCase() == "INVOICE_AUT" || recordsDatails.MethodType.toLocaleUpperCase() == "CHANNEL") && <View>
                                        <View style={styles.modalListStyle}>
                                            <Text style={styles.modalListStyleText}>参考汇率</Text>
                                            <Text style={styles.modalListStyleText1}>{`1 ${ctcDetailData.CurrencyFrom} = ${ctcDetailData.CryptoExchangeRate} 人民币`}</Text>
                                        </View>

                                        {
                                            recordsDatails.MethodType.toLocaleUpperCase() == "CHANNEL" && <View style={[styles.modalListStyle, { backgroundColor: '#F5F5F5', marginHorizontal: 15, borderRadius: 6 }]}>
                                                <Text style={{ color: '#666', fontSize: 12 }}>请注意在完成交易时，汇率可能会发生变化。</Text>
                                            </View>
                                        }

                                        {
                                            Boolean(ctcDetailData.WalletAddress) && <View style={styles.modalListStyle}>
                                                <Text style={styles.modalListStyleText}>收款地址</Text>
                                                <Text style={styles.modalListStyleText1}>{ctcDetailData.WalletAddress}</Text>
                                            </View>
                                        }

                                        {
                                            recordsDatails.MethodType.toLocaleUpperCase() == "CHANNEL" && <View style={[styles.modalListStyle, { backgroundColor: '#F5F5F5', marginHorizontal: 15, borderRadius: 6, flexDirection: 'column', alignItems: 'flex-start', marginBottom: 15 }]}>
                                                {
                                                    Boolean(ctcDetailData.CurrencyFrom) && <Text style={{ color: '#666', fontSize: 12 }}>最低存款数量 : {ctcDetailData.MinAmount} {ctcDetailData.CurrencyFrom}. </Text>
                                                }
                                                <Text style={{ color: '#666', fontSize: 12 }}>该收款地址是您的专属地址，可以多次使用。</Text>
                                            </View>
                                        }

                                        {
                                            recordsDatails.MethodType.toLocaleUpperCase() == "INVOICE_AUT" && Boolean(ctcDetailData.CryptoTransactionHash) &&
                                            <View style={styles.modalListStyle}>
                                                <Text style={styles.modalListStyleText}>交易哈希</Text>
                                                <Text style={styles.modalListStyleText1}>{ctcDetailData.CryptoTransactionHash}</Text>
                                            </View>
                                        }
                                    </View>
                                }


                                {
                                    recordsDatails.PaymentMethodId.toLocaleUpperCase() == 'LB' && <View>
                                        <View style={styles.modalListStyle}>
                                            <Text style={styles.modalListStyleText}>存款人姓名</Text>
                                            <Text style={styles.modalListStyleText1}>{ctcDetailData.AccountHolderName && ctcDetailData.AccountHolderName.replace(/./g, '*')}</Text>
                                        </View>


                                        <View style={styles.modalListStyle}>
                                            <Text style={styles.modalListStyleText}>支付类型</Text>
                                            <Text style={styles.modalListStyleText1}>{ctcDetailData.MethodOriName}</Text>
                                        </View>
                                    </View>
                                }


                                {
                                    recordsDatails.PaymentMethodId.toLocaleUpperCase() == 'AP' && <View>
                                        <View style={styles.modalListStyle}>
                                            <Text style={styles.modalListStyleText}>AstroPay卡号</Text>
                                            <Text style={styles.modalListStyleText1}>{ctcDetailData.CardNo}</Text>
                                        </View>


                                        <View style={styles.modalListStyle}>
                                            <Text style={styles.modalListStyleText}>有效日期</Text>
                                            <Text style={styles.modalListStyleText1}>{ctcDetailData.ExpiredDate}</Text>
                                        </View>

                                        <View style={styles.modalListStyle}>
                                            <Text style={styles.modalListStyleText}>美金兑换汇率</Text>
                                            <Text style={styles.modalListStyleText1}>{ctcDetailData.ExchangeRate}</Text>
                                        </View>


                                        <View style={styles.modalListStyle}>
                                            <Text style={styles.modalListStyleText}>卡片面值 (USD/RMB)</Text>
                                            <Text style={styles.modalListStyleText1}>{ctcDetailData.Amount}</Text>
                                        </View>


                                        <View style={styles.modalListStyle}>
                                            <Text style={styles.modalListStyleText}>实际存入 (RMB)</Text>
                                            <Text style={styles.modalListStyleText1}>{ctcDetailData.ActualAmount}</Text>
                                        </View>
                                    </View>
                                }

                                {
                                    recordsDatails.PaymentMethodId.toLocaleUpperCase() == 'CC' && <View>
                                        <View style={styles.modalListStyle}>
                                            <Text style={styles.modalListStyleText}>现金卡序列号</Text>
                                            <Text style={styles.modalListStyleText1}>{ctcDetailData.SerialNo}</Text>
                                        </View>
                                    </View>
                                }


                                {
                                    Boolean(ctcDetailData.ActualAmount) && <View>
                                        <View style={styles.modalListStyle}>
                                            <Text style={styles.modalListStyleText}>系统提示金额</Text>
                                            <Text style={styles.modalListStyleText1}><Text style={{ fontSize: 14 }}>￥</Text>{ctcDetailData.ActualAmount}</Text>
                                        </View>
                                    </View>
                                }

                                {
                                    Boolean(ctcDetailData.GatewayName) && <View style={styles.modalListStyle}>
                                        <Text style={styles.modalListStyleText}>支付渠道</Text>
                                        <Text style={styles.modalListStyleText1}>{ctcDetailData.GatewayName}</Text>
                                    </View>
                                }
                            </View>

                        }


                        {
                            datailsType === 'withdrawal' && <View style={{ backgroundColor: '#fff', borderRadius: 10 }}>
                                <View style={styles.modalListStyle}>
                                    <Text style={styles.modalListStyleText}>提款金额</Text>
                                    <Text style={{ width: width - 140, fontSize: 14 }}><Text style={{ fontSize: 12 }}>￥</Text>{recordsDatails.Amount}</Text>
                                </View>


                                {
                                    recordsDatails.PaymentMethodId.toLocaleUpperCase() == 'LB' && <View>
                                        <View style={styles.modalListStyle}>
                                            <Text style={styles.modalListStyleText}>银行名称</Text>
                                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                                {/* <Image
                                                    resizeMode="stretch"
                                                    source={bankIcons[ctcDetailData.BankName] ? bankIcons[ctcDetailData.BankName].imgUrl : require('../../images/bank/bankicon/unionpay.png')}
                                                    style={{
                                                        width: 22,
                                                        height: 22,
                                                    }}
                                                /> */}
                                                <Text style={{ color: '#000', paddingLeft: 5, fontSize: 12 }}>{ctcDetailData.BankName}
                                                {/* {ctcDetailData.WithdrawalAccNumber && ' *************' + ctcDetailData.WithdrawalAccNumber.slice(-3)} */}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.modalListStyle}>
                                            <Text style={styles.modalListStyleText}>账户持有者全名</Text>
                                            <Text style={styles.modalListStyleText1}>{ctcDetailData.AccountHolderName &&ctcDetailData.AccountHolderName.replace(/./g,'*')}</Text>
                                        </View>
                                        <View style={styles.modalListStyle}>
                                            <Text style={styles.modalListStyleText}>银行账号</Text>
                                            <Text style={styles.modalListStyleText1}>{ctcDetailData.WithdrawalAccNumber && '*************'+ ctcDetailData.WithdrawalAccNumber.slice(-3)}</Text>
                                        </View>
                                        <View style={styles.modalListStyle}>
                                            <Text style={styles.modalListStyleText}>省 / 自治区</Text>
                                            <Text style={styles.modalListStyleText1}>{ctcDetailData.Province}</Text>
                                        </View>
                                        <View style={styles.modalListStyle}>
                                            <Text style={styles.modalListStyleText}>城市 / 城镇</Text>
                                            <Text style={styles.modalListStyleText1}>{ctcDetailData.City}</Text>
                                        </View>
                                        <View style={styles.modalListStyle}>
                                            <Text style={styles.modalListStyleText}>分行​</Text>
                                            <Text style={styles.modalListStyleText1}>{ctcDetailData.Branch}</Text>
                                        </View>
                                    </View>
                                }

                                {
                                    recordsDatails.PaymentMethodId.toLocaleUpperCase() == 'CCW' && ctcDetailData.WithdrawalCryptoAmount && <View>
                                        <View style={styles.modalListStyle}>
                                            <Text style={styles.modalListStyleText}>虚拟币等值数量</Text>
                                            <Text style={styles.modalListStyleText1}>{ctcDetailData.WithdrawalCryptoAmount} {ctcDetailData.WithdrawalCryptoCurrency}</Text>
                                        </View>

                                        <View style={{ backgroundColor: '#F5F5F5', borderRadius: 4, marginHorizontal: 12, paddingVertical: 10, paddingHorizontal: 10 }}>
                                            {
                                                recordsDatails.ReasonMsg != '' && <Text style={styles.reasonMsg}>{`${recordsDatails.ReasonMsg}`}</Text>
                                            }
                                        </View>

                                        <View style={styles.modalListStyle}>
                                            <Text style={styles.modalListStyleText}>钱包地址</Text>
                                            <View>
                                                <Text style={styles.modalListStyleText1}>{ctcDetailData.WithdrawalWalletName}</Text>
                                                <Text style={styles.modalListStyleText1}>{ctcDetailData.WithdrawalWalletAddress}</Text>
                                            </View>
                                        </View>
                                    </View>
                                }
                            </View>
                        }


                    </View>
                </TouchableHighlight>
            </Modal>
            {/* <TouchableOpacity
                    onPress={this.uploadImg.bind(this)}
                    style={[styles.recordsDatailsBtn, styles.recordsDatailsBtn1]}>
                    <Text style={{ color: '#fff' }}>上载文档</Text>
                </TouchableOpacity> */}
            <Modal animationType='fade' transparent={true} visible={isShowModal}>
                <View style={[styles.modalContainer]}>
                    <View style={[styles.modalBox]}>
                        <View style={[styles.modalTop]}>
                            <Text style={styles.modalTopText}>重要提示</Text>
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    isShowModal: false
                                })
                            }}>
                                <Text style={{ color: '#fff', fontSize: 20 }}>X</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBody}>
                            <View>
                                {
                                    ManualDepositText.map((v, i) => {
                                        return <Text key={i} style={[styles.manualDepositText, {
                                            color: true ? '#58585B' : '#fff'
                                        }]}>{v}</Text>
                                    })
                                }

                            </View>
                            <View style={styles.modalBtnBox}>
                                <TouchableOpacity style={[styles.modalBtn, { borderColor: '#00A6FF' }]} onPress={() => {
                                    this.setState({
                                        isShowModal: false
                                    })
                                    LiveChatOpenGlobe()
                                }}>
                                    <Text style={[styles.modalBtnText, { color: '#00A6FF' }]}>联系在线客服</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalBtn, { backgroundColor: '#00A6FF', borderColor: '#00A6FF' }]}
                                    onPress={() => {
                                        this.setState({
                                            isShowModal: false
                                        })
                                        Actions.pop()
                                        Actions.RedoDepositTransaction({
                                            recordsDatails,
                                            getDepositWithdrawalsRecords: () => {
                                                this.props.getDepositWithdrawalsRecords()
                                            }
                                        })
                                    }}
                                >
                                    <Text style={[styles.modalBtnText, { color: '#fff' }]}>是的，我明白了</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal animationType='fade' transparent={true} visible={isCancleFiance}>
                <View style={[styles.modalContainer]}>
                    <View style={[styles.modalBox]}>
                        <View style={[styles.modalTop, { justifyContent: 'center' }]}>
                            <Text style={styles.modalTopText}>{datailsType === 'deposit' ? '申请确认' : '取消提款'}</Text>
                        </View>
                        <View style={styles.modalBody}>
                            <View>
                                <Text style={styles.manualDepositText}>
                                    {
                                        datailsType === 'deposit' ? (`您确定要取消存款${recordsDatails.Amount}元吗?`) : (`您确定要取消提款${recordsDatails.Amount}元吗?`)
                                    }
                                </Text>
                            </View>
                            <View style={styles.modalBtnBox}>
                                <TouchableOpacity style={[styles.modalBtn, { borderColor: '#00A6FF' }]} onPress={() => {
                                    this.setState({
                                        isCancleFiance: false
                                    })
                                }}>
                                    <Text style={[styles.modalBtnText, { color: '#00A6FF' }]}>{datailsType === 'deposit' ? '不取消' : '返回'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalBtn, { backgroundColor: '#00A6FF', borderColor: '#00A6FF' }]}
                                    onPress={this.cancleFiance.bind(this)}
                                >
                                    <Text style={[styles.modalBtnText, { color: '#fff' }]}>{datailsType === 'deposit' ? '是的，我要取消' : '取消提款'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* 提款确认到账弹窗 */}
            <AbleCompleteFromUIPop
                AbleCompleteFromData={recordsDatails}
                IsAbleCompleteFromUIPop={IsAbleCompleteFromUIPop}
                recordes={'recordsDatails'}
                PopChange={() => {
                    //关闭
                    this.setState({ IsAbleCompleteFromUIPop: false })
                }}
                getDepositWithdrawalsRecords={() => {
                    this.props.getDepositWithdrawalsRecords()
                }}
                changeBettingHistoryDatesIndex={() => {
                    this.props.changeBettingHistoryDatesIndex(1)
                }}
            />

            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >

                <View style={{ backgroundColor: '#fff', borderRadius: 8, paddingVertical: 15, paddingHorizontal: 10 }}>
                    <View style={styles.datails}>
                        <Text style={[styles.topLeftText1, { color: true ? '#000000' : '#fff', fontSize: 14 }]}>
                            {recordsDatails.PaymentMethodName}
                            {
                                recordsDatails.PaymentMethodId == "CTC" && `(${CTCMethods[recordsDatails.MethodType]})`
                            }
                            {/* {datailsType === 'withdrawal' && recordsDatails.PaymentMethodId == 'LB' && ('-' + recordsDatails.MethodType)} */}
                        </Text>
                        {
                            (recordsDatails.StatusId == 1 || recordsDatails.StatusId == 4) && recordsDatails.MethodType == 'CHANNEL' ?
                                <Text style={{ color: '#000', textAlign: 'right' }}>-</Text>
                                :
                                <Text style={[styles.topRigthText3, { color: true ? '#000' : '#009DE3' }]}><Text style={{ fontSize: 14 }}>￥</Text>{recordsDatails.Amount}</Text>
                        }
                    </View>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[styles.topRigthText2, { color: '#BCBEC3', marginBottom: 6, marginTop: 2, fontSize: 12 }]}>{moment(recordsDatails.SubmittedAt).format('YYYY-MM-DD HH:mm')}</Text>
                            {
                                datailsType === 'withdrawal' && recordsDatails.TotalTransactionCount > 1 && recordsDatails.PaymentMethodId == "LB" && <Text style={[styles.topRigthText2, { color: '#BCBEC3', marginBottom: 6, marginTop: 2, fontSize: 12 }]}>提款申请</Text>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.topRigthText1, { color: '#BCBEC3', fontSize: 12 }]}>{recordsDatails.TransactionId}</Text>
                            <TouchableOpacity onPress={this.copyTXT.bind(this, recordsDatails.TransactionId)}>
                                <Text style={{ color: '#25AAE1', marginLeft: 8, fontSize: 12 }}>复制</Text>
                            </TouchableOpacity>
                        </View>
                        {
                            datailsType === 'withdrawal' && recordsDatails.TotalTransactionCount > 1 && recordsDatails.PaymentMethodId == "LB" && <View style={{ position: 'absolute', right: 0, bottom: -30, alignItems: 'flex-end' }}>
                                <Text style={{ color: '#00A6FF', fontWeight: '600', fontSize: 18 }}><Text style={{ fontSize: 13 }}>￥</Text>{recordsDatails.PaidAmount}</Text>
                                <Text style={{ color: '#999999', fontSize: 13 }}>实际到账</Text>
                            </View>
                        }
                    </View>


                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                isShowPisker: true
                            })
                        }}
                        style={styles.viewBtndetail}>
                        <Text style={{ color: '#25AAE1', fontWeight: '600', fontSize: 12 }}>查看{datailsType === 'deposit' ? '存' : '提'}款信息</Text>
                    </TouchableOpacity>

                    {
                        datailsType === 'deposit' && <View>
                            <View style={{ borderTopWidth: 1, borderTopColor: '#EFEFF4', marginTop: 15, paddingTop: 20, borderBottomColor: '#EFEFF4', paddingBottom: 40, borderBottomWidth: 1, marginBottom: 25 }}>
                                <View>
                                    <View style={{ flexDirection: 'row' }}>
                                        {
                                            (statusId == 1 || statusId == 4) ?
                                                <Image source={require('../../images/record4.png')} resizeMode='stretch' style={[styles.iconImg, styles.iconImg1]}></Image>
                                                :
                                                <Image source={require('../../images/record1.png')} resizeMode='stretch' style={[styles.iconImg, styles.iconImg1]}></Image>
                                        }


                                        <View style={{ marginLeft: 15 }}>
                                            <Text style={{ color: recordsStatusItem.color1, fontSize: 12 }}>{recordsStatusItem.text1}</Text>
                                            <Text style={{ color: recordsStatusItem.borderColor1, position: 'absolute', bottom: 0, width: 200, bottom: -15, fontSize: 12 }}>{moment(recordsDatails.ProcessingDatetime).format('YYYY-MM-DD HH:mm')}</Text>
                                        </View>
                                    </View>


                                    <View style={{ backgroundColor: '#DCDCE0', width: 2, height: 40, marginVertical: 6, marginLeft: 10 }}></View>
                                    <View style={{ flexDirection: 'row' }}>
                                        {
                                            statusId == 2 ?
                                                <Image source={require('../../images/record3.png')} resizeMode='stretch' style={[styles.iconImg, styles.iconImg1]}></Image>
                                                :
                                                (
                                                    statusId == 3 ?
                                                        <Image source={require('../../images/record2.png')} resizeMode='stretch' style={[styles.iconImg, styles.iconImg1]}></Image>
                                                        :
                                                        ViewIcon
                                                )


                                        }
                                        <View style={{ marginLeft: 15 }}>
                                            <Text style={{ color: recordsStatusItem.color2, fontSize: 12 }}>{recordsStatusItem.text2}</Text>
                                            {
                                                statusId == 2 && <Text style={{
                                                    color: recordsStatusItem.borderColor2,
                                                    position: 'absolute', bottom: 0, width: 200, bottom: -15, fontSize: 12
                                                }}>{moment(recordsDatails.ApprovedDatetime).format('YYYY-MM-DD HH:mm')}</Text>
                                            }

                                            {
                                                statusId == 3 && <Text style={{
                                                    color: recordsStatusItem.borderColor2,
                                                    position: 'absolute', bottom: 0, width: 200, bottom: -15, fontSize: 12
                                                }}>{moment(recordsDatails.RejectedDatetime).format('YYYY-MM-DD HH:mm')}</Text>
                                            }
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {
                                this.createBtnStatus()
                            }
                        </View>
                    }


                    {
                        datailsType === 'withdrawal' && <View>
                            <View style={{ borderTopWidth: 1, borderTopColor: '#EFEFF4', marginTop: 15, paddingTop: 20, borderBottomColor: '#EFEFF4', paddingBottom: 40, borderBottomWidth: 1, marginBottom: 25 }}>
                                <View>
                                    {
                                        recordsDatails.TotalTransactionCount > 1 && recordsDatails.PaymentMethodId == "LB" && <View style={{
                                            backgroundColor: '#FFF5BF',
                                            borderRadius: 4, padding: 10, marginBottom: 10
                                        }}>
                                            <Text style={{ fontSize: 13, color: '#83630B' }}>基于安全问题，您的提现申请额将分成{recordsDatails.TotalTransactionCount}次汇入您的账户。</Text>
                                        </View>
                                    }

                                    <View style={{ flexDirection: 'row' }}>
                                        {
                                            (statusId == 1 || statusId == 7) ?
                                                <Image source={require('../../images/record5.png')} resizeMode='stretch' style={styles.iconImg}></Image>
                                                :
                                                <Image source={require('../../images/record1.png')} resizeMode='stretch' style={[styles.iconImg, styles.iconImg1]}></Image>
                                        }

                                        <View style={{ marginLeft: 15 }}>
                                            <Text style={{ color: recordsStatusItem.color1, fontSize: 12 }}>{recordsStatusItem.text1}</Text>
                                            <Text style={{ color: recordsStatusItem.borderColor1, position: 'absolute', bottom: 0, width: 200, bottom: -15, fontSize: 12 }}>{moment(recordsDatails.ProcessingDatetime).format('YYYY-MM-DD HH:mm')}</Text>
                                        </View>
                                    </View>

                                    <View style={{ backgroundColor: '#DCDCE0', width: 2, height: 40, marginVertical: 6, marginLeft: 10 }}></View>
                                    <View style={{ flexDirection: 'row' }}>
                                        {
                                            [2, 3, 8, 9].includes(statusId)
                                                ?
                                                <Image source={require('../../images/record4.png')} resizeMode='stretch' style={styles.iconImg}></Image>
                                                :
                                                (
                                                    (statusId == 5 || statusId == 4)
                                                        ?
                                                        <Image source={require('../../images/record1.png')} resizeMode='stretch' style={[styles.iconImg, styles.iconImg1]}></Image>
                                                        :
                                                        (
                                                            statusId == 6 ?
                                                                <Image source={require('../../images/record1.png')} resizeMode='stretch' style={[styles.iconImg, styles.iconImg1]}></Image>
                                                                :
                                                                statusId == 10
                                                                    ?
                                                                    <Image source={require('../../images/record1.png')} resizeMode='stretch' style={[styles.iconImg, styles.iconImg1]}></Image>
                                                                    :
                                                                    ViewIcon
                                                        )

                                                )

                                        }
                                        <View style={{
                                            marginLeft: 15
                                        }}>
                                            <Text style={{ color: recordsStatusItem.color2, fontSize: 12 }}>{recordsStatusItem.text2}
                                                {
                                                    recordsDatails.TotalTransactionCount > 1 && recordsDatails.PaymentMethodId == "LB" && `(${recordsDatails.SubTransactionCount}/${recordsDatails.TotalTransactionCount})`
                                                }
                                            </Text>
                                            {
                                                statusId != 1 && <Text style={{ color: recordsStatusItem.borderColor2, position: 'absolute', bottom: 0, width: 200, bottom: -15, fontSize: 12 }}>
                                                    {moment(recordsDatails.PendingDatetime).format('YYYY-MM-DD HH:mm')}
                                                </Text>
                                            }
                                        </View>
                                    </View>

                                    {
                                        // statusId != 6 && 
                                        <View>
                                            <View style={{ backgroundColor: '#DCDCE0', width: 2, height: 40, marginVertical: 6, marginLeft: 10 }}></View>
                                            <View style={{ flexDirection: 'row' }}>
                                                {
                                                    statusId == 5
                                                        ?
                                                        <Image source={require('../../images/record2.png')} resizeMode='stretch' style={styles.iconImg}></Image>
                                                        :
                                                        (
                                                            statusId == 4
                                                                ?
                                                                <Image source={require('../../images/record3.png')} resizeMode='stretch' style={styles.iconImg}></Image>
                                                                :
                                                                statusId == 10
                                                                    ?
                                                                    (
                                                                        recordsDatails.TotalTransactionCount == recordsDatails.SubTransactionCount
                                                                            ?
                                                                            <Image source={require('../../images/record3.png')} resizeMode='stretch' style={styles.iconImg}></Image>
                                                                            :
                                                                            <Image source={require('../../images/record33.png')} resizeMode='stretch' style={styles.iconImg}></Image>
                                                                    )
                                                                    :
                                                                    ViewIcon
                                                        )
                                                }
                                                <View style={{
                                                    marginLeft: 15
                                                }}>
                                                    <Text style={{ color: recordsStatusItem.color3, fontSize: 12 }}>{recordsStatusItem.text3}</Text>

                                                    {/* 4 //'已完成'
                                                        5 //'拒绝'
                                                        6 //cancle
                                                        10 //比分 */}

                                                    {
                                                        (statusId == 10 || statusId == 4 || statusId == 5 || statusId == 6) && <Text style={{ color: recordsStatusItem.borderColor3, position: 'absolute', bottom: 0, width: 200, bottom: -15, fontSize: 12 }}>
                                                            {moment((statusId == 5 || statusId == 6) ? recordsDatails.RejectedDatetime : recordsDatails.ApprovedDatetime).format('YYYY-MM-DD HH:mm')}
                                                        </Text>
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                    }
                                </View>
                            </View>

                            {
                                this.createBtnStatus()
                            }
                        </View>
                    }
                </View>
            </ScrollView>
        </ViewShot>
    }
}

const styles = StyleSheet.create({
    ableCompleteReasonMsg: {
        position: 'absolute',
        bottom: -70,
        zIndex: 99,
    },
    reasonMsg: {
        marginBottom: 12,
        fontSize: 12,
        lineHeight: 19,
        color: '#666'
    },
    viewBtndetail: {
        borderWidth: 1,
        borderRadius: 6,
        width: 90,
        alignItems: 'center',
        paddingVertical: 4,
        borderColor: '#00A6FF',
        marginTop: 10
    },
    btnBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    modalBg: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, .4)',
        width,
        height,
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 10000,
        justifyContent: 'flex-end',
    },
    modalBgContainer: {
        backgroundColor: '#EFEFF4',
        paddingTop: 15,
        paddingHorizontal: 10,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingBottom: 40
    },
    modalBgContainerText: {
        textAlign: 'center',
        fontSize: 16,
        paddingBottom: 25,
        color: '#000000',
        fontWeight: '600'
    },
    viewContainer: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 20
    },
    datails: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    topLeftText1: {
        color: '#9B9B9B'
    },
    topRigthText1: {
        color: '#000'
    },
    topRigthText2: {
        color: '#9B9B9B',
    },
    topRigthText3: {
        color: '#000',
        fontSize: 18,
        textAlign: 'right'
    },
    recordsDatailsBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#25AAE1',
        height: 40,
        marginBottom: 10,
        backgroundColor: '#00A6FF',
        borderRadius: 8,
    },
    recordsDatailsBtn1: {
        width: (width - 40) * .45
    },
    recordsDatailsBtnText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    modalListStyle: {
        paddingVertical: 12,
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15
    },
    modalListStyleText: {
        color: '#999999',
        width: 95,
        marginRight: 5,
        fontSize: 12
    },
    modalListStyleText1: {
        width: width - 140,
        fontSize: 12
    },
    depositStatusBox: {
        flexDirection: 'row',
        height: 32,
        width: 240,
        alignItems: 'center',
        borderRadius: 100,
        borderWidth: 1,
        paddingLeft: 35
    },
    depositStatusImg: {
        marginRight: 5,
        width: 18,
        height: 18,
        position: 'absolute',
        left: 10
    },
    recordsStatusBox: {
        position: 'relative',
        marginTop: 10,
        marginBottom: 20
    },
    recordsStatusBoxLine: {
        width: 2,
        height: 20,
        backgroundColor: '#B2B2B2',
        marginLeft: 18
    },
    depositStatusBoxText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
    },
    iconImg: {
        width: 20,
        height: 20
    },
    iconImg1: {
        transform: [{ scale: .8 }]
    },
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
    modalTop: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#25AAE1',
        flexDirection: 'row',
        paddingHorizontal: 20,
        backgroundColor: '#00A6FF'
    },
    modalTopText: {
        color: '#fff',
        fontSize: 16
    },
    modalBody: {
        paddingTop: 20,
        paddingBottom: 15,
        paddingHorizontal: 15
    },
    modalClose: {
        position: 'absolute',
        top: 25,
        right: 25,
        zIndex: 99,
    },
    modalContainerText: {
        color: '#333333',
        fontSize: 14,
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
    manualDepositText: {
        lineHeight: 22,
        color: '#666',
    },
    deposiBanktList: {
        backgroundColor: '#fff',
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 55,
        paddingHorizontal: 10,
        justifyContent: 'center',
        borderTopWidth: 1,
    },
})

export default (recordsDatails)