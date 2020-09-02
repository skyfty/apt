"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BI = void 0;
const flyio_1 = __importDefault(require("flyio"));
class BI {
    static init(params) {
        BI.isInit = true;
        BI.envParams = params;
    }
    static appOnce(param) {
        if (!BI.isInit) {
            if (BI.envParams.log) {
                console.error("not call init yet!!");
            }
            return;
        }
        let reqParam = BI.initRequestParam("appOnce", param);
        BI.request({ retryCnt: 10, params: reqParam }, BI.defCallback);
    }
    static adVideo(param) {
        if (!BI.isInit) {
            if (BI.envParams.log) {
                console.error("not call init yet!!");
            }
            return;
        }
        let reqParam = BI.initRequestParam("adVideo", param);
        BI.request({ retryCnt: 10, params: reqParam }, BI.defCallback);
    }
    static battle(param) {
        if (!BI.isInit) {
            if (BI.envParams.log) {
                console.error("not call init yet!!");
            }
            return;
        }
        let reqParam = BI.initRequestParam("battle", param);
        BI.request({ retryCnt: 10, params: reqParam }, BI.defCallback);
    }
    static initRequestParam(act, data) {
        let reqParam = {
            "act": act,
            "gameId": BI.envParams.gameId,
            "data": data,
        };
        return reqParam;
    }
    static defCallback(res) {
        if (BI.envParams.log) {
            console.log(res);
        }
    }
    static request(req, cb) {
        if (req.retryCnt-- > 0) {
            let timeout = (req.retryCnt >= 10 ? 100 : 1000);
            setTimeout(() => {
                BI.postData(req, cb, () => {
                    BI.request(req, cb);
                });
            }, timeout);
        }
    }
    static postData(req, cb, errcb) {
        const requrl = "http://bi.touchmagic.cn";
        if (typeof wx == "undefined") {
            flyio_1.default.get(requrl, req.params).then(function (response) {
                if (cb) {
                    cb(response);
                }
            }).catch(function (error) {
                errcb();
            });
            ;
        }
        else {
            wx.request({
                url: requrl,
                data: req.params,
                method: 'GET',
                success: function (res) {
                    if (cb) {
                        cb(res);
                    }
                },
                fail: errcb,
            });
        }
    }
}
exports.BI = BI;
BI.isInit = false;
//# sourceMappingURL=cloud.js.map