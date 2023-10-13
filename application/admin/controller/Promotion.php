<?php

namespace app\admin\controller;

use app\common\model\Fields;

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
        $ids =$this->request->param("ids", null);
        if ($ids === null)
            $this->error(__('Params error!'));
        $promotion = $this->model->get($ids);
//        $tranlsateList = [];
//        foreach($promotion->internationalization as $v) {
//            $tranlsateList[$v['name']]=$v['translation'];
//        }
//        $tranlsateLanguageList = array_keys($tranlsateList);

        $apiKey = '20230816001782539';
        $apiSecret = 'o62WRa4ThGYCNntmaqT9';

        $destFileDir = 'uploads/'. date('Ymd') . DS.$promotion->idcode.DS;
        $uploadDir = ROOT_PATH ."/public/" .$destFileDir;
        if (file_exists($uploadDir))
            rmdirs($uploadDir);
        mkdir($uploadDir, 0777, true);

        $field = Fields::get("2519")->content_list;
        $targetLanguages = array_keys($field);

        $client = new \GuzzleHttp\Client();
        $tranlsateList = [];
        foreach ($targetLanguages as $targetLanguage) { // 遍历目标语言数组
            $tranlsateList[$targetLanguage] = [];
            foreach($promotion->internationalization as $v) {
                $translate = model("translate")->where("internationalization_model_id", $v['id'])->where("lang", $targetLanguage)->find();
                if ($translate == null ) {
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
                    $res = $client->request('GET', $url);
                    if ($res->getStatusCode() == "200") {
                        $resultJson = json_decode($res->getBody()->getContents(), true);
                        $tranlsateList[$targetLanguage][$v['name']] = isset($resultJson['trans_result'][0]['dst']) ? $resultJson['trans_result'][0]['dst'] : $v['name'];
                    }
                } else {
                    $tranlsateList[$targetLanguage][$v['name']]=$translate['name'];
                }
            }
        }

        $internals = [];
        foreach ($tranlsateList as $key=>$tranlsate) { // 遍历目标语言数组
            $fileName = \fast\Random::build("unique") . ".png";
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
