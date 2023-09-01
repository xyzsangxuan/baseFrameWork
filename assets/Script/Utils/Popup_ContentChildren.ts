import { _decorator, Component, Node, Sprite, tween, Vec3 } from 'cc';
/**
 * 弹窗工具
 */

export class Popup_ContentChildren extends Component {
    callback: () => void;
    closeCallback: () => void;

    girl:Node = null;
    txt:Node;
    go:Node;
    board:Node;
    protected start(): void {
        if(this.go == null){
            this.girl = this.node.getChildByPath("content/mid/board/boardGirl");
            this.txt = this.node.getChildByPath("content/mid/board/Sprite");
            this.go = this.node.getChildByPath("content/go");
            this.board = this.node.getChildByPath("content/mid/board");
        }
        this.showPopup(this.girl);
        this.showPopup(this.txt);
        this.showPopup(this.go);

    }
    protected onEnable(): void {
        if(this.go == null){
            this.girl = this.node.getChildByPath("content/mid/board/boardGirl");
            this.txt = this.node.getChildByPath("content/mid/board/Sprite");
            this.go = this.node.getChildByPath("content/go");
            this.board = this.node.getChildByPath("content/mid/board");
        }
        this.showPopup(this.girl);
        this.showPopup(this.txt);
        this.showPopup(this.go);
    }
 

    private showPopup(target) {
        this.node.active = true;
        target.scale = new Vec3(0, 0, 0) ; // 初始缩放为0
         
        const actionScaleIn = tween(target).to(0.1, { scale: new Vec3(1.2, 1.2, 1.2) }).start(); // 缩放动画，时长为0.3秒，缩放比例为1
        const actionScaleIn1 = tween(target).to(0.1, { scale: new Vec3(1, 1, 1) }).start(); // 缩放动画，时长为0.3秒，缩放比例为1

        tween(target)
            .then(actionScaleIn)
            .then(actionScaleIn1)
            .call(()=>{
                if(this.callback!= null){
                    this.callback();
                }
            })
            .start(); // 串行执行渐显和缩放动画
    }

    
}