/**
 * 存档工具类
 *  
 * 
 * */ 
export class SaveGame {
    // 保存玩家信息到本地存储
    public static savePlayerData(playerData: any,saveName: string): void {
      const serializedData = JSON.stringify(playerData);
      localStorage.setItem(saveName, serializedData);
    }
  
    // 从本地存储中读取玩家信息
    public static loadPlayerData(saveName: string): any {
      const serializedData = localStorage.getItem(saveName);
      if (serializedData) {
        return JSON.parse(serializedData);
      }
      return null;
    }
  
    // 删除本地存储中的玩家信息
    public static deletePlayerData(saveName: string): void {
      localStorage.removeItem(saveName);
    }
  }
  

  