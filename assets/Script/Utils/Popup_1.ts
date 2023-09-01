import { _decorator, Component, easing, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Popup_1')
export class Popup_1 extends Component {
    private target : Node = null;
    callback: () => void;
    protected start(): void {
        if(this.target == null){
            this.target = this.node.getChildByPath("content")
        }
        this.target = this.node.getChildByPath("content")
        this.target.scale = new Vec3(0, 0, 0) ; // 初始缩放为0

    }
    protected onEnable(): void {
        if(this.target == null){
            this.target = this.node.getChildByPath("content")
        }
        this.target.scale = new Vec3(0, 0, 0) ; // 初始缩放为0
        this.showPopup();
    }
    protected onDisable(): void {

    }

    private showPopup() {
        this.node.active = true;
        this.target.scale = new Vec3(0, 0, 0) ; // 初始缩放为0

        const actionScaleIn = tween(this.target).to(0.3, { scale: new Vec3(1.5, 1.5, 1.5) }).start(); // 缩放动画，时长为0.3秒，缩放比例为1
        const actionScaleIn1 = tween(this.target).to(1, { scale: new Vec3(1, 1, 1)} ,{easing:easing.elasticOut}).start(); // 缩放动画，时长为0.3秒，缩放比例为1

        tween(this.target)
            //.then(actionScaleIn)
            .then(actionScaleIn1)
            .call(()=>{
                if(this.callback!= null){
                    this.callback();
                }
            })
            .start(); // 串行执行渐显和缩放动画
    }

    hidePopup() {
        const actionScaleIn = tween(this.target).to(0.3, { scale: new Vec3(1.5, 1.5, 1.5) }).start(); // 缩放动画，时长为0.3秒，缩放比例为1
        const actionScaleIn1 = tween(this.target).to(0.3, { scale: new Vec3(0, 0, 0) }).start(); // 缩放动画，时长为0.3秒，缩放比例为1

        tween(this.target)
            .then(actionScaleIn)
            .then(actionScaleIn1)
            .call(()=>{
                this.node.active =false;
            })
            .start(); // 串行执行渐显和缩放动画
    }
}
