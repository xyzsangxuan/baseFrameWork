import { _decorator, Component, Node, tween, Vec3 } from 'cc';
/**
 * 角色释放大招动画
 */
export class SlideIn extends Component {
    private targetNode: Node = null; // 目标节点

    private durationIn: number = 0.3; // 进入动画持续时间
    private durationOut: number = 0.3; // 离开动画持续时间
    private delay: number = 0.9; // 停留时间
    private callback: Function = null; // 回调函数
    protected onLoad(): void {
        this.targetNode = this.node;
        this.targetNode.position = new Vec3(-1000, 0, 0)
        this.targetNode.scale = new Vec3(0,0,0);
    }

    start() {
        // 从左侧滑动进入动画
        tween(this.targetNode)
            .to(this.durationIn, { position: new Vec3(0, 0, 0),scale:new Vec3(1,1,1) }, { easing: 'sineOut' })
            .delay(this.delay)
            .call(() => {
                this.onAnimationEnd();
                // 划出右侧动画
                tween(this.targetNode)
                    .to(this.durationOut, { position: new Vec3(1000, 0, 0),scale:new Vec3(0,0,0) }, { easing: 'sineIn' })
                    .call(() => {
                        // 动画结束时的回调函数
                        //this.onAnimationEnd();
                    })
                    .delay(3) // 等待3秒
                    .call(() => {
                        this.targetNode.destroy(); // 销毁节点
                    })
                    .start();
            })
            .start();
    }
    private onAnimationEnd() {
        // 在动画结束时执行的逻辑
        if (this.callback && typeof this.callback === 'function') {
            this.callback();
        }
    }
}