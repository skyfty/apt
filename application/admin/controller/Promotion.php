<?php

namespace app\admin\controller;

use app\common\model\Fields;
use GuzzleHttp\Promise;

/**
 * 游戏产品
 *
 * @icon fa fa-circle-o
 */
class Promotion extends Cosmetic
{
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Promotion;
    }


    protected function spectacle($model) {
        return $model;
    }

    /**
     * 生成签名
     */
    function generateSign($text, $salt, $apiKey, $apiSecret) {
        $str = $apiKey . $text . $salt . $apiSecret;
        $sign = md5($str);
        return $sign;
    }

    public function translate() {
        set_time_limit(0);

        $ids =$this->request->param("ids", null);
        if ($ids === null)
            $this->error(__('Params error!'));
        $promotion = $this->model->get($ids);

        $apiKey = '20230816001782539';
        $apiSecret = 'o62WRa4ThGYCNntmaqT9';

        $destFileDir = 'uploads/translates/' . DS.$promotion->id . DS;
        $uploadDir = ROOT_PATH ."/public/" .$destFileDir;
        if (file_exists($uploadDir))
            rmdirs($uploadDir);
        mkdir($uploadDir, 0777, true);

        $field = Fields::get("2519")->content_list;
        $targetLanguages = array_keys($field);

        $client = new \GuzzleHttp\Client();
        $tranlsateList = [];

        foreach ($targetLanguages as $targetLanguage) { // 遍历目标语言数组
            $promises = [];
            $promiseNamess = [];
            $promiseIds = [];

            $tranlsateList[$targetLanguage] = [];
            foreach($promotion->internationalization as $v) {
                $translate = model("translate")->where("internationalization_model_id", $v['id'])->where("lang", $targetLanguage)->find();
                if ($translate == null &&  $translate['name'] == "") {
                    $salt = time();
                    $sign = $this->generateSign($v['name'], $salt, $apiKey, $apiSecret);
                    $params = [
                        'q' => $v['name'],
                        'from' => 'auto',
                        'to' => $targetLanguage,
                        'appid' => $apiKey,
                        'salt' => $salt,
                        'sign' => $sign
                    ];
                    $url = 'http://api.fanyi.baidu.com/api/trans/vip/translate?'.http_build_query($params);
                    $promises[] = $client->getAsync($url);
                    $promiseNamess[] = $v['name'];
                    $promiseIds[] = $v['id'];
                } else {
                    $tranlsateList[$targetLanguage][$v['name']]=$translate['name'];
                }
            }

            if (count($promises) != 0) {
                $responses = \GuzzleHttp\Promise\unwrap($promises);
                foreach ($responses as $k=>$res) {
                    if ($res->getStatusCode() == "200") {
                        $resultJson = json_decode($res->getBody()->getContents(), true);
                        $name = isset($resultJson['trans_result'][0]['dst']) ? $resultJson['trans_result'][0]['dst'] : $promiseNamess[$k];
                        $tranlsateList[$targetLanguage][$promiseNamess[$k]] =$name;
                        $translate = new \app\admin\model\Translate;
                        $translate->internationalization_model_id = $promiseIds[$k];
                        $translate->lang =$targetLanguage;
                        $translate->name =$name;
                        $translate->save();
                    }
                }
            }
        }

        $internals = [];
        foreach ($tranlsateList as $key=>$tranlsate) { // 遍历目标语言数组
            $fileName = $key . ".png";
            $internals[$key] = $destFileDir . $fileName;
            $jsi18njson = [
                "values" =>$tranlsate
            ];
            file_put_contents($uploadDir . $fileName, json_encode($jsi18njson, JSON_UNESCAPED_UNICODE));
        }

        $promotion->tranlsates = json_encode($internals, JSON_UNESCAPED_UNICODE);
        $promotion->save();

        $this->success("翻译成功");
    }
}
