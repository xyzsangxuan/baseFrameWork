import { _decorator, AudioClip, Component  , find, Game, instantiate, Label, Node, Prefab, size, Sprite, TextAsset, Texture2D, UITransform, Vec2 } from 'cc';
import { PlayerSaveManager } from './PlayerSaveManager';
import { ResMgr } from './ResMgr';

export class GameApp extends Component {
    public static  Instance :GameApp = null as unknown as GameApp;
    private canvas : Node|null = null;
    private progressBar : UITransform|null = null;
    private progressTxt : Label|null = null
    onLoad():void{
        if(GameApp.Instance === null){
            GameApp.Instance = this;
        }else{
            this.destroy();
            return;
        }
        this.canvas = find("Canvas");
        this.progressBar = this.canvas?.getChildByName("UIProgress")?.getComponent(UITransform) as UITransform;
        this.progressTxt = this.canvas?.getChildByName("progress")?.getComponent(Label) as Label;

        this.progressBar.contentSize = size(this.full*0,24);
    }
    full:number = 560;
    public EnterGame():void{
        var resPkg_all = {//加载全部
            GUI:{
                assetType:Prefab,
                urls:[
                ]
            },
           
            Textures:{
                assetType:Texture2D,
                urls:[
                    
                    
                ]
            },
            Effects:{
                assetType:Prefab,
                urls:[
                    

                ]
            },
            Music:{
                assetType:AudioClip,
                urls:[
                   
                ]
            }
        };
        
        ResMgr.Instance.loadResPkg(resPkg_all,(now:number,total:number)=>{
            var par = now /total;
            if(this.progressBar !== null){
                this.progressBar.contentSize = size(this.full*par,24);
            }
            if(this.progressTxt !== null){
                this.progressTxt.string ="资源加载 :"+Math.floor(100*par)+"%" +" 1/2";
            } 
        },()=>{ 
            //网络同步
            this.GameInit();
        })
        //加载资源
        console.log("Enter Game")
    }
    public EnterLoginScene():void {
        //释放3D地图
        //释放角色
        //释放UI视图
        // var mainUIPrefab = ResMgr.Instance.getAsset("GUI","MainUI/Prefabs/MainUI");
        // var mainUI = instantiate(mainUIPrefab);
        // mainUI.addComponent(MainUI).callback = ()=>{};
        // this.canvas?.addChild(mainUI);
        
    }
    public GameInit(){
        //初始化存档
        PlayerSaveManager.getInstance().initSave(()=>{
            this.syncProgress();
        });
       
    }
    now :number= 0;
    total :number= 4;//需要进行网络同步的个数:1登录交互，2拉取个人信息，3获取配置信息,4获取七日和每日奖励配置
    syncProgress(){
       this.now++
        var par = this.now /this.total;
        if(this.progressBar !== null){
            this.progressBar.contentSize = size(this.full*par,24);
        }
        if(this.progressTxt !== null){
            this.progressTxt.string ="同步信息 :"+Math.floor(100*par)+"%" +" 2/2";
            
        }
        if(this.now >= this.total){
            this.canvas?.destroyAllChildren();
            //加载资源
            this.EnterLoginScene();
        } 
    }
}

