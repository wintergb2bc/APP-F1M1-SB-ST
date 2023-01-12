

export const ApiPort = {
    Login: '/api/Login?', // 獲取登入地址 POST
    Register: '/api/Member/MemberRestricted?', //注册   POST
    Member: '/api/Member?',
    GETALLBalance: '/api/Balance?',
    GETBalanceSB: '/api/Balance?wallet=SB&',
    ForgetPwd: '/api/Member/Email/ForgetPasswordByEmail?',
    ForgetUsername: '/api/Member/ForgetUsernameByEmail?',
    Logout: '/api/member/Logout?',
    LogoutP4: '/Services/Login.ashx?action=logout',
    getMainsiteDomain: '/api/App/URLs?',
    Domaincheck: `/api/App/Domain?hostname=`,
    PhoneOTP: '/api/Member/Phone/Verify?',
    VerifyPhoneOTP: '/api/Member/Phone/TAC?',
    EmailOTP: '/api/Member/Email/Verify?',
    VerifyEmailOTP: '/api/Member/Email/VerifyTac?',
    ResetPassword: '/api/Member/ForgetPassword?',
    ChangePassword: '/api/Member/Password?oldPasswordRequired=false&',
    GETPaymentlistAPI: '/api/Payment/Methods?transactionType=Deposit&',
    GETDepositDetailsAPI: '/api/Payment/Methods/Details?transactionType=deposit&',
    POSTApplications: '/api/Payment/Applications?',
    POSTPaymentConfirmStep: '/api/Payment/Applications/',
    POSTMemberCancelDeposit: '/api/Payment/Applications/MemberCancelDeposit?', //取消交易
    GETBalance: '/api/Balance?wallet=&',
    GETWallets: '/api/Transfer/Wallets?',
    POSTTransfer: '/api/Transfer/Applications?',
    GETLiveChat: '/api/LiveChat/Url?',
    GetProvidersMaintenanceStatus: '/api/Games/GetProvidersMaintenanceStatus?',
    GetAnnouncements: '/api/Announcement/Announcements?',
    GetAnnouncementDetail: '/api/Announcement/AnnouncementIndividualDetail',
    GetMessages: '/api/PersonalMessage/InboxMessages',
    GetMessageDetail: '/api/PersonalMessage/InboxMessageIndividualDetail',
    UpdateMessage: '/api/PersonalMessage/ActionOnInboxMessage?',
    UpdateAnnouncement: '/api/Announcement/ActionOnAnnouncement?',
    UnreadMessage: '/api/Member/Statistics?',
    VerifyPhone: '/api/Setting/Phone/Prefix?',
    GetTLCPoint: '/api/Member/MemberRewardDetail?',
    GETMemberlistAPI: '/api/Member?',
    PATCHMemberlistAPI: '/api/Member?',
    PUTMemberlistAPI: '/api/Member?',
    GetQuestions: '/api/Member/SecretQuestions?',
    GETBonuslistAPI: '/api/Bonus?transactionType=Deposit&',
    GETMemberBanksfirst: '/api/Payment/MemberBanks?',
    GETCanWithdrawalPay: '/api/Payment/Methods?transactionType=Withdrawal&',
    GetCryptocurrencyInfo: '/api/Payment/Methods/GetCryptocurrencyInfo?', // 极速虚拟币支付提交
    GetProcessingDepositbyMethod: '/api/Payment/Transactions/GetProcessingDepositbyMethod?', // new 极速虚拟币支付提交
    SuggestedAmount: '/api/Payment/SuggestedAmount?', // 推荐金额
    ProcessInvoiceAutCryptoDeposit: '/api/Payment/Cryptocurrency/ProcessInvoiceAutCryptoDeposit', //虛擬幣2成功充值
    GetMemberNotificationSetting: '/api/Vendor/sbs/GetMemberNotificationSetting?',
    EditMemberNotificationSetting: '/api/Vendor/sbs/EditMemberNotificationSetting?',
    GetMemberNotificationSetting: '/api/Vendor/sbs/GetMemberNotificationSetting?',
    EditMemberNotificationSetting: '/api/Vendor/sbs/EditMemberNotificationSetting?',
    GetIMToken: '/api/Vendor/IPSB/Token?',
    GETSBTToken: '/api/Vendor/SBT/Token?', //BTI舊版
    GETBTIToken: '/api/Vendor/BTI/Token?', //BTI新版
    GetSABAToken: '/api/Vendor/OWS/Token?',
    /* 刷新token */
    RefreshTokenapi: '/api/Refresh?',
    ALBStatus: '/api/Payment/UpdateIsQRLocalAliPay?',
    NotifyBettingInfo: '/api/Vendor/NotifyBettingInfo?',
    /* 优惠 */
    GetPromotions: '/api/CMS/Promotions?',
    /* 申请优惠 */
    ApplicationsBonus: '/api/CMS/Promotions/Applications?',
    /* 领取红利 */
    ClaimBonus: '/api/Bonus/Claim?',
    /* 取消优惠 */
    CancelPromotion: '/api/Bonus/CancelPromotion?',
    /* 每日好礼 */
    DailyDealsPromotion: '/api/CMS/DailyDealsPromotion?',
    /* 获得城镇地址 */
    AddressTown: '/api/DailyDeals/Town?',
    /* 获得市区地址 */
    AddressDistrict: '/api/DailyDeals/District?',
    /* 获得省份地址 */
    AddressProvince: '/api/DailyDeals/Province?',
    /* 地址相关 */
    ShippingAddress: '/api/DailyDeals/ShippingAddress?',
    /* 删除地址 */
    DeleteShippingAddress: '/api/DailyDeals/ShippingAddress',
    /* 申请每日好礼 */
    ApplyDailyDeals: '/api/CMS/ApplyDailyDeals?',
    /* 好礼记录 */
    DailyDealsHistory: '/api/CMS/DailyDealsHistory?',

    getEuroGroupList: '/api/v2.0/brands/FUN88/groups', // 球隊排名
    getEuroTeamStat: '/api/v2.0/brands/FUN88/teams/stats', // 獲取各隊數據
    getEuroTeamMatches: '/sports-data-gateway/api/v2.0/brands/FUN88/matches',
    getEuroPlayer: '/api/v2.0/brands/FUN88/players/stats/',// 獲取球員數據
    GetProvidersMaintenanceStatus: '/api/Games/GetProvidersMaintenanceStatus?',
};
