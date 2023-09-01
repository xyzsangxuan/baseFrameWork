import { Component, director, EventTouch, find,instantiate,Label,Node, size, tween, Vec2, Vec3, Widget } from "cc";
import { ResMgr } from "./ResMgr";
import { ClickOutSideClosed } from "../Utils/ClickOutSideClosed";
import { Popup } from "../Utils/Popup";
import { Warningblank } from "../Utils/Warningblank";
import { PlayerSaveManager } from "./PlayerSaveManager";
import { LocalizationUtils } from "../Utils/LocalizationUtils";
import { ClickOutSideClosed_0 } from "../Utils/ClickOutSideClosed_0";
import { CloseSelf } from "../Utils/CloseSelf";
import { Popup_0 } from "../Utils/Popup_0";
import { Popup_1 } from "../Utils/Popup_1";
import { Popup_ContentChildren } from "../Utils/Popup_ContentChildren";


/**
 * UI管理器
 */
export class UIManager extends Component  {
    
    

    private static instance: UIManager;
    private static lock: boolean = false;
    public canvas : Node|null = null;
  

    public static getInstance(): UIManager {
        if (!UIManager.instance) {
        if (!UIManager.lock) {
            UIManager.lock = true; // 加锁
            UIManager.instance = new UIManager();
            UIManager.lock = false; // 解锁
        }
        }
        return UIManager.instance;
    }
    Init(){
        this.canvas = find("Canvas");

    }
    //脚本
    //public homeUI:HomeUI = null;

    //节点
     tipPanel:Node = null;
    //清除所有子物体
    removeAllChildren(){
        this.canvas.destroyAllChildren();
    }
    //
    
    //
    Tip(txt:string){
        if(this.tipPanel == null){
            let prefab = ResMgr.Instance.getAsset("GUI","HomeUI/Prefabs/TipPanel");
            this.tipPanel = instantiate(prefab);
            this.canvas.addChild(this.tipPanel);
            this.tipPanel.addComponent(ClickOutSideClosed);
            this.tipPanel.getComponentInChildren(Widget).target = this.canvas;
            this.tipPanel.addComponent(Popup);
        }
        this.tipPanel.active = true;
        this.tipPanel.getChildByPath("content/text").getComponent(Label).string = LocalizationUtils.Instance.localize(txt);
    }
}