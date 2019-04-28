//index.js
const app = getApp();                              //定义变量
const db = wx.cloud.database({});
const cont = db.collection('jiaolian3');

Page({                                             //定义页面数据
  data: {
    
  },

  onLoad: function() {                             //默认加载获取用户信息
      
    wx.getUserInfo({
      withCredentials:true,
      success: res => {
        var userInfo = res.userInfo
        app.globalData.nickName = userInfo.nickName
        var gender = userInfo.gender
        var myDate = new Date()
        app.globalData.mydate = myDate.toDateString()
        app.globalData.mytime = myDate.toLocaleString()
        app.globalData.avatarUrl = userInfo.avatarUrl
        
        if (gender = 1) { app.globalData.gen = "先生" }
        else { app.globalData.gen = "女士" } 
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
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
        // 查询当前用户所有的 counters
        db.collection('jiaolian3').count().then(res =>{
          console.log(res.total)
    
    
            this.setData({
              message : res.total
    
            })
       
        })  
  },


  onAdd:function() {

        
        //console.log(app.globalData.nickName)
        const db = wx.cloud.database()

        db.collection('jiaolian3').where({_openid:app.globalData.openid}).get({
          success:res =>{
     
       
            var newdate = app.globalData.mydate
            var len = res.data.length 
            console.log(len)
            console.log(newdate)
            
            if(len===0){
              db.collection('jiaolian3').add({
                data: {
                  nickname: app.globalData.nickName,
                  mytime:app.globalData.mytime,
                  avatarUrl:app.globalData.avatarUrl,
                  gen: app.globalData.gen,
                  mydate: app.globalData.mydate,
                  biaozhi:1
                  }, 
                })
                console.log('今日第一次签到！')      

            }
            var olddate =  res.data[res.data.length-1].mydate
            console.log(olddate)  //获取数据库中上一条记录的mytime

            if(len>0 & olddate!=newdate){


              db.collection('jiaolian3').add({
                data: {
                  nickname: app.globalData.nickName,
                  mytime:app.globalData.mytime,
                  avatarUrl:app.globalData.avatarUrl,
                  gen: app.globalData.gen,
                  mydate: app.globalData.mydate,
                  biaozhi:1
                  },
                success: res => {
      
                  // 在返回结果中会包含新创建的记录的 _id
                  this.setData({
                    
                    counterId: res._id,
                    count: 1
                  })
                  wx.showToast({
                    title: '签到成功',
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
          }
          if(len>0 & olddate==newdate){
            console.log('您今日已经签到！')
            this.setData({
              qiandao:'您今日已经签到！'
            })
          }

          },

          fail:err => {
             console.log('读数据失败')
            },
          
        }) 

   },


  onQueryCloud:function() {

    wx.cloud.init({
      traceUser:true,
      env:"test-c50aj"

    })

     wx.cloud.callFunction({
       name:'jiaolian3',
       complete:res=>{
        this.setData({
          book_list : res.data
        })
         //console.log('时间：',res)
       }
     })
    },


  onQuery: function() {
     
    // 查询当前用户所有的 counters
    db.collection('jiaolian3').get({
      success: res => {

        this.setData({
          book_list : res.data

        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  sumOnQuery: function() {
     
    // 查询当前用户所有的 counters
    db.collection('jiaolian3').count().then(res =>{
      console.log(res.total)


        this.setData({
          message : res.total

        })
   
    })  
  }



})
