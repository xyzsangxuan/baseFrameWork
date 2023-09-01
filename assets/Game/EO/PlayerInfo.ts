
/**
 * 玩家个人存档
 */
export class PlayerInfo {
    constructor(playerID = "playerID"){
        this._playerID = playerID;
    }
    public _playerID: string;//	玩家ID，唯一标识符
}

