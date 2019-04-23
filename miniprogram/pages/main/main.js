//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

     

        // 调用云函数
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

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
    
  },
  

  bindGetUserInfo: function (e) {
    var that = this;
    //此处授权得到userInfo
    console.log(e.detail.userInfo);
    //接下来写业务代码

  },


  onAdd:function() {


         
  
      wx.getUserInfo({
        withCredentials:true,
        success: res => {
          var userInfo = res.userInfo
          app.globalData.nickName = userInfo.nickName
          var gender = userInfo.gender
          var myDate = new Date()
          app.globalData.mytime = myDate.toLocaleString()
          app.globalData.avatarUrl = userInfo.avatarUrl
          if (gender = 1) { app.globalData.gen = "先生" }
          else { app.globalDatagen = "女士" } 
        this.setData({
            avatarUrl: res.userInfo.avatarUrl,
            userInfo: res.userInfo
          })
        },
        fail: function () {
          //获取用户信息失败后。请跳转授权页面
          wx.showModal({
          title: '警告',
          content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
          success: function (res) {
          if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateTo({
          url: '../tologin/tologin',
          })
          }
         }
        })
        },
        })
   
        //console.log(app.globalData.nickName)
        const db = wx.cloud.database()
        db.collection('counters').add({
          data: {
            nickname: app.globalData.nickName,
            mytime:app.globalData.mytime,
            avatarUrl:app.globalData.avatarUrl,
            gen: app.globalData.gen,
          },
          success: res => {
            // 在返回结果中会包含新创建的记录的 _id
            this.setData({
              
              counterId: res._id,
              count: 1
            })
            wx.showToast({
              title: '新增记录成功',
            })
            console.log('[数据库] [新增记录] 成功，记录 _id: ',res._id)
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '新增记录失败'
            })
            console.error('[数据库] [新增记录] 失败：', err)
          }
        }) 

  },

})
