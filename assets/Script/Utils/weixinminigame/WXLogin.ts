import { _decorator, Component, Node, url, Sprite, assetManager, ImageAsset, SpriteFrame, Texture2D, Label, EditBox, NodeEventType, sys } from 'cc';
const { ccclass, property } = _decorator;
import 'miniprogram-api-typings';
@ccclass('WXLogin')
export class WXLogin extends Component {

  @property(Node)
  avatar: Node

  @property(Label)
  name_Label: Label

  systemInfo;
  screenWidth;
  screenHeight;
  //用户信息
  userInfo;

  onLoad(){
    this.login();
  }

  login() {
    if (!(sys.platform === "WECHAT_GAME"))
    {
        console.log("非微信环境");
        return;
    }
    var self = this;
    const wx = window['wx'];//避开ts语法检测
    const info = this.systemInfo = wx.getSystemInfoSync();//立即获取系统信息
    const w : number = this.screenWidth = info.screenWidth;//屏幕宽
    const h : number = this.screenHeight = info.screenHeight;//屏幕高
    console.log("屏幕宽:", w)
    console.log("屏幕高:", h)
    //获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
    wx.getSetting(
      {
        success(res) {
          //如果用户已经授权
          if (res.authSetting["scope.userInfo"]) {
            wx.getUserInfo({
              success(res) {
                console.log("授权成功")
                this.userInfo = res.userInfo;
                console.log("用户已经授权,用户信息" + res.userInfo.nickName);
                console.log("nickName:" + this.userInfo.nickName);
                console.log("avatarUrl:" + this.userInfo.avatarUrl);
                self.setAvatar(this.userInfo.avatarUrl);
                self.name_Label.string = this.userInfo.nickName as string;
              }
            });
            //如果用户没有授权
          } else {
            console.log("创建全屏透明==[createUserInfoButton]");
            let button = wx.createUserInfoButton({
              type: 'text',
              text: '登录',
              style: {
                left: w/2-45,
                top: h - 30,
                width: 90,
                height: 40,
                lineHeight: 40,
                backgroundColor: "#66CC00",
                color: "#FFFFFF",
                textAlign: "center",
                fontSize: 18,
                borderRadius: 10
              }
            });
            //用户授权确认
            button.onTap((res) => {
              if (res.userInfo) {
                console.log("用户同意授权:", res.userInfo.nickName);
                this.userInfo = res.userInfo;
                self.setAvatar(this.userInfo.avatarUrl);
                self.name_Label.string = this.userInfo.nickName as string;
                button.destroy();
              } else {
                console.log("用户拒绝授权:");
                button.destroy();
              }
            });
          }
        }
      }
    );
  }

  //设置头像
  setAvatar(url): void {
    let spire = this.avatar.getComponent(Sprite)
    assetManager.loadRemote<ImageAsset>(url + "?aaa=aa.jpg", { ext: '.jpg' }, (_err, imageAsset) => {
      let sp = new SpriteFrame();
      let texture = new Texture2D();
      texture.image = imageAsset;
      sp.texture = texture
      spire.spriteFrame = sp;
    })
  }


}

