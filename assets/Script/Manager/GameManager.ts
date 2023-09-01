import { NetUtil } from "../Utils/NetUtil";
import { PlayerSaveManager } from "./PlayerSaveManager";

/**
 * 加载配置表
 */
export class GameManager  {
    private static instance: GameManager;
    private static lock: boolean = false;
    private constructor() {
        // 私有构造函数，防止外部实例化      
    }
    Init(callback:()=>void){
      console.log("初始化配置表格")
        this.SyncCSVInit(callback);
    }
    public static getInstance(): GameManager {
        if (!GameManager.instance) {
        if (!GameManager.lock) {
            GameManager.lock = true; // 加锁
            GameManager.instance = new GameManager();
            GameManager.lock = false; // 解锁
        }
        }
        return GameManager.instance;
    }
    
    
    playerExperence ;//玩家升级配置
    
    guideInfo ;
   
    configGlobal ;
   
    SyncCSVInit(callback:()=>void){
      //读取配置
      let _data:{openId:string} = {
        openId :PlayerSaveManager.getInstance().playerSave._playerID
      }
      NetUtil.getInstance().RequsetGet("/config/info"
      ,_data
      ,(res)=>{
        
        this.playerExperence = res.data.playerLevelExperience;
        
        this.guideInfo = res.data.guide;
        
        this.configGlobal = res.data.configGlobal;
       
        callback?.();
        },null);
    }
}

