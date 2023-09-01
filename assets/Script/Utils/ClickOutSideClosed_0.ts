import { _decorator, Button, Component, director, EventTouch, Node } from 'cc';
import { Popup } from './Popup';
/**
 * 工具-点击空白关闭UI工具
 */
export class ClickOutSideClosed_0 extends Component {
    private uiNode: Node = null; // 需要关闭的 UI 节点

    private outsideNode: Node = null; // UI 外部的背景节点
    private closeBtn:Button = null;
    private popup :Popup = null;
    onLoad() {
        // 监听点击事件

        this.outsideNode = this.node.getChildByPath("bg00");
        this.outsideNode.on(Node.EventType.TOUCH_START, this.onOutsideClick, this);
        this.closeBtn = this.node.getChildByPath("content/backBtn")?.getComponent(Button);
        this.closeBtn?.node.on(Button.EventType.CLICK,this.CloseSelf,this);
       
    }

    protected start(): void {
        this.popup = this.node.getComponent(Popup);
    }

    onOutsideClick(event: EventTouch) {
        // 判断点击事件的目标节点是否为背景节点
        if (event.target === this.outsideNode) {
            // 点击了 UI 外部的区域，关闭 UI
            //this.node.active = false;
            director.resume();
            this.popup?.hidePopup();
        }
    }
    CloseSelf(){
        //this.node.active = false;
        director.resume();
        this.popup?.hidePopup();
    }
    onDestroy() {
        // 移除点击事件监听
        this.outsideNode?.off(Node.EventType.TOUCH_END, this.onOutsideClick, this);
    }
}