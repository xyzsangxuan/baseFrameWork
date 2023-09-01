import { _decorator, Component, Node } from 'cc';
/**
 * 自我销毁工具
 */
export class DestroySelf extends Component {
    time:number = 1.5;
    start() {
        this.schedule(()=>{
            //console.log("Destroy "+this.node.name);
            this.node.destroy();
        },this.time);
    }
    init(time_:number){
        this.time = time_;
    }
    update(deltaTime: number) {
        
    }

    protected onDestroy(): void {
        this.unscheduleAllCallbacks();
    }
}

