import { _decorator, Component, Label, Node, RichText } from 'cc';
const { ccclass, property } = _decorator;

export class PrintEffect  {
    private static instance: PrintEffect;
    private static lock: boolean = false;
    
    public static getInstance(): PrintEffect {
        if (!PrintEffect.instance) {
        if (!PrintEffect.lock) {
            PrintEffect.lock = true; // 加锁
            PrintEffect.instance = new PrintEffect();
            PrintEffect.lock = false; // 解锁
        }
        }
        return PrintEffect.instance;
    }
    timerStop:boolean = false;
    public richText(str: string = "",richtext:RichText) {
        this.timerStop = true;
        richtext.string = "";
        const regex = /<.+?\/?>/g; // 匹配尖括号标签
        const matchArr = str.match(regex);
        const specialChar = "│";
        const replaceStr = str.replace(regex, specialChar); // 标签数组
        const textArr: string[] = replaceStr.split(specialChar); // 文字数组
        const strArr: string[] = []; // 存放处理过的文字数组
        let paraNum = 0; // 待替换参数个数
        for (let text of textArr) {
            // 非空字符替换成类似 $[0-n] 参数
            if (text !== "") {
                text = `$[${paraNum}]`;
                paraNum += 1;
            }
            strArr.push(text);
        }
        let templetStr: string = strArr.join(specialChar); // 数组转成待替换字符串
        for (let index = 0; index < textArr.length; index++) {
            // 转换代替换字符串之后, 删除文字数组多余空字符
            if (textArr[index] === "") {
                textArr.splice(index, 1);
                index = index - 1;
            }
        }
        while (templetStr.search(specialChar) !== -1) {
            // 数组转成的字符串原本 '特殊字符' 位置都是富文本标签的位置, 替换回标签
            if (matchArr[0]) {
                templetStr = templetStr.replace(specialChar, matchArr[0].toString());
                matchArr.splice(0, 1);
            } else {
                templetStr = templetStr.replace(specialChar,             "");// 空字符串替换,防止死循环
                console.warn("matchArr not enough");
            }
        }
        const lastStrArr: string[] = []; // 转换后富文本数组
        const arrayParm: string[] = new Array(paraNum).fill(""); // 替换参数数组
        for (let i = 0; i < textArr.length; i++) {
            for (const text of textArr[i]) {
                arrayParm[i] = arrayParm[i] + text;
                let replaceStr1 = templetStr;
                for (let index = 0; index < paraNum; index++) {
                    replaceStr1 = replaceStr1.replace(`$[${index}]`, arrayParm[index]);
                }
                lastStrArr.push(replaceStr1);
            }
        }
        let lastStrIndex = 0;
        const func = () => {
            if(this.timerStop == true){
                return;
            }
            if (lastStrIndex >= lastStrArr.length) {
                return;
            }
            richtext.string = lastStrArr[lastStrIndex] +"\n";
            lastStrIndex += 1;
            setTimeout(() => {
                func();
            }, 50);
        };
        setTimeout(() => {
            this.timerStop = false;
            func();
        }, 100);
    }

    public Text(str: string = "",text:Label) {
        this.timerStop = true;
        text.string = "";
        const regex = /<.+?\/?>/g; // 匹配尖括号标签
        const matchArr = str.match(regex);
        const specialChar = "│";
        const replaceStr = str.replace(regex, specialChar); // 标签数组
        const textArr: string[] = replaceStr.split(specialChar); // 文字数组
        const strArr: string[] = []; // 存放处理过的文字数组
        let paraNum = 0; // 待替换参数个数
        for (let text of textArr) {
            // 非空字符替换成类似 $[0-n] 参数
            if (text !== "") {
                text = `$[${paraNum}]`;
                paraNum += 1;
            }
            strArr.push(text);
        }
        let templetStr: string = strArr.join(specialChar); // 数组转成待替换字符串
        for (let index = 0; index < textArr.length; index++) {
            // 转换代替换字符串之后, 删除文字数组多余空字符
            if (textArr[index] === "") {
                textArr.splice(index, 1);
                index = index - 1;
            }
        }
        while (templetStr.search(specialChar) !== -1) {
            // 数组转成的字符串原本 '特殊字符' 位置都是富文本标签的位置, 替换回标签
            if (matchArr[0]) {
                templetStr = templetStr.replace(specialChar, matchArr[0].toString());
                matchArr.splice(0, 1);
            } else {
                templetStr = templetStr.replace(specialChar,             "");// 空字符串替换,防止死循环
                console.warn("matchArr not enough");
            }
        }
        //去除掉富文本标签
        templetStr = "";
        for(let i = 0;i<paraNum;i++){
            templetStr =  templetStr+"$["+i+"]";
        }
        
        const lastStrArr: string[] = []; // 转换后富文本数组
        const arrayParm: string[] = new Array(paraNum).fill(""); // 替换参数数组
        for (let i = 0; i < textArr.length; i++) {
            for (const text of textArr[i]) {
                arrayParm[i] = arrayParm[i] + text;
                let replaceStr1 = templetStr;
                for (let index = 0; index < paraNum; index++) {
                    replaceStr1 = replaceStr1.replace(`$[${index}]`, arrayParm[index]);
                }
                lastStrArr.push(replaceStr1);
            }
        }
        let lastStrIndex = 0;
        const func = () => {
            if(this.timerStop == true){
                return;
            }
            if (lastStrIndex >= lastStrArr.length) {
                return;
            }
            text.string = lastStrArr[lastStrIndex] +"\n";
            lastStrIndex += 1;
            setTimeout(() => {
                func();
            }, 50);
        };
        setTimeout(() => {
            this.timerStop = false;
            func();
        }, 100);
    }
}

