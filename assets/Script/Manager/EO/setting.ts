//全局静态变量
export class setting {
    //事件
    static Move_Click_Item: string = "Move_Click_Item";
    static Click_Click_Item: string = 'Click_Click_Item';
    static Open_Card_Panel: string = 'Open_Card_Panel';
    static Go_Battle_Panel: string = 'Go_Battle_Panel';
    //存档
    static Player_Data: string = "playerData";
    //玩家战斗体力消耗
    static Player_Power_Once: number = 1;
    static Player_Power_Max:number = 50;
    static Level_Max:number = 99;
    static CritialRate:number = 2;
    static Been_CritialRate:number = 0.5;
    //游戏模式：回合制模式，限时模式，无限关卡模式
    static Battle_Mode_Round: string = "Battle_Mode_Round";
    static Battle_Mode_Limit_Time: string = "Battle_Mode_Limit_Time";
    static Battle_Mode_Unless: string = "Battle_Mode_Unless";
    //棋盘点击规则
    static Match_Mode_Alwayes: string = "Match_Mode_Alwayes";
    static Match_Mode_Normal: string = "Match_Mode_Normal";
    
}

//动物类型
export enum AnimalType {
    cat = 0,//小猫
    lamb,//小羊
    Littlefrog,//小青蛙
    calf,//小牛
    Littlelion,//小狮子
    littleowl,//小鹰
    babyseal,//小海豹
    
    LittleShibaInu ,//小柴犬
    LittleTabbyCat ,//小狸花猫
    MagicBubble ,//神奇泡泡
    LittleDot ,//小点点
    AdorableBunny ,//萌萌兔
    SnowballLittleBear ,//雪球小熊
    Max,//被消除的标志
}

export enum Enemytype {
    Boss,
    Soldier_front,
    Soldier_Mid,
    Soldier_Back
}