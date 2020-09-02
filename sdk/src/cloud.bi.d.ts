interface initParams {
    // 游戏ID
    gameId: string,
    channelId:string,
    // 是否打印日志
    log: boolean
}

interface appOnceParams {
    actionNumber: number
}

interface adVideoParams {
    // 视频触发点 跟翻译资源中id对应
    type: number
    // 玩家观看视频过程中的各个具体动作
    // 0 主动触发打开视频窗口
    // 1 看到视频窗口后主动关闭
    // 2 点击播放视频
    // 3 视频中途关闭视频
    // 4 观看结束
    // 5 获得奖励
    // 6 没有可观看的广告
    subType: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

interface battleParams {
    // 日志类型( 1战斗开始 2战斗成功结束 3战斗失败结束)
    logType: 1 | 2 | 3
    battleType: number
    battleId: number
    time?: number
}

declare module cloud { 
    export class BI { 
        appOnce(param:object) : number; 
    }
 }

 
 declare class BI {
    init(params: initParams): void
    appOnce(params: appOnceParams): void
    adVideo(params: adVideoParams): void
    battle(params: battleParams): void
    clear(): void
}
