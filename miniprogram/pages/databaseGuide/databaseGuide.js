// pages/databaseGuide/databaseGuide.js

const app = getApp()
const db = wx.cloud.database({});
const cont = db.collection('counters');
Page({

  data: {
    book_list:[]
  },

  onLoad: function () {
 
    db.collection('counters').get({
      success(res){
        console.log(res.data[0]),
        book_list = res.data,
        console.log(book_list.length)
        
        this.setData({
          book_list: res.data
        })
        
        
       

      }
    })
  },

  onQuery: function() {
     
     // 查询当前用户所有的 counters
     db.collection('counters').get({
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


  prevStep: function () {
    this.setData({
      step: this.data.step - 1
    })
  },

  goHome: function() {
    const pages = getCurrentPages()
    if (pages.length === 2) {
      wx.navigateBack()
    } else if (pages.length === 1) {
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      wx.reLaunch({
        url: '../index/index',
      })
    }
  }

})