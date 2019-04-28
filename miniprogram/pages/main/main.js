//index.js
const app = getApp()                                           //定义变量

Page({                                                        //定义数据
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {                                     //默认加载
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
        // 调用云函数                                      //默认加载openid
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            console.log('[云函数] [login] user openid: ', res.result.openid)
            app.globalData.openid = res.result.openid
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
            wx.navigateTo({
              url: '../deployFunctions/deployFunctions',
            })
          }
        })
  },

  

  bindGetUserInfo: function (e) {                          //点击获取用户信息
    var that = this;
    //此处授权得到userInfo
    console.log(e.detail.userInfo);
    //接下来写业务代码

  },


})
