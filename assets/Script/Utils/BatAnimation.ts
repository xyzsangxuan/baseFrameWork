import { _decorator, Component, Node, Tween, tween, Vec3 } from 'cc';
import { RotaSelf } from './RotaSelf';
/**
 * 像蝙蝠或者蚊子一样浮动
 */
export class BatAnimation extends Component {
    startPosition:Vec3;
    onLoad() {
        this.startPosition = this.node.position.clone();
        this.startAnimation();
      }
    
      startAnimation() {
        const jumpHeight = 10; // 跳跃高度
        const duration = 1; // 动画持续时间
        const startPos = this.startPosition.clone(); // 起始位置
        ;
        const endPos = startPos.add(new Vec3(Math.random()*jumpHeight, Math.random()*jumpHeight, 0)); // 目标位置
    
        // 向上跳跃动画
        tween(this.node)
          .to(duration, { position: endPos })
          .call(() => {
            // 动画完成后，执行下降动画
            this.downAnimation();
          })
          .start();
      }
    
      downAnimation() {
        const jumpHeight = 10; // 跳跃高度
        const duration = 1; // 动画持续时间
        const startPos = this.startPosition.clone(); // 起始位置
        const endPos = startPos.subtract(new Vec3(Math.random()*jumpHeight, Math.random()*jumpHeight, 0));; // 目标位置
    
        // 向下跳跃动画
        tween(this.node)
          .to(duration, { position: endPos })
          .call(() => {
            // 动画完成后，重新开始滞空动画
            this.startAnimation();
          })
          .start();
      }

      public Drop(callback:()=>void){
        this.node.addComponent(RotaSelf).speed = -8
        Tween.stopAllByTarget(this.node);
        const startPos = this.startPosition.clone(); // 起始位置
        const jumpHeight = 300; // 跳跃高度
        const duration = 3; // 动画持续时间
        const endPos = startPos.subtract(new Vec3(0,jumpHeight, 0));; // 目标位置

        tween(this.node)
          .to(duration, { position: endPos })
          .call(() => {
            // 动画完成后，重新开始滞空动画
            callback();
            this.node.destroy();
          })
          .start();

        
      }
    }