const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    bgColor: {
      type: String,
      default: ''
    }, 
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    bgImage: {
      type: String,
      default: ''
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },
  /**
   * 组件的方法列表
   */
  methods: {
    BackPage() {
      wx.navigateBack({
        delta: 1
      });
    },
    toHome(){
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      /** TODO在这里可以写ajax求得选项 */
      var data = wx.getMenuButtonBoundingClientRect()
      console.log(app.globalData);
      console.log('菜单按键宽度：', data.width)
      console.log('菜单按键高度：', data.height)
      console.log('菜单按键上边界坐标：', data.top)
      console.log('菜单按键右边界坐标：', data.right)
      console.log('菜单按键下边界坐标：', data.bottom)
      console.log('菜单按键左边界坐标：', data.left)
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  }
})