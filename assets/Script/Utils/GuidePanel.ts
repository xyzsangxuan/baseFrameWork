import { _decorator, Button, Component, director, easing, EventTouch, Label, Node, RichText, Sprite, tween, Tween, UITransform, Vec2, Vec3 } from 'cc';
import { Popup } from './Popup';
import { PrintEffect } from './PrintEffect';
import { GameManager } from '../Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('GuidePanel')
export class GuidePanel extends Component {
    private uiNode: Node = null; // 需要关闭的 UI 节点
    
        private outsideNode: Node = null; // UI 外部的背景节点
        private closeBtn:Button = null;
        private mid:Node = null;
        private guide:Node = null;

        private guide_mid :Sprite = null;
        private popup :Popup = null;
        finger_click:Node = null;
        finger_move:Node = null;
        boardGirl:Node = null;
        boardGirlSke:Node = null;
        richText  : RichText;
        text  : Label;
        private itemTween:Tween<Node> = null;    
        tween_dur: number = 1;
        goLabel:Node;
        circle:Node;
        initComponent() {
            // 监听点击事件
    
            this.guide = this.node.getChildByPath("guide_mid");
            this.outsideNode = this.node.getChildByPath("guide_mid/bg00");
            this.outsideNode.on(Node.EventType.TOUCH_START, this.onOutsideClick, this);
            this.mid = this.node.getChildByPath("content/mid");
            this.finger_click = this.mid.getChildByPath("finger_click");
            this.finger_move = this.mid.getChildByPath("finger_move");
            this.circle =this.mid.getChildByPath("circle");
            this.closeBtn = this.node.getChildByPath("content/backBtn")?.getComponent(Button);
            this.closeBtn?.node.on(Button.EventType.CLICK,this.CloseSelf,this);
            this.richText = this.node.getComponentInChildren(RichText);
            this.text = this.node.getComponentInChildren(Label);
            this.boardGirl = this.mid.getChildByPath("board/boardGirl");
            this.boardGirlSke = this.mid.getChildByPath("board/boardGirl/boardGirl");
            this.goLabel = this.node.getChildByPath("content/go");
        }
        /**
         * 
         * @param node 目标点
         * @param active 引导是否激活状态
         * @param guideId 新手引导文字描述ID
         * @param size 镂空
         * @param offset 偏移
         * @param Sliiding 轨迹(起始点、终止点)
         * @param dir 横向或者竖向（0，点击，1竖向移动，2横向移动,3需点击和触摸只做展示)
         * @param face 看板娘左右朝向（0，右面，1左面,2上面，3右下，4左下，5右上，6左上)
         */
        init(sourceNode,guideId,size:Vec2,offset:Vec2= new Vec2(0,0),Sliiding:Vec2 = new Vec2(0,0),dir:number= 0,face:number = 0,callback:()=>void = null){
            this.curTime = Date.now();
            this.callback = callback;
            if(this.outsideNode == null){
                this.initComponent();
            }
            this.goLabel.setPosition(new Vec3(-440,0,0));
            this.closeBtn.node.setPosition(new Vec3(300,600,0));

            // 假设 sourceNode 是你想要复制位置的源节点，targetNode 是目标节点
            //1:把Guide和mid都放到目标位置
            const worldPosition = sourceNode.getComponent(UITransform).convertToWorldSpaceAR(new Vec3());
            let localPosition = this.guide.parent!.getComponent(UITransform).convertToNodeSpaceAR(worldPosition); 
            localPosition = new Vec3(localPosition.x +offset.x,localPosition.y+offset.y,localPosition.z);
            this.guide.setPosition(localPosition);
            this.mid.setPosition(localPosition);
            //2:添加引导话语
            let txt:string = GameManager.getInstance().guideInfo[guideId]["des"];
            //PrintEffect.getInstance().richText(txt,this.richText);
            PrintEffect.getInstance().Text(txt,this.text);

            //3：修改看板娘位置和朝向 在目标右侧（看板娘：220 -70，文字 420 200）在目标左侧（看板娘：-220 -70，文字 -30 200）
            switch(Number(face)){
                case 0:
                    this.boardGirl.setPosition(new Vec3(200,-70,0));
                    this.boardGirlSke.setScale(new Vec3(3,3,1));
                    this.richText.node.parent.setPosition(new Vec3(330,240,0));
                    break;
                case 1:
                    this.boardGirl.setPosition(new Vec3(-220,-70,0));
                    this.boardGirlSke.setScale(new Vec3(-3,3,1));
                    this.richText.node.parent.setPosition(new Vec3(-30,240,0));
                    break;
                case 2://第一关新手引导专用位置
                    this.boardGirl.setPosition(new Vec3(-320,570,0));
                    this.boardGirlSke.setScale(new Vec3(-3,3,1));
                    this.richText.node.parent.setPosition(new Vec3(-100,840,0));
                    break;
                case 3://右下
                    this.boardGirl.setPosition(new Vec3(200,-500,0));
                    this.boardGirlSke.setScale(new Vec3(3,3,1));
                    this.richText.node.parent.setPosition(new Vec3(330,-240,0));
                    break;
                case 4://左下
                    this.boardGirl.setPosition(new Vec3(-260,-500,0));
                    this.boardGirlSke.setScale(new Vec3(-3,3,1));
                    this.richText.node.parent.setPosition(new Vec3(-70,-240,0));
                    break;
                case 5://右上
                    this.boardGirl.setPosition(new Vec3(200,500,0));
                    this.boardGirlSke.setScale(new Vec3(3,3,1));
                    this.richText.node.parent.setPosition(new Vec3(330,760,0));
                    break;
                case 6://左上
                    this.boardGirl.setPosition(new Vec3(-260,500,0));
                    this.boardGirlSke.setScale(new Vec3(-3,3,1));
                    this.richText.node.parent.setPosition(new Vec3(-70,760,0));
                    break;
            }

            //4：修改镂空的形状和镂空的大小
            this.guide.getComponent(UITransform).height = size.y;
            this.guide.getComponent(UITransform).width = size.x;
            switch(dir){
                case 0:
                    this.finger_click.active = true;
                    this.finger_move.active = false;
                    this.isClose = false;
                    this.circle.active = false;
                    break;
                case 1:
                    this.finger_click.active = false;
                    this.finger_move.active = true;
                    let startPos = new Vec3(35,Sliiding.y,0)
                    
                    this.startAnimation(this.finger_move,startPos,
                        new Vec3(35,Sliiding.x,0)
                    )
                    this.isClose = false;
                    this.circle.active = false;
                    break;
                case 2:
                    this.finger_click.active = false;
                    this.finger_move.active = true;
                    let _startPos = new Vec3(Sliiding.y,-35,0)
                    
                    this.startAnimation(this.finger_move,_startPos,
                        new Vec3(Sliiding.x,-35,0)
                    )
                    this.isClose = false;
                    this.circle.active = false;
                    break;
                case 3:
                    this.finger_click.active = false;
                    this.finger_move.active = false;
                    this.isClose = true;
                    let _pos = new Vec3(localPosition.x+55,localPosition.y+115,0)
                    this.goLabel.setPosition(_pos);
                    this.circle.active = true;
                    this.circle.getComponent(UITransform).height = size.y+46;
                    this.circle.getComponent(UITransform).width = size.x+46;
                    break;
            }

            
        }
        endGuideId:number;
        nextGuideId:number;
        isChating:boolean;//是否点击继续聊天下一句
        callback:()=>void;
        isClose:boolean = false;// 点击是否关闭
        initChat(guideId,endGuideId,callback:()=>void = null){
            this.curTime = Date.now();
            this.callback = callback;
            if(this.outsideNode == null){
                this.initComponent();
            }
            this.clear();
            this.circle.active = false;
            this.closeBtn.node.setPosition(new Vec3(-800,600,0))

            let txt:string = GameManager.getInstance().guideInfo[guideId]["des"];
            //PrintEffect.getInstance().richText(txt,this.richText);
            PrintEffect.getInstance().Text(txt,this.text);
            if(Number(guideId) == 9){

            }else{}
            switch(Number(guideId)){
                case 9:
                    this.boardGirl.setPosition(new Vec3(800,-300,0));
                    this.boardGirlSke.setScale(new Vec3(-3,3,1));
                    this.richText.node.parent.setPosition(new Vec3(1000,-50,0));
                    this.goLabel.setPosition(new Vec3(65,-120,0));
                    break;
                default:
                    this.boardGirl.setPosition(new Vec3(880,-70,0));
                    this.boardGirlSke.setScale(new Vec3(-3,3,1));
                    this.richText.node.parent.setPosition(new Vec3(1100,240,0));
                    this.goLabel.setPosition(new Vec3(150,120,0));
                    break;
            }
            
            this.isChating = true;
            this.endGuideId = endGuideId;
            this.nextGuideId = guideId+1;
            this.isClose = true;
        }
        /**
         * 往复运动
         */
        private startAnimation(node,startPos,endPos) {
           
            this.finger_move.setPosition(startPos);
            // 创建一个Tween对象
            const tween = new Tween(node)
                .to(2, { position: endPos }, { easing: easing.expoInOut}) // 移动到终点
                //.to(1, { position: startPos }, { easing: easing.quadOut }) // 移动回起点
                .call(() => {
                    // 动画完成后的回调
                    this.startAnimation(node,startPos,endPos); // 循环播放动画
                });
    
            // 开始动画
            tween.start();
        }

