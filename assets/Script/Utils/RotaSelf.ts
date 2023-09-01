import { _decorator, Component, Node } from 'cc';


export class RotaSelf extends Component {
    speed: number = -1; // 旋转速度（角度每秒）

    update(deltaTime: number) {
        // 获取当前节点的旋转角度
        const currentRotation = this.node.eulerAngles;
        // 计算旋转增量
        const rotationDelta = this.speed * deltaTime;
        // 更新节点的旋转角度
        this.node.eulerAngles = currentRotation.add3f(0, 0, rotationDelta);
    }
}

