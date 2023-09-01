import { _decorator, Component, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, Texture2D } from 'cc';
import { SaveGame } from '../Utils/SaveGame';
import { UIManager } from './UIManager';
import { AudioMgr } from './AudioMgr';
import { NetUtil } from '../Utils/NetUtil';

import { GameManager } from './GameManager';

import { ResMgr } from './ResMgr';
import { UtilManager } from '../Utils/UtilManager';
import { setting } from '../../Game/Setting/setting';
import { PlayerInfo } from '../../Game/EO/PlayerInfo';

export class PlayerSaveManager extends Component {
    
    private static instance: PlayerSaveManager;
    private static lock: boolean = false;
    firstLogin: boolean;
    login:boolean = false;
    
    public static getInstance(): PlayerSaveManager {
        if (!PlayerSaveManager.instance) {
        if (!PlayerSaveManager.lock) {
            PlayerSaveManager.lock = true; // 加锁
            PlayerSaveManager.instance = new PlayerSaveManager();
            PlayerSaveManager.lock = false; // 解锁
        }
        }
        return PlayerSaveManager.instance;

    }
    //玩家信息
    public playerSave  = null;
    public playerEO  = null;
    public playerHomeTimeFlagEO  = null;
    public playerRewardEO  = null;


    public initSave(callback:()=>void){
        //初始化玩家存档
        //SaveGame.deletePlayerData(setting.Player_Data);
        this.playerSave = SaveGame.loadPlayerData(setting.Player_Data);
        if(this.playerSave == null){//首次登录
            this.playerSave = new PlayerInfo();
            this.firstLogin = true;
            let _data:{openId:string} = {
              openId :"Player"
            }
            NetUtil.getInstance().RequsetGet("/api/bUser/playerRegister",_data,(res)=>{
                this.playerSave._playerID = res.data.openId as string;
                this.firstLogin = res.data.firstLogin;
                SaveGame.savePlayerData(this.playerSave,setting.Player_Data);
                console.log("登录成功!")
                callback?.();
                this.downloadPlayerInfo(callback);
                //this.downloadPlayerRewardInfo(callback);
                //初始化配置表格
                GameManager.getInstance().Init(()=>{
                    callback?.();
                });
            },null);
        }else{//非首次登录
          let _data:{openId:string} = {
                    openId :this.playerSave._playerID
                }
          NetUtil.getInstance().RequsetGet("/api/bUser/playerRegister",_data,(res)=>{
            this.playerSave._playerID = res.data.openId as string;
            this.firstLogin = res.data.firstLogin;
            SaveGame.savePlayerData(this.playerSave,setting.Player_Data);
            console.log("登录成功!")
            callback?.();
            this.downloadPlayerInfo(callback);
            //this.downloadPlayerRewardInfo(callback);
            //初始化配置表格
            GameManager.getInstance().Init(()=>{
                callback?.();
            });   
            },null);
        }
    }
    downloadPlayerInfo(callback:()=>void){
        let _data:{openId:string} = {
            openId :this.playerSave._playerID
          }
        NetUtil.getInstance().RequsetPost("/api/playerInfo/playerLogin",_data,(res)=>{
            this.playerEO = res.data ;
            //获取个人信息之后，获取配置信息之前
            //战斗管理器配置
            //初始化UI管理器
            UIManager.getInstance().Init();
            //初始化rouguelike
            // 在游戏开始时加载上次的体力和时间戳
            this.loadSavedData();
            // 在游戏开始时启动计时器
            this.schedule(this.updateEnergy, 1);
            //初始化
            this.init();
            callback?.();
            },null);
        
    }

   
    init(){
        console.log("初始化！")
    }
    public readonly recoveryInterval: number = 5 * 60; // 恢复体力的间隔，单位：秒
    public readonly energyPerRecovery: number = 1; // 每次恢复的体力值
    updateEnergy() {
        if(this.playerEO.stamina>=setting.Player_Power_Max){
            return;
        }
        // 每秒更新体力和时间
        const currentTime = Math.floor(Date.now() / 1000); // 当前时间戳，单位：秒
        const elapsedTime = currentTime - this.playerEO.powerTime; // 经过的时间
        // 检查是否已经过去了恢复间隔
        if (elapsedTime >= this.recoveryInterval) {
            
            // 计算离线期间应该恢复的体力值
            const offlineRecovery = Math.floor(elapsedTime / this.recoveryInterval);
            // 增加体力
            this.playerEO.stamina += offlineRecovery * this.energyPerRecovery;

            this.playerEO.stamina = this.playerEO.stamina>setting.Player_Power_Max?setting.Player_Power_Max:this.playerEO.stamina;
            // 更新上次恢复时间
            this.playerEO.powerTime += offlineRecovery * this.recoveryInterval;
            this.uploadPlayerInfo(true);
            //保存
        }

    }
   
    loadSavedData() {
        // 从本地存储或服务器上加载上次的体力和时间戳
        // 如果是第一次玩游戏或没有保存的数据，则使用默认值

        this.playerEO.stamina = this.playerEO.stamina || 0;
        this.playerEO.powerTime = this.playerEO.powerTime || Math.floor(Date.now() / 1000);
    }
    saveData(){

    }
    uploadPlayerInfo(hide :boolean = false) {
        // 将当前的体力和时间戳保存在本地存储或服务器上
        /* 保存当前的体力和时间戳到本地存储或服务器 */;
        //this.playerSave = save;
        //同步loading
        let _data:{openId:string,playerInfo} = {
            openId :this.playerSave._playerID,
            playerInfo : this.playerEO,
          }
          

        NetUtil.getInstance().RequsetPost("/api/playerInfo/playerUpdate",_data,(res)=>{
            //取消同步
            let code:number = res.code;
            if(code == 1){
            }else{
                UIManager.getInstance().Tip("同步失败！");
            } 
            },null);
    }

   

   
    changeSound(sound:number){
        this.playerEO.soundVoice = sound;

    }
    changeMusic(music){
        this.playerEO.musicVoice = music;
        AudioMgr.inst.changeBgVolume();
    }
}

