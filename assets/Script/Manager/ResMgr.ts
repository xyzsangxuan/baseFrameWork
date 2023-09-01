import { Component, Node, assetManager, error } from 'cc';
/**
 * 接口1：批量预加载游戏资源；ab包名字（GUI），ab包里资源路径（UIPrefabs/GameUI）每个ab包路径是相对于ab包的文件夹而言
 * 资源类型、URLs:[]（资源路径）
 * 接口2：提供一个接口当度加载--->等待进度
 * 接口3：卸载我们的资源包；
 * 接口4：getAsset获取我们的资源，代码new内容到我们的游戏场景
 */
export class ResMgr extends Component {

    private abBunds:any = {};//保存哪个AB的名字对应哪个对象
    private abBunds_Next :any = {}
    private totalAb:number = 0;//总共有多少AB包要加载
    private nowAb:number = 0;//当前有多少AB包加载进来了
    private total:number = 0;//总共有多少数目要加载
    private now:number = 0;//当前加载的数目
    private progressFunc:Function|null = null;//进度函数
    private endFunc:Function|null = null;
    public static Instance :ResMgr = null as unknown as ResMgr;
    onLoad():void{
        if(ResMgr.Instance === null){
            ResMgr.Instance = this;
        }else{
            this.destroy();
            return;
        }
    }
    public loadResPkg(resPkg:any,progressFunc:Function,endFunc:Function){
        this.total = 0;
        this.now = 0;
        this.totalAb = 0;
        this.nowAb = 0; 
        this.progressFunc = progressFunc;
        this.endFunc = endFunc;
        for(var key in resPkg){
            this.totalAb ++;//总共的AB包
            this.total += resPkg[key].urls.length;//总共要加载的资源
        }
        //this.loadTime = Date.now();
        //console.log("加载开始时："+this.loadTime)
        let i = 0;
        for(var key in resPkg){
            //let t1 = Date.now();
            //console.log("异步开始加载第"+i+"个包"+key+": "+t1)
            this.loadAssetsBundle(key, async ()=>{
                this.nowAb ++;
                if(this.nowAb === this.totalAb){
                    //this.loadAssetsInAssetsBundleV1(resPkg);
                    //await this.executePreFrame(this.preloadAssetsInAssetsBundle(resPkg),1);
                    //await this.executePreFrame(this.loadAssetsInAssetsBundleV2(resPkg),16);
                    //this.loadAssetsInAssetsBundleV2(resPkg)
                    this.loadAssetsInAssetsBundleV3(resPkg);
                }
            })
            //let t2 = Date.now();
            //console.log("异步开始加载第"+i+"个包: "+t2)
            //console.log("加载"+key+"总耗时 "+(t2-t1)/1000)
            i++;
        }
    }
    private loadAssetsBundle(abName:string,endFunc:Function):void{
        assetManager.loadBundle(abName,(err,bundle)=>{
            if(err != null){
                console.log("[ResMgr]:Load AssetsBundle Error:"+abName);
                this.abBunds[abName] = null;
                this.abBunds_Next[abName] = null;
            }
            else{
                //console.log("[ResMgr]:Load AssetsBundle Success:"+abName);
                if(this.abBunds[abName] == null){
                    this.abBunds[abName] = bundle;
                }else{
                    this.abBunds_Next[abName] = bundle;
                }
                
            }
            if(endFunc){
                endFunc();
            }
        })
    }
 
    private  *loadAssetsInAssetsBundleV2(resPkg:any){
        let j =0;
        for(var key in resPkg){
          
            var urlSet = resPkg[key].urls;
            var typeClass = resPkg[key].assetType;

            for(var i = 0;i <urlSet.length;i++){
                
                //await new Promise((resolve) => setTimeout(resolve, 17));
                this.loadRes(this.abBunds[key],urlSet[i],typeClass);
                //console.log("异步开始加载"+key+"第"+i+"个包"+urlSet[i]+": "+t1)
                //
                
                //console.log("异步结束始加载"+key+"第"+i+"个包"+urlSet[i]+": "+t2)
                
            }
        }
    }
       // 并发加载的最大资源数量
       concurrentLoads = 0;
       MAX_CONCURRENT_LOADS = 2;
       waitTime = 150;
    private  async loadAssetsInAssetsBundleV3(resPkg:any){
        let j =0;
        for(var key in resPkg){
          
            var urlSet = resPkg[key].urls;
            var typeClass = resPkg[key].assetType;

            for(var i = 0;i <urlSet.length;i++){
                //this.waitTime = -(i * i)/1000 -70*i/1000 +100 ;
                if(i<2 ||i>70){
                    this.waitTime = 100;
                }else{
                    this.waitTime = 1;
                }
                if (this.concurrentLoads < this.MAX_CONCURRENT_LOADS) {
                    
                    // 控制并发加载的资源数量
                   this.concurrentLoads++;
                    this.loadRes(this.abBunds[key],urlSet[i],typeClass);
                    //console.log("开始加载--"+urlSet[i]+"---加载!-----"+Date.now());
                  } else {
                    //this.waitTime = 100;
                    // 等待一段时间后继续检查
                    await new Promise((resolve) => setTimeout(resolve, this.waitTime));
                    //console.log("---开始阻塞---"+urlSet[i]+"--阻塞!-----"+Date.now());
                    i--;
                  }
                //await new Promise((resolve) => setTimeout(resolve, 17));
                //this.loadRes(this.abBunds[key],urlSet[i],typeClass);
                //console.log("异步开始加载"+key+"第"+i+"个包"+urlSet[i]+": "+t1)
                //
                
                //console.log("异步结束始加载"+key+"第"+i+"个包"+urlSet[i]+": "+t2)
                
            }
        }
    }
   

    loadRes(abBundle:any,url:any,typeClasss:any){
        let t1 = Date.now();
        //console.log("异步开始加载"+url+": "+t1)
       
        abBundle.load(url,typeClasss,(error:any,asset:any)=>{
            this.now++;
            this.concurrentLoads--;
            if(error){
                console.log("load Res "+url+' error: '+error);
            }
            else{
                //console.log("load Res "+url+' Success!');
            }
            if(this.progressFunc){
                this.progressFunc(this.now,this.total);
            }
            //let t2 = Date.now();
            //("加载"+":"+url+"耗时 "+(t2-t1)/1000)
            //console.log(this.now,this.total);
            if(this.now >= this.total){
                let t = Date.now();
                //console.log("加载总耗时："+(t- this.loadTime )/1000)
                if(this.endFunc !== null){
                    this.endFunc();
                }
            }
        });
    }
    loadTime:number = 0;
    //var pkg = {GUI:{assetType:cc.Prefab,urls:["","",""]}}
    public preloadResPkg(resPkg:any,progressFunc:Function,endFunc:Function){
        this.total = 0;
        this.now = 0;
        this.totalAb = 0;
        this.nowAb = 0; 
        this.progressFunc = progressFunc;
        this.endFunc = endFunc;
        for(var key in resPkg){
            this.totalAb ++;//总共的AB包
            this.total += resPkg[key].urls.length;//总共要加载的资源
        }
        this.loadTime = Date.now();
        //console.log("加载开始时："+this.loadTime)
        let i = 0;
        for(var key in resPkg){
            let t1 = Date.now();
            //console.log("异步开始加载第"+i+"个包"+key+": "+t1)
            this.loadAssetsBundle(key,async ()=>{
                this.nowAb ++;
                if(this.nowAb === this.totalAb){
                    //this.loadAssetsInAssetsBundleV1(resPkg);
                    await this.executePreFrame(this.preloadAssetsInAssetsBundle(resPkg),2);
                }
            })
            let t2 = Date.now();
            //console.log("异步开始加载第"+i+"个包: "+t2)
            //console.log("加载"+key+"总耗时 "+(t2-t1)/1000)
            i++;
        }
    }
    private *preloadAssetsInAssetsBundle(resPkg:any){
        let j =0;
        for(var key in resPkg){
          
            var urlSet = resPkg[key].urls;
            var typeClass = resPkg[key].assetType;

            for(var i = 0;i <urlSet.length;i++){
                
                //console.log("异步开始加载"+key+"第"+i+"个包"+urlSet[i]+": "+t1)
                //await new Promise((resolve) => setTimeout(resolve, 1));
                if(this.abBunds_Next[key] == null ){
                    yield this.preloadRes(this.abBunds[key],urlSet[i],typeClass);
                }else{
                    yield this.preloadRes(this.abBunds_Next[key],urlSet[i],typeClass);
                }
                //yield this.preloadRes(this.abBunds_Next[key],urlSet[i],typeClass);
                
                //console.log("异步结束始加载"+key+"第"+i+"个包"+urlSet[i]+": "+t2)
                
            }
        }
    }
    public preloadRes(abBundle:any,url:any,typeClasss:any):void{
        let t1 = Date.now();
        //console.log("异步开始加载"+url+": "+t1)
         abBundle.preload(url,typeClasss,(error:any,asset:any)=>{
            this.now++;
            if(error){
                console.log("load Res "+url+' error: '+error);
            }
            else{
                //console.log("load Res "+url+' Success!');
            }
            if(this.progressFunc){
                this.progressFunc(this.now,this.total);
            }
            let t2 = Date.now();
            //console.log("预加载"+":"+url+"耗时 "+(t2-t1)/1000)
            //console.log(this.now,this.total);
            if(this.now >= this.total){
                let t = Date.now();
                //console.log("预加载加载总耗时："+(t- this.loadTime )/1000)
                if(this.endFunc !== null){
                    this.endFunc();
                }
            }
        });
    }
    

    public unloadResPkg(resPkg:any):void{

    }

   
    public getAsset(abName:string,url:string):any{
        if(url == ""||url == null){
            console.log("为空！")
            return ;
        }
        var bondule = assetManager.getBundle(abName);
        if(bondule === null){
            console.log("[error]:" + abName+" AssetBundle not loaded !!!");
        
        }
        return bondule.get(url);
    }
    public releaseResPackage(resPkg:any){
        for(var key in resPkg){
            var urlSet = resPkg[key].urls;
            for(var i = 0;i <urlSet.length;i++){
                var bondule:any = assetManager.getBundle(key);
                if(bondule === null){
                    console.log("[error]:"+key+" AssetsBundle note loaded !!!");
                    continue;
                }
                assetManager.releaseAsset(bondule.get(urlSet[i]));
            }
        }
    }

    public releaseRes(abName:string,url:string){
        console.log("卸载abName："+abName+";url:"+url)
        var bondule = assetManager.getBundle(abName);
        if(bondule === null){
            console.log("[error]:" + abName+" AssetBundle not loaded !!!");
            return null;
        }
        assetManager.releaseAsset(bondule.get(url));
    }


    /**
     * 实现分帧加载
     */
    async framingLoad(length: number) {
        await this.executePreFrame(this._getItemGenerator(length), 1);
    }

    async LoadPKG(){//实现分帧加载
        //新建分帧执行逻辑,新增加载逻辑
        //await this.executePreFrame(this.loadAssetsInAssetsBundle,4);
    }


    /**
     * 分帧执行 Generator 逻辑
     *
     * @param generator 生成器
     * @param duration 持续时间（ms）
     *          每次执行 Generator 的操作时，最长可持续执行时长。
     *          假设值为8ms，那么表示1帧（总共16ms）下，分出8ms时间给此逻辑执行
     */
    private executePreFrame(generator: Generator, duration: number) {
        return new Promise<void>(async (resolve, reject) => {
            let gen = generator;
            //await new Promise((resolve) => setTimeout(resolve, 20));
            // 创建执行函数
            let execute = () => {

                // 执行之前，先记录开始时间戳
                let startTime = new Date().getTime();

                // 然后一直从 Generator 中获取已经拆分好的代码段出来执行
                for (let iter = gen.next(); ; iter = gen.next()) {

                    // 判断是否已经执行完所有 Generator 的小代码段
                    // 如果是的话，那么就表示任务完成
                    if (iter == null || iter.done) {
                        resolve();
                        return;
                    }

                    // 每执行完一段小代码段，都检查一下是否
                    // 已经超过我们分配给本帧，这些小代码端的最大可执行时间
                    if (new Date().getTime() - startTime > duration) {
                        
                        // 如果超过了，那么本帧就不在执行，开定时器，让下一帧再执行
                        this.scheduleOnce(() => {
                            execute();
                        });
                        return;
                    }
                }
            };
            // 运行执行函数
            execute();
        });
    }
    /**
     * （新增代码）获取生成子节点的Generator
     */
    private *_getItemGenerator(length: number) {
        for (let i = 0; i < length; i++) {
            //执行具体，生成或者加载逻辑
            yield this._initItem(i);
        }
    }

    /**
     * （和拆分前的代码一致）
     */
    private _initItem(itemIndex: number) {
        // let itemNode = instantiate(this.itemPrefab);
        // itemNode.width = this.scrollView.content.width / 10;
        // itemNode.height = itemNode.width;
        // itemNode.parent = this.scrollView.content;
        // itemNode.setPosition(0, 0);
    }
}

