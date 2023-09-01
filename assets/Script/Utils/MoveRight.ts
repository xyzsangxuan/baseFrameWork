import { _decorator, Component, Node, Vec3 } from 'cc';

export class MoveRight extends Component {
    speed: number = 10; // 运动速度
    distance: number = 1000; // 运动距离
    private startPos: Vec3 = new Vec3(); // 初始位置
    private targetPos: Vec3 = new Vec3(); // 目标位置
    private direction: number = 1; // 运动方向（1表示向右，-1表示向左）
    curSpeed;
    start() {
        // 记录初始位置
        this.startPos.set(this.node.position);
        // 计算目标位置
        this.targetPos.set(this.distance, this.startPos.y, this.startPos.z);
        this.curSpeed = this.speed*(0.5*Math.random()+1);
    }

    update(deltaTime: number) {
        // 计算位移增量
        const displacement = this.curSpeed * this.direction * deltaTime;
        // 更新节点位置
        this.node.setPosition(this.node.position.x + displacement, this.node.position.y, this.node.position.z);

        // 判断是否到达目标位置
        if (this.direction > 0 && this.node.position.x >= this.targetPos.x) {
            // 到达目标位置，改变方向为向左
            this.node.setPosition(-500-(100*(1+Math.random())), this.startPos.y, this.startPos.z);
            this.curSpeed = this.speed*(0.5*Math.random()+1);
        } 
    }
}

