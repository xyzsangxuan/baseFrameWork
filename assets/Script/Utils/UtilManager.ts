import { _decorator, Color, Component, director, easing, Game, instantiate, Node, Prefab, Tween, tween, Vec3 } from 'cc';

import { ResMgr } from '../Manager/ResMgr';
import { UIManager } from '../Manager/UIManager';
import { PlayerSaveManager } from '../Manager/PlayerSaveManager';
import { GameManager } from '../Manager/GameManager';
/**
 * 方便实用的工具管理
 */
export class UtilManager {


    private static instance: UtilManager;
    private static lock: boolean = false;
    enemyUIPanel: UtilManager = null;
    private constructor() {
        // 私有构造函数，防止外部实例化      
    }
    public static getInstance(): UtilManager {
        if (!UtilManager.instance) {
        if (!UtilManager.lock) {
            UtilManager.lock = true; // 加锁
            UtilManager.instance = new UtilManager();
            UtilManager.lock = false; // 解锁
        }
        }
        return UtilManager.instance;
    }

    
   
    
   
   
    
   
    
   
     


    /**
     * 敌人攻击路线
     * ---------------------------------------------------------------------------------------------------------------------------------
     */

    /**
    * 快速平行 二连击
    * @param node 
    * @param left 
    * @param dur 
    */
   EnemyNodeAttack(node,targetPos,left,dur = 0.5) { //node为做抛物线运动的节点

    let startPos = node.position //起点，抛物线开始的坐标
    let pos = targetPos;
    let destPos = new Vec3(pos.x + Math.random()*100-50,pos.y+ Math.random()*10+50,pos.z); 
    let middlePos = new Vec3((node.position.x + destPos.x)/2, (node.position.y + destPos.y)/2 , 0) //中间坐标，即抛物线最高点坐标
    if(left){
        middlePos = new Vec3(middlePos.x+400,middlePos.y-100,0);

    }else{
        middlePos = new Vec3(middlePos.x-300,middlePos.y,0);

    }
    //计算贝塞尔曲线坐标函数
    let twoBezier = (t: number, p1: Vec3, cp: Vec3, p2: Vec3) => {
        let x = (1 - t) * (1 - t) * p1.x + 2 * t * (1 - t) * cp.x + t * t * p2.x;
        let y = (1 - t) * (1 - t) * p1.y + 2 * t * (1 - t) * cp.y + t * t * p2.y;
        return new Vec3(x, y, 0);
    };
    //dur =dur + Math.random()*0.4-0.2;
    tween(node)
        .to(dur, destPos, { 
        onUpdate: (target: Vec3, ratio: number) => {
            node.position = twoBezier(ratio, startPos, middlePos, destPos); 
        }
        }).call(()=>{
            node.destroy();
        })
        .start();
   }

    /**
     * 波动破甲拳 一个冲击-到目标点
     * @param node 
     * @param dur 
     */
    EnemyAttack(node,targetPos,left,dur = 0.3) { 
        let startPos = node.position //起点，抛物线开始的坐标
        let pos = targetPos;
        let destPos = new Vec3(pos.x + Math.random()*100-50,pos.y+ Math.random()*10+50,pos.z); 

        let endScale =  new Vec3(0.8,0.8,0.8);

        dur =dur ;//+ Math.random()*0.4-0.2;
        tween(node)
            .to(dur,{ position: destPos, scale: endScale },{easing:easing.backIn})
            .call(()=>{
                
            })
            .start();
    }

    /**
     * 直线 一个火焰冲击-到目标点
     * @param node 
     * @param dur 
     */
    EnemyNodeMovingDirectNotPop(node,targetPos,left,dur = 0.3) { 
        let startPos = node.position //起点，抛物线开始的坐标
        let pos = targetPos;
        let destPos = new Vec3(pos.x + Math.random()*100-50,pos.y+ Math.random()*10+50,pos.z); 

        let endScale =  new Vec3(0.8,0.8,0.8);

        dur =dur ;//+ Math.random()*0.4-0.2;
        tween(node)
            .to(dur,{ position: destPos, scale: endScale })
            .call(()=>{
                
            })
            .start();
    }

  
   /**
    * 
    * @param target 受击效果
    */
   playHitEffect(target,sprite,originalColor) {
    let pos = target.position;
    // 抖动动画
    tween(target)
        .to(0.1, { position: new Vec3(pos.x+ Math.random() +1, pos.y+ Math.random() + 1, pos.z) })
        .to(0.1, { position: new Vec3(pos.x-Math.random() + 1, pos.y-Math.random() + 1, pos.z) })
        .to(0.1, { position: new Vec3(pos.x, pos.y, pos.z) })
        .start();

    // 闪白效果
    sprite.color = new Color(255, 255, 255);
    tween(sprite)
        .to(0.1, { color: new Color(255, 255, 255, 0) })
        .call(() => {
            // 恢复原始颜色
            sprite.color = originalColor;
        })
        .start();
    }
    /**
    * 
    * @param target 受击效果
    */
   playHitEffect_1(target) {
    Tween.stopAllByTarget(target);
    let pos = target.position;
    // 抖动动画
    tween(target)
        .to(0.1, { position: new Vec3(pos.x+ Math.random()*2, pos.y+ Math.random()*2, pos.z) })
        .to(0.1, { position: new Vec3(pos.x-Math.random()*2, pos.y-Math.random()*2, pos.z) })
        .to(0.1, { position: new Vec3(pos.x, pos.y, pos.z) })
        .start();
    }
    /**
   * 在一定时间后删除指定脚本
   * @param script 要删除的脚本实例
   * @param delay 延迟时间（秒）
   */
    removeScriptAfterDelay(script: Component, delay: number = 1) {
    director.getScheduler().schedule(() => {
      script.destroy();
    }, script, delay, 0, 0, false);
  }
  getNatureColor(natureType):Color{
    switch(Number(natureType)){
        case -1:
            break;
        case 0:
            return new Color(247,147,98,255);
            break;
            case 1:
                return new Color(4,38,2,255);
                break;
                case 2:
                    return new Color(42,179,205,255);
                    break;
                    case 3:
                        return new Color(189,33,26,255);
                        break;
                        case 4:
                            return new Color(213,146,29,255);
                            break;
                            case 5:
                                return new Color(42,90,164,255);
                                break;
                                case 6:
                                    return new Color(82,187,188,255);

                                    break;
    }
  }
  getRareColor(natureType):Color{
    switch(Number(natureType)){
        case -1:
            break;
        case 0:
            return new Color(255,255,255,255);
            break;
            case 1:
                return new Color(31,255,0,255);
                break;
                case 2:
                    return new Color(24,172,255,255);
                    break;
                    case 3:
                        return new Color(163,52,206,255);
                        break;
                        case 4:
                            return new Color(248,226,60,255);
                            break;
                            case 5:
                                return new Color(235,102,39,255);
                                break;
                                default :
                                    return new Color(82,187,188,255);
    }
  }
  getStringOfNatureProperty(type: number): string {
    switch(type){
        case -1:
            break;
        case 0:
            return "光";
            break;
            case 1:
                return "暗";
                break;
                case 2:
                    return "水";
                    break;
                    case 3:
                        return "火";
                        break;
                        case 4:
                            return "土";
                            break;
                            case 5:
                                return "雷";
                                break;
                                case 6:
                                    return "风";

                                    break;
    }
    
  }
  getPlayerName(level:number){
    let l1 = Math.floor(level/10);
    let l2 = level%10;
    let str1 = "";
    let str2 = "";
    if(l2>0){
        str2 = l2+"星·";
    }
    

    switch(l1){
        case 0 :
            str1 = "见习驭兽师"
            break;
        case 1 :
            str1 = "初级驭兽师"
            break;
        case 2 :
            str1 = "高级驭兽师"
            break;
        case 3 :
            str1 = "大师驭兽师"
            break;
        case 4 :
            str1 = "传奇驭兽师"
            break;
        case 5 :
            str1 = "史诗驭兽师"
            break;
        case 6 :
            str1 = "传说驭兽师"
            break;
        case 7:
            str1 = "传说驭兽师·兽语初现"
            break;
        case 8:
            str1 = "传说驭兽师·兽纹觉醒"
            break;
        case 9 :
            str1 = "传说驭兽师·兽心共鸣"
            break;
        case 10:
            str1 = "传说驭兽师·兽化融合"
            break;
        case 11:
            str1 = "传说驭兽师·兽皇降世"
            break;
        default:
            str1 = "驭兽之王"
            break;
    }
    str1 = str2+str1;
    return str1;
  }
  getPlayerLevel(experence:number):number{// 0 50 55 65
    for(let i = 1;i<GameManager.getInstance().playerExperence.length;i++){
        if(GameManager.getInstance().playerExperence[i]["maxExperence"]>experence &&//小于高一阶
        GameManager.getInstance().playerExperence[i-1]["maxExperence"]<=experence ){//大于低一阶级
            return i-1;
        }
        
    }
  }
  getDateStr(date: Date) :string{

    const year = date.getFullYear();
    const month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
    const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
    const hours = (date.getHours() < 10 ? '0' : '') + date.getHours();
    const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    const seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    console.log(formattedDate);
    return formattedDate;

}
formatNumberWithZero(num: number): string {
    const fixedNumber = num.toFixed(2);
    const parts = fixedNumber.split('.');
    const integerPart = parts[0].length === 1 ? '0' + parts[0] : parts[0];
    return integerPart;
  }


  getBoxRewardRandomOffset(){
    let times = PlayerSaveManager.getInstance().playerEO.dailyBoxOpentimes;
    let offset = 0;
    if(times <100){
        offset =0.3;
    }else{
        if(times <500){
            offset =0.5;
        }else{
            if(times <5000){
                offset =0.7;
            }else{
                offset =0.9;
            }
        }
    }
    return Math.random()*offset;
  }
  getRareString(rare:number){
   
    switch(rare){
        case 0:
            return "[普通]"
        case 1:
            return "[稀有]"
        case 2:
            return "[珍贵]"
        case 3:
            return "[史诗]"
        case 4:
            return "[传说]"
        case 5:
            return "[神话]"
        default:
            return "[未知]"

    }

  }

}


