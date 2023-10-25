import { sys } from "cc";
import { UIManager } from "../../Manager/UIManager";

/**
 * 检测当前的小程序
 * 是否是最新版本，是否需要下载、更新
 */
export function checkUpdateVersion() {
    //判断微信版本是否 兼容小程序更新机制API的使用
    // if (wx.canIUse('getUpdateManager')) {
      
    // } else {
    //   wx.showModal({
    //     title: '溫馨提示',
    //     content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    //   })
    // }
    if (sys.platform === "WECHAT_GAME") {
        const updateManager = wx.getUpdateManager();
        //检测版本更新
        updateManager.onCheckForUpdate(function (res) {
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              wx.showModal({
                title: '温馨提示',
                content: '检测到新版本，是否重启小程序？',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                  }
                }
              })
            })
            updateManager.onUpdateFailed(function () {
              // 新版本下载失败
              wx.showModal({
                title: '已有新版本',
                content: '请您删除小程序，重新搜索进入',
              })
            })
          }
          else{
              console.log("无新版本");
              UIManager.getInstance().Tip("已经是最新版本");
          }
        })
    }
    
  }