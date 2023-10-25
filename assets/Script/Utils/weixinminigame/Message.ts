import { sys } from "cc";

/**
 * 弹出小游戏订阅授权框
 * 
 */
export function requestSubscribeMessage() {
    //判断微信版本是否 兼容小程序更新机制API的使用
    // if (wx.canIUse('getUpdateManager')) {
      
    // } else {
    //   wx.showModal({
    //     title: '溫馨提示',
    //     content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    //   })
    // }
    if (sys.platform === "WECHAT_GAME") {
      wx.requestSubscribeMessage({
        tmplIds: ['XqYC3s67Zpv2VReUUm9JGof5zCiNXd9SPkndDDyojXc'],
        success: res => {
          console.log(res);
        //   res === {
        //     errMsg: "requestSubscribeMessage:ok",
        //     "zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE": "accept"
        //  }
        //成功发送消息
        console.log("成功发送消息 ");
          if(res['XqYC3s67Zpv2VReUUm9JGof5zCiNXd9SPkndDDyojXc'] === 'accept'){
            console.log("成功发送消息 后去到成功反馈");
            //PlayerSaveManager.getInstance().playerEO.subscribeOne = 1 ;

            //PlayerSaveManager.getInstance().uploadPlayerProperty(4,1);
            //后续会提交，但是如果订阅消息位置改变，需要手动提交
           
          }
        }
      })
      console.log("未成功发送消息 ");
    }else{
      return 0;
    }
    
  }