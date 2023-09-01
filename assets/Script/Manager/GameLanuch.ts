import { _decorator, AudioSource, Component, director, EPhysics2DDrawFlags, Node, PhysicsSystem2D } from 'cc';
import { GameApp } from './GameApp';
import { ResMgr } from './ResMgr';
const { ccclass, property } = _decorator;

@ccclass('GameLanuch')
export class GameLanuch extends Component {
    public static Instance : GameLanuch = null as unknown as GameLanuch;
    onLoad():void {
        if(GameLanuch.Instance === null){
            GameLanuch.Instance = this;
        }else{
            this.destroy();
            return;
        }
        //初始化游戏框架：资源管理模块、网络模块、协议模块、日志模块
        this.node.addComponent(GameApp);
        this.node.addComponent(ResMgr);
    }
    protected start(): void { 
        //设置音量
        //资源监测更新  
        //性能监控
        //end
        GameApp.Instance.EnterGame(); 
    }
}





//测试云托管
      //  let playerSave = SaveGame.loadPlayerData(setting.Player_Data);
      //   if(playerSave == null || playerSave._playerID == null||playerSave._playerID == ""){//首次登录
      //       playerSave = new PlayerInfo();
      //       let _data:{openId:string} = {
      //         openId :""
      //     }
      //       NetUtil.getInstance().RequsetGet("/api/bUser/playerRegister",_data,(res)=>{
      //         console.log("成功接收到信息:",res);
      //         console.log("code:",res.code);
      //         console.log("message: ",res.message)
      //         console.log("data:",res.data);
      //         playerSave._playerID = res.data as string;
      //         SaveGame.savePlayerData(playerSave,setting.Player_Data);
      //         },null);
      //   }else{//非首次登录
      //     let _data:{openId:string} = {
      //               openId :playerSave._playerID
      //           }

      //     NetUtil.getInstance().RequsetGet("/api/bUser/playerRegister",_data,(res)=>{
      //       console.log("成功接收到信息:",res);
      //       console.log("code:",res.code);
      //       console.log("message: ",res.message)
      //       console.log("data:",res.data);
      //       playerSave._playerID = res.data as string;
      //       SaveGame.savePlayerData(playerSave,setting.Player_Data);
      //       },null);
      //   }
    //    interface data{
    //         test:string,
    //         akb:number
    //    }
    //    let _data:{name:string} = {
    //         name:"sasdad"
    //    }
    //    let _a_data:data = {
    //         test :"",
    //         akb :2
    //    }
    //    NetUtil.getInstance().RequsetPost("/api/playerInfo/playerUpdate",_a_data,(res)=>{
    //     console.log("成功接收到信息",res);

    //    },null);

    //    NetUtil.getInstance().RequsetPost("/api/playerInfo/playerUpdate",_data,(res)=>{
    //     console.log("成功接收到信息")
    //    },null);