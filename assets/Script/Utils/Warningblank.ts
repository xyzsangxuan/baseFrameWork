import { _decorator, Color, Component, easing, Node, Sprite, Tween } from 'cc';
/**
 * 警告动画
 */
export class Warningblank extends Component {
    times = 0;
    _sprite_bg:Sprite;
    onEnable() {
       this._sprite_bg = this.node.getChildByPath("content").getComponent(Sprite)
       this.t1();
    }
    t1() {
        
        let startValue = 0;
        new Tween({ value: startValue })
        .to(0.5, { value: 255 
        },{ 
            onUpdate: (target: Number, ratio: number) => {
                this._sprite_bg.color = new Color(255,255,255,Math.floor(ratio *255));
            },
            easing: easing.quadOut
        })
        .call(()=>{
            this.times++;
            this.t2();
        }).start(); 
    }
    t2(){
        let startValue = 0;
        new Tween({ value: startValue })
        .to(0.5, { value: 255 
        },{ 
            onUpdate: (target: Number, ratio: number) => {
                this._sprite_bg.color = new Color(255,255,255,255-Math.floor(ratio *255));
            },
            easing: easing.quadIn
        })
        .call(()=>{
            if(this.times > 4){
                this.node.active = false;
                return;
            }
            this.t1();
        }).start(); 
    }

    
}

