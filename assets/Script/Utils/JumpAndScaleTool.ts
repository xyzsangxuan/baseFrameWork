import { _decorator, Component, easing, macro, math, misc, Node, Quat, tween, Tween, Vec2, Vec3 } from 'cc';


export class JumpAndScaleTool extends Component {

    init(i){
       //this.task =  this.schedule(this.jumpAndScale, 5,macro.REPEAT_FOREVER,2+i*0.2);
    }
    jumpHeight: number = 20;

    jumpDuration: number = 0.5;

    private originalPosition: Vec3 = new Vec3();

  onLoad() {
    this.originalPosition.set(this.node.position);
    this.startJump();
  }

  startJump() {
   // 计算角度的正弦和余弦值
   const sinValue = Math.sin(this.node.rotation.z);
   const cosValue = Math.cos(this.node.rotation.z);

   const targetPosition = new Vec3(this.originalPosition.x-sinValue*this.jumpHeight,this.originalPosition.y+cosValue*this.jumpHeight,0);
    const jumpUp = tween(this.node)
      .to(this.jumpDuration, { position: targetPosition },{easing:easing.sineOut})
      .call(() => {
        this.startJumpDown();
      });

    jumpUp.start();
  }

  startJumpDown() {
    const targetPosition = this.originalPosition.clone();

    const jumpDown = tween(this.node)
      .to(this.jumpDuration, { position: targetPosition },{easing:easing.sineIn})
      .call(() => {
        this.startJump();
      });

    jumpDown.start();
  }

  toRadian(angle: number): number {
    return angle * (Math.PI / 180);
  }
}