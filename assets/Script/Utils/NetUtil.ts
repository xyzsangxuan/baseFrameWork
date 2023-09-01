import { path, sys } from 'cc';
import { UIManager } from '../Manager/UIManager';


export class NetUtil  {
    private static instance: NetUtil;
    private constructor() {}
    static getInstance(): NetUtil {
        if (!NetUtil.instance) {
            NetUtil.instance = new NetUtil();
        }
        return this.instance;
    }
    isWxInit: boolean;

    RequsetGet(path:string,data,successCallback:(res)=>void,errorCallBack:(res)=>void){
        //UIManager.getInstance().LoadingPanel(true);

        if (sys.platform === "WECHAT_GAME") {
			//微信小游戏环境下才执行
			//第1次运行需要初始化
			if (!this.isWxInit) {
				wx.cloud.init({env:'prod-0giiqofw6cf20a00'});
				this.isWxInit = true;
			}
			//云托管
		    const res = wx.cloud.callContainer({
                config: {
                    env: 'prod-0giiqofw6cf20a00', // 微信云托管的环境ID
                },
                path: '/' + path, // 填入业务自定义路径和参数，根目录，就是 / 
                method: 'GET', // 按照自己的业务开发，选择对应的方法
                header: {
                    "X-WX-SERVICE": "springboot-x8q7", // 填入服务名称
                    "content-type": "application/json"
                    // 其他 header 参数
                },
                data: data,
                success: (res: any) => {
                    if (successCallback != null) {
                        successCallback(res.data);
                        //console.log("成功：",res);
                        //UIManager.getInstance().LoadingPanel(false);

                    }
                },
                fail: (err: any) => {
                    if (errorCallBack != null) {
                        errorCallBack(err.data);
                        //console.log("失败:",res);
                        // UIManager.getInstance().LoadingPanel(false);
                        // UIManager.getInstance().Tip("同步失败！");
                    }
                }
            });
		}else{
            console.log(sys.platform+"非微信环境下");
            if (data) {
                let paramsArray = [];
                //拼接参数
                Object.keys(data).forEach(key => paramsArray.push(key + '=' + data[key]))
                if (path.search(/\?/) === -1) {
                    path += '?' + paramsArray.join('&')
                } else {
                    path += '&' + paramsArray.join('&')
                }
            }


            fetch("http://localhost:8083"+path )
            .then((response: Response) => {
            return response.text()
            }).then((value) => {
                //console.log(value);
                const jsonObj = JSON.parse(value)
                // const map = new Map()
                // for (const k of Object.keys(jsonObj)) {
                //     map.set(k, jsonObj[k])
                // }
                successCallback?.(jsonObj);
                // let code:number = jsonObj.code;
                // UIManager.getInstance().LoadingPanel(false);
                // if(code == 1){
                // }else{
                //     UIManager.getInstance().Tip("同步失败！");
                // } 
            })
        }
        
    }
    RequsetPost(path:string,data,successCallback:(res)=>void,errorCallBack:(res)=>void){
        //UIManager.getInstance().LoadingPanel(true);
        if (sys.platform === "WECHAT_GAME") {
			//微信小游戏环境下才执行
			//第1次运行需要初始化
			if (!this.isWxInit) {
				wx.cloud.init({env:'prod-0giiqofw6cf20a00'});
				this.isWxInit = true;
			}
			//云托管
		    const res = wx.cloud.callContainer({
                config: {
                    env: 'prod-0giiqofw6cf20a00', // 微信云托管的环境ID
                },
                path: '/' + path, // 填入业务自定义路径和参数，根目录，就是 / 
                method: 'POST', // 按照自己的业务开发，选择对应的方法
                header: {
                    "X-WX-SERVICE": "springboot-x8q7", // 填入服务名称
                    "content-type": "application/json"
                    // 其他 header 参数
                },
                data: data,
                success: (res: any) => {
                    if (successCallback != null) {
                        successCallback(res.data);
                        //console.log("成功：",res);
                        UIManager.getInstance().LoadingPanel(false);
                    }
                },
                fail: (err: any) => {
                    if (errorCallBack != null) {
                        errorCallBack(err.data);
                        //console.log("失败",res);
                        let code:number = res.code;
                        // UIManager.getInstance().LoadingPanel(false);
                        // UIManager.getInstance().Tip("同步失败！");
                        
                    }
                }
            });
		}else{
            console.log(sys.platform+"非微信环境下");
            // let init :RequestInit;
            // init.method = "POST"
            fetch("http://localhost:8083"+path,{
                method: 'post',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
              }).then((response: Response) => {
            return response.text()
            }).then((value) => {
                //console.log(value);
                
                const jsonObj = JSON.parse(value)
                // const map = new Map()
                // for (const k of Object.keys(jsonObj)) {
                //     map.set(k, jsonObj[k])
                // }
                successCallback?.(jsonObj);
                // let code:number = jsonObj.code;
                // UIManager.getInstance().LoadingPanel(false);
                // if(code == 1){
                // }else{
                //     UIManager.getInstance().Tip("同步失败！");
                // }           
            })
        }
    }
}