        protected start(): void {
            this.popup = this.node.getComponent(Popup);
        }
        curTime = 0;
        onOutsideClick(event: EventTouch) {
            
            if(Date.now() < this.curTime+800){
                return;
            }else{
                
            }
            // 判断点击事件的目标节点是否为背景节点
            if (event.target === this.outsideNode) {
                console.log("点击外面");
                if(this.nextGuideId > this.endGuideId){
                    if(this.callback !=null){
                        this.callback();
                    }else{
                        if(this.isClose){
                            this.CloseSelf();
                            
                        }
                    }
                }else{
                    this.initChat(this.nextGuideId,this.endGuideId,this.callback);

                }
            }
        }

        CloseSelf(){
            //this.node.active = false;
            director.resume();
            this.node.active = false;
            this.clear();
        }
        onDestroy() {
            // 移除点击事件监听
            this.clear();
            this.outsideNode?.off(Node.EventType.TOUCH_END, this.onOutsideClick, this);
        }
        clear(){
            if(this.richText!= null){
                this.richText.string = "";
                Tween.stopAllByTarget(this.finger_move);
                this.guide.setPosition(new Vec3(-1000,0,0));
                this.mid.setPosition(new Vec3(-1000,0,0));
                this.goLabel.setPosition(new Vec3(-800,-500,0));
                this.closeBtn.node.setPosition(new Vec3(-800,600,0))
                this.endGuideId = 0;
            }
        }
}

