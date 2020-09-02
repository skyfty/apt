declare var wx:any;
import fly from 'flyio';

interface requestParam {
  retryCnt:number;
  params:any
}

interface requestData {
  act:string, 
  act_time:number, 
  game:string,
  channel:string,
  trap:string,
  data:any
}

export class BI {
  private static isInit:boolean = false;
  private static envParams:initParams;

  public static init(params: initParams): void {
    BI.isInit = true;
    BI.envParams = params;
  }

  public static appOnce(param: appOnceParams): void {
    if (!BI.isInit) {
      if (BI.envParams.log) {
        console.error("not call init yet!!");
      }
      return;
    }

    let reqParam:requestData = BI.initRequestParam("appOnce", param);
    BI.request({retryCnt:10,params:reqParam }, BI.defCallback);
  }

  public static adVideo(param: adVideoParams): void {
    if (!BI.isInit) {
      if (BI.envParams.log) {
        console.error("not call init yet!!");
      }
      return;
    }

    let reqParam:requestData = BI.initRequestParam("adVideo", param);
    BI.request({retryCnt:10,params:reqParam }, BI.defCallback);
  }
  
  public static battle(param: battleParams): void {
    if (!BI.isInit) {
      if (BI.envParams.log) {
        console.error("not call init yet!!");
      }
      return;
    }
    let reqParam:requestData = BI.initRequestParam("battle", param);
    BI.request({retryCnt:10,params:reqParam }, BI.defCallback);
  }

  private static initRequestParam(act:string, data:any):requestData {
    let trap =  (data.action ? data.action:"default")
    let reqParam:requestData = {
      "game":BI.envParams.game,
      "channel":BI.envParams.channel,
      "trap":trap,
      "act":act, 
      "act_time":12, 
      "data":JSON.stringify(data),
    };
    return reqParam;
  }

  private static defCallback(res:any):void{
    if (BI.envParams.log) {
      console.log(res);
    }
  }

  private static request(req: requestParam, cb:Function): void {
    if (req.retryCnt-- > 0) {
      let timeout = (req.retryCnt >= 10 ? 100:1000);
      setTimeout(()=>{
        BI.postData(req, cb, ()=>{ 
          BI.request(req, cb);
        });
      }, timeout);
    }
  }

  private static postData(req: requestParam, cb:Function, errcb:Function):void{
    const requrl = "http://bi.touchmagic.cn";
    if (typeof wx == "undefined") {
      fly.post(requrl,req.params).then(function (response) {
        if (cb) {
          cb(response);
        }
      }).catch(function (error) {
        errcb();
      });;
    } else {
      wx.request({
        url: requrl,
        data: req.params,
        method: 'POST',
        success: function (res: object) {
          if (cb) {
            cb(res);
          }
        },
        fail: errcb,
      });
    }
  }
}