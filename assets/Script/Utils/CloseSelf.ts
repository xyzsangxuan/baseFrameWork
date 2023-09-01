import { _decorator, Button, Component, director, EventTouch, Node } from 'cc';
import { Popup } from './Popup';
/**
 * 工具-点击空白关闭UI工具
 */
export class CloseSelf extends Component {

    private popup :Popup = null;
    onLoad() {
        // 监听点击事件
    }

    protected start(): void {
        this.popup = this.node.getComponent(Popup);
    }
    flagTime;
    protected onEnable(): void {
        this.flagTime = Date.now();
    }
    protected update(dt: number): void {
        if(this.flagTime +5*1000<Date.now()){
            this.CloseSelf();
        }
    }
   
    CloseSelf(){
        //this.node.active = false;
        director.resume();
        this.popup?.hidePopup();
    }
    onDestroy() {
        // 移除点击事件监听
    }
}