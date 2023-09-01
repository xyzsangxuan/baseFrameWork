import { _decorator, CCInteger, Component, Node, Tween, tween, Vec3 } from 'cc';
/**
 * 四方移动
 */
export class SquareMovement extends Component {

    private targetNode: Node = null; // 目标节点

    private sideLength: number = 98; // 正方形的边长

    private duration: number = 0.3; // 每边运动的时间


    onLoad() {
        this.targetNode = this.node;
    }

    protected onDisable(): void {
        this.targetNode.position = new Vec3(this.sideLength / 2,this.sideLength / 2,0);
        Tween.stopAllByTarget(this.targetNode);
    }
    protected onEnable(): void {
        this.targetNode.position = new Vec3(this.sideLength / 2,this.sideLength / 2,0);
        this.startSquareMovement();
    }
    private startSquareMovement() {
        const startPos = this.targetNode.position.clone(); // 起始位置
        const upPos = new Vec3(startPos.x, startPos.y - this.sideLength, startPos.z); // 上边位置
        const rightPos = new Vec3(startPos.x - this.sideLength , startPos.y -this.sideLength, startPos.z); // 右边位置
        const downPos = new Vec3(startPos.x - this.sideLength , startPos.y , startPos.z); // 下边位置
        const leftPos = new Vec3(startPos.x , startPos.y, startPos.z); // 左边位置
        tween(this.targetNode)
            .to(this.duration, { position: upPos })
            .to(this.duration, { position: rightPos })
            .to(this.duration, { position: downPos })
            .to(this.duration, { position: leftPos })
            .call(() => {
                // 当动作完成后，重新开始运动
                this.startSquareMovement();
            })
            .start();
    }
}