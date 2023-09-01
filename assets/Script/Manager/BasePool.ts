/**
 * 对象池基类
 * 只要继承本类,并重写前4个变量即可
 */

import { Component, NodePool, Prefab, error, instantiate, log, resources, warn,Node } from "cc";
import Singleton from "./Singleton";
import { ResMgr } from "./ResMgr";

 
export class BasePool extends Singleton {
    //预制体url 子类实现赋值
    prefabUrl: string;
    abName: string;
    url: string;
    // //(可选)对象脚本组件 子类实现赋值
     script: { prototype: Component } | string;
    //(可选)初始化池量 子类实现赋值
    poolSize: number = 10;
    //(可选)组件名字
    nodeName: string;
    //(可选)VIP标记 回收判定是否本池实例
    MemberFlag: string;
 
    public _pool: NodePool;
    public _prefab: Prefab;
    private _nodeName: string;
 
    /**
     * 初始化对象池入口
     * fixme 注意：由于使用了动态资源加载,会有出现资源加载延迟现象,使用是不能直接链式编程获取对象,等实例化完成在获取对象池
     * @param size 初始池量
     */
    initPool(size?: number) {
        this.clean();
        let prefab = ResMgr.Instance.getAsset(this.abName,this.url) as Prefab;

        prefab.addRef();
        this._prefab = prefab;
        this._nodeName = prefab.name;
        this.initPoolSize(size);
    }
 
    /**
     * 获取成员对象
     */
    getNode() {
        let obj: Node;
        if (this._pool.size() > 0) {
            obj = this._pool.get();
            log(`BasePool Tip: 获取${this.MemberFlag}Pool 成员成功,当前池容量剩余:${this._pool.size()}`);
        } else {
            obj = this.buildNode();
            log(`BasePool Tip: 获取${this.MemberFlag}Pool 成员成功,该池容量不足,产生新成员`);
        }
        if (!obj) {
            throw new Error(`BasePool Tip: 获取${this.MemberFlag}Pool 成员失败`);
        }
        return obj;
    }
 
 
    /**
     * 回收对象接口
     * @param obj 回收对象
     */
    putNode(obj: Node) {
        if (this.isPoolMember(obj)) {
            //回收对象
            this._pool.put(obj);
            log(`BasePool Tip: ${this.MemberFlag}Pool回收对象成功,当前池容量提升至:${this._pool.size()}`);
        } else {
            if (obj && obj.name) {
                warn(`BasePool Tip: ${this.MemberFlag}Pool回收对象错误,${obj.name}并该对象池成员,回收失败`);
            } else {
                throw new Error(`BasePool Tip: 获取${this.MemberFlag}Pool回收对象错误,对象不存在`);
            }
        }
    }
 
    /**
     * 清空对象池
     */
    clean() {
        if (this._pool) {
            this._pool.clear();
            log(`BasePool Tip: 清空${this.MemberFlag}Pool成功,当前池容量:${this._pool.size()}`);
        }
 
        //释放预制体组件资源
        if (this._prefab) {
            this._prefab.decRef();
            this._prefab = null;
            log(`BasePool Tip: 释放${this.MemberFlag}Pool 资源数据`);
        }
    }
 
 
    /**
     * 初始化对象池
     * @param size 数量
     */
    initPoolSize(size?: number) {
        if (size > 0) {
            this.poolSize = size;
        }
        //对象池
        if (this._prefab) {
            if (!this.MemberFlag) {
                this.MemberFlag = this.constructor.name;
            }
            //if (this.script) {
             //   this._pool = new NodePool(this.script);
            //} else {
                this._pool = new NodePool();
            //}
            for (let i = 0; i < this.poolSize; i++) {
                let obj = this.buildNode();
                this._pool.put(obj);
            }
            log(`BasePool Tip: 初始化对象池(${this.MemberFlag}Pool)完成,初始容量为:${this._pool.size()}`);
        } else {
            error(`BasePool Tip: ${this.MemberFlag}pool 初始化失败`)
        }
    }
 
    /**
     * 实例化对象并标记为VIP
     */
    buildNode(): Node {
        let node: Node = instantiate(this._prefab);
        node["memberFlag"] = this.MemberFlag;
        if (this.nodeName) {
            node.name = this.nodeName;
        }
        return node;
    }
 
    /**
     * 判定是否VIP
     * @param node 回收对象
     */
    private isPoolMember(node: Node): boolean {
        return node instanceof Node && this.MemberFlag == node["memberFlag"];
    }
 
    /**
     * 获取组件名字
     */
    getNodeName(): string {
        return this.nodeName ? this.nodeName : this._nodeName;
    }
}