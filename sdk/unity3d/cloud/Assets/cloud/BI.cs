using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

namespace cloud
{
    public class InitParams
    {
        // 游戏ID
        public string game;
        public string channel;
        // 是否打印日志
        public bool log;
    }

    public class BaseParams
    {
        public string action = "default";
    }

    public class AppOnceParams : BaseParams
    {
        public override string ToString()
        {
            string json = "{";
            json = json + "\"action\":" + action;
            json = json + "}";
            return json;
        }
    }

    public class ActionParams : BaseParams
    {
        public override string ToString()
        {
            string json = "{";
            json = json + "\"action\":" + action;
            json = json + "}";
            return json;
        }
    }

    public class AdVideoParams : BaseParams
    {

        // 视频触发点 跟翻译资源中id对应
        public int type;
        // 玩家观看视频过程中的各个具体动作
        // 0 主动触发打开视频窗口
        // 1 看到视频窗口后主动关闭
        // 2 点击播放视频
        // 3 视频中途关闭视频
        // 4 观看结束
        // 5 获得奖励
        // 6 没有可观看的广告
        public int subType;

        public override string ToString()
        {
            string json = "{";
            json = json + "\"type\":" + type + ",";
            json = json + "\"subType\":" + subType;
            json = json + "}";
            return json;
        }
    }

    public class BattleParams : BaseParams
    {
        // 日志类型( 1战斗开始 2战斗成功结束 3战斗失败结束)
        public int logType;
        public int battleType;
        public int battleId;
        public int time;

        public override string ToString()
        {
            string json = "{";
            json = json + "\"logType\":" + logType + ",";
            json = json + "\"battleType\":" + battleType + ",";
            json = json + "\"battleId\":" + battleId + ",";
            json = json + "\"time\":" + time;
            json = json + "}";
            return json;
        }
    }


    public class RequestData
    {
        public RequestData(InitParams param, object data)
        {
            this.game = param.game;
            this.channel = param.channel;
            this.channel = param.channel;
            this.data = data;
        }
        public string act;
        public System.DateTime act_time;
        public string game;
        public string channel;
        public string trap;
        public object data;
    }

    public class RequestParam
    {
        public RequestParam(RequestData reqData)
        {
            requestData = reqData;
        }
        public int retryCnt = 10;
        public RequestData requestData;
    }

    public class BI
    {
        private bool isInit = false;
        private InitParams envParams = null;
        private static BI _instance = null;


        public static BI Instance()
        {
            if (_instance == null)
            {
                _instance = new BI();
            }
            return _instance;
        }

        public void init(InitParams param)
        {
            isInit = true;
            envParams = param;
        }

        private bool checkEnv()
        {
            if (!isInit)
            {
                if (envParams.log)
                {
                    Debug.Log("not call init yet!!");
                }
            }
            return isInit;
        }

        public void action(string actionName)
        {
            ActionParams param = new ActionParams();
            param.action = actionName;
            action(param);
        }
        public void action(ActionParams param)
        {
            if (checkEnv())
            {
                request(new RequestParam(initRequestParam("action", param)));
            }
        }

        public void battle(BattleParams param)
        {
            if (checkEnv())
            {
                request(new RequestParam(initRequestParam("battle", param)));
            }
        }
        public void adVideo(AdVideoParams param)
        {
            if(checkEnv())
            {
                request(new RequestParam(initRequestParam("adVideo", param)));
            }
        }
        public void appOnce(AppOnceParams param)
        {
            if (checkEnv())
            {
                request(new RequestParam(initRequestParam("appOnce", param)));
            }
        }
        public void appOnce(string actionName)
        {
            AppOnceParams param = new AppOnceParams();
            param.action = actionName;
            appOnce(param);
        }
        private RequestData initRequestParam(string act, BaseParams data)  {
            RequestData reqParam = new RequestData(envParams, data);
            reqParam.act = act;
            reqParam.act_time = System.DateTime.Now;
            reqParam.trap = data.action;
            return reqParam;
        }

        private void request(RequestParam param)
        {
            if (param.retryCnt-- > 0)
            {
                int timeout = (param.retryCnt >= 10 ? 100 : 1000);

            }
            postData(param.requestData);
        }

        private void postData(RequestData data)
        {
            Dictionary<string, string> formFields = new Dictionary<string, string>();
            formFields["game"] = data.game;
            formFields["channel"] = data.channel;
            formFields["trap"] = data.trap;
            formFields["act"] = data.act;
            formFields["act_time"] = data.act_time.ToString();
            formFields["data"] = data.data.ToString();

            UnityWebRequest webRequest = UnityWebRequest.Post("http://bi.touchmagic.cn", formFields);
            webRequest.SendWebRequest();
            if (webRequest.isHttpError || webRequest.isNetworkError)
                Debug.Log(webRequest.error);
            else
            {
                Debug.Log(webRequest.downloadHandler.text);
            }
        }
    }
}