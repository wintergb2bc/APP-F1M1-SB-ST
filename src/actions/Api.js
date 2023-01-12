
window.openOrien = ''//是否开启竖屏锁定
window.LiveChatX = ""; //克服
window.userNameDB = ""; //
window.lookBox = false; // 先去瞧瞧
window.memberCode = ""; //用戶memberCode
window.UpdateV = 5000;
window.Rb88Version = "1.0.9.0"; //版本號
window.SBTDomain;
window.affCodeKex = ""; //代理號
window.isGameLock = false;
window.E2Backbox = "No dataBase"; // 黑盒子
window.Iovation = "No dataBase"; // 黑盒子
window.LiveChatOpen = false//客服
window.LivechatDragType = false// 客服懸浮球 
window.DeviceInfoIos = true//ios手机型号是没有指纹的
window.VPNCheck = false//VPN是否打开
window.memberDataLogin = null;//从 api/Login拿到的member数据
window.Devicetoken = ""
window.userMAC = ""
window.UmPma = false /// 給友盟推送近PMA 如未登錄 先登錄後跳進PMA by benji
window.IM_Token = ''
window.IM_MemberCode = ''
window.loginStatus = ''
window.VendorData = ''//当前的Vendor，
window.lowerV = 'IM'//当前游戏
window.notificationInfo = ''//游戏推送
window.notificationRecommend = ''//消息推送
global.Toasts = ''
window.GameListNum = 0//游戏个数
window.bonusState = false //充值优惠申请是否成功
window.isMobileOpen = false//是否mobile跳转过来，带token
window.GetE2 = false
window.EuroCupLogin = false
window.maintenanceLiveChatXT = ''//维护客服
window.MAIN = 0,
window.SelfExclusionRestriction = {DisableBetting: false, DisableDeposit: false, DisableFundIn: false}//自我锁定,投注锁定，存款锁定，转账锁定
window.LoginPatternHeight = 0//九宫格高度差
window.LoginTouchNum = 0//指纹脸部错误次数，3次不能使用
window.LoginPatternNum = 0//九宫格错误次数，3次不能使用
window.FastLoginErr = 0//是否快速登陆
window.lockLogin = 0//登陆错误锁定账号次数
window.getMiniGames = false
window.DeviceSignatureBlackBox = ''//otp验证设备参数
window.BankCardPhoneVerify = false//判断姓名银行卡手机验证是否通过，通过未登出前就不需要再验证






window.ApiPort = {
  Token: null, // 用戶token
  ReToken: null, // 用戶REtoken
  UserLogin: false, //用戶登錄狀態
  login: "/api/Login?", //獲取登入地址  POST
  MemberRestricted: "/api/Member/MemberRestricted?",//注册
  logout: "/api/logout?", //登出    POST
  NotificationOne: "/api/Notification?", //POST 第一次開app 註冊友盟個推
  NotificationLogin: "/api/Notification?", //PATCH 第一次開app 註冊友盟個推
  LiveChat: "/api/LiveChat/Url?", //克服
  ForgetPasswordByEmail: '/api/Member/Email/ForgetPasswordByEmail?',//忘记密码
  ForgetUsernameByEmail: '/api/Member/ForgetUsernameByEmail?',//忘记账户
  Member: '/api/Member?',//账号信息
  GetSelfExclusionRestriction: '/api/Member/GetSelfExclusionRestriction?',
  CustomFlag: '/api/Member/CustomFlag?',//判断是否需要验证手机和银行卡信息，是否可以修改号码
  BankCardVerification: '/api/Payment/BankCardVerification?',//提交身份证银行卡姓名
  PhoneVerify: '/api/Member/Phone/Verify?',//获取手机验证码
  PhoneTAC: '/api/Member/Phone/TAC?',//验证手机
  EmailVerify: '/api/Member/Email/Verify?',//获取邮箱验证码
  EmailTAC: '/api/Member/Email/VerifyTac?',//验证手机验证码
  ResendAttempt: '/api/Member/ResendAttempt',//获取手机验证码到期时间
  VerificationAttempt: '/api/Member/VerificationAttempt',//邮箱电话获取剩余验证次数
  Balance: '/api/Balance?',//获取金额
  UnreadMessage: '/api/Member/Statistics?',//获取未读消息
  GetAnnouncements: '/api/Announcement/Announcements?',
  GetAnnouncementDetail: '/api/Announcement/AnnouncementIndividualDetail',
  GetMessages: '/api/PersonalMessage/InboxMessages',
  GetMessageDetail: '/api/PersonalMessage/InboxMessageIndividualDetail',
  UpdateMessage: '/api/PersonalMessage/ActionOnInboxMessage?',
  UpdateAnnouncement: '/api/Announcement/ActionOnAnnouncement?',
  GetMemberNotificationSetting: '/api/Vendor/sbs/GetMemberNotificationSetting?',
  EditMemberNotificationSetting: '/api/Vendor/sbs/EditMemberNotificationSetting?',
  Wallets: "/api/Transfer/Wallets?", //獲取目標帳戶
  Member: "/api/Member?", // 會員數據 Get
  Transfer:"/api/Transfer/Applications?",//轉帳
  PaymentApplications: "/api/Payment/Applications?", //付款
  GetCryptocurrencyInfo: "/api/Payment/Methods/GetCryptocurrencyInfo",//极速虚拟币支付
  GetProcessingDepositbyMethod: '/api/Payment/Transactions/GetProcessingDepositbyMethod?', // new 极速虚拟币支付提交
  ProcessInvoiceAutCryptoDeposit: '/api/Payment/Cryptocurrency/ProcessInvoiceAutCryptoDeposit', //虛擬幣2成功充值
  POSTMemberCancelDeposit: '/api/Payment/Applications/MemberCancelDeposit?', //取消交易
  Payment: "/api/Payment/Methods", //充值
  PaymentDetails: "/api/Payment/Methods/Details", //充值細節
  SuggestedAmount: '/api/Payment/SuggestedAmount?', // 充值檢測SuggestedAmount
  BonusCalculate: "/api/Bonus/Calculate?", //存款轉帳優惠 檢測
  Bonus: "/api/Bonus", // 存款主賬優惠
  GopayLB: "/api/Payment/Applications/", //本銀 在線支付 完成請求
  GetIMToken: '/api/Vendor/IPSB/Token?',
  BonusApplications: '/api/Bonus/Applications?',
  GETSBTToken: '/api/Vendor/SBT/Token?', //BTI舊版
  GETBTIToken: '/api/Vendor/BTI/Token?', //BTI新版
  GETBalanceSB: '/api/Balance?wallet=SB&',
  'GetMemberBanks': '/api/Payment/MemberBanks',
  'MemberBanks': '/api/Payment/MemberBanks?',//用戶銀行卡
  GetProvidersMaintenanceStatus: '/api/Games/GetProvidersMaintenanceStatus?',
  Password: '/api/Member/Password?oldPasswordRequired=false&',
  NotifyBettingInfo: '/api/Vendor/NotifyBettingInfo?',
  CancelPaybnbDeposit: '/api/Payment/Applications/Transactions/CancelPaybnbDeposit?',
  Games: '/api/Games/0?',
  MiniGames: '/api/MiniGames?',//双11活动url
  MiniGamesBanners: '/api/MiniGames/Banners?',
  SnatchPrize: '/api/MiniGames/SnatchPrize?',
  PrizeHistory: '/api/MiniGames/PrizeHistory?',
  MiniGamesActiveGame: '/api/MiniGames/ActiveGame?',
  MemberProgress: '/api/MiniGames/MemberProgress?',
  ConfirmWithdrawalComplete: '/api/Payment/Applications/ConfirmWithdrawalComplete?',

  // 欧洲杯
  getEuroTeamStat: '/api/v1.0/brands/FUN88/teams/stats?', // 球队数据
  getEuroGroupList: '/api/v1.0/brands/FUN88/groups?', // 球队排名
  getEuroPlayer: '/api/v1.0/brands/FUN88/players/stats/',// 球员数据
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
  /* 取消存款 */
  MemberRequestDepositReject: '/api/Payment/Applications/MemberRequestDepositReject?',
  'GetProfileMasterData': '/api/ProfileMasterData?','BankingHistory': '/api/Payment/Applications/BankingHistory?',
  'CryptoExchangeRate': '/api/Payment/Cryptocurrency/ExchangeRate?',//加密貨幣匯率
  'PATCHMemberBanksDefault': '/api/Payment/MemberBanks/','TransferApplicationsByDate': '/api/Transfer/ApplicationsByDate',//轉賬紀錄
  'CryptoWallet': '/api/Payment/MemberCryptocurrencyWalletAddress',//加密貨幣錢包
  'SendSmsOTP': '/api/Payment/SendSmsOTP?',
  'VerifySmsOTP': '/api/Payment/VerifySmsOTP?',
  'CheckIsAbleSmsOTP': '/api/Payment/CheckIsAbleSmsOTP?',
  'Register': '/api/Member?',//註冊   POST
  'Banner': '/api/CMS/Banners?',   //banner 數據 Get 
  'GetEmailVerifyCode': '/api/Verification/Email/Verify?',
	'PostEmailVerifyTac': '/api/Verification/Email/VerifyTac?',
	'GetPhoneVerifyCode': '/api/Verification/Phone/Verify?',
	'POSTNoCancellation': '/api/Payment/Applications/', //提款記錄取消
  'GetResubmitOnlineDepositDetails': '/api/Payment/Transactions/GetResubmitDepositDetails?',
  'PostPhoneVerifyCode': '/api/Verification/Phone/TAC?',
  'CreateResubmitOnlineDeposit': '/api/Payment/Transactions/CreateResubmitOnlineDeposit?',
  'GetTransactionHistory': '/api//Payment/Transactions/GetTransactionHistory?',
  'UploadAttachment': '/api/Payment/Applications/UploadAttachment?'
};



