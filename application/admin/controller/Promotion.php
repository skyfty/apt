<?php

namespace app\admin\controller;

use app\common\model\Fields;
use app\common\model\Statistics;
use GuzzleHttp\Promise;
use think\Db;

/**
 * 游戏产品
 *
 * @icon fa fa-circle-o
 */
class Promotion extends Cosmetic
{
    protected $noNeedLogin = ['translate','translate2'];

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
        $cmd = 'nohup /www/wdlinux/phps/71/bin/php ' . ROOT_PATH . 'public/index.php ' . "admin/promotion/translate2/ids/" .$ids;
        exec($cmd, $array);

        $this->success("翻译成功");
    }

    public function translate2() {
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

        $tranlsateList = [];

        foreach ($targetLanguages as $targetLanguage) { // 遍历目标语言数组
            $promises = [];
            $promiseNamess = [];
            $promiseIds = [];
            $tranlsateIds = [];
            $client = new \GuzzleHttp\Client();

            $tranlsateList[$targetLanguage] = [];
            foreach($promotion->internationalization as $v) {
                $translate = model("translate")->where("internationalization_model_id", $v['id'])->where("lang", $targetLanguage)->find();
                if ($translate == null ||  $translate['name'] == "") {
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
//                    $res = $client->get($url);
                    $res = $client->request('GET', $url);

                    if ($res->getStatusCode() == "200") {
                        $content = $res->getBody()->getContents();
                        \think\Log::info($res->getBody()->getContents());
                        $resultJson = json_decode($content, true);
                        $name = isset($resultJson['trans_result'][0]['dst']) ? $resultJson['trans_result'][0]['dst'] : "";

                        $tranlsateList[$targetLanguage][$v['name']] =$name;
                        if ($translate == null) {
                            $translate = new \app\admin\model\Translate;
                        }
                        $translate->internationalization_model_id = $v['id'];
                        $translate->lang =$targetLanguage;
                        $translate->name =$name;
                        $translate->save();
                    }
//
//
//
//                    $promiseNamess[] = $v['name'];
//                    $promiseIds[] = $v['id'];
//                    if ($translate['name'] == "") {
//                        $tranlsateIds[$v['id']] = $translate['id'];
//                    }
                } else {
                    $tranlsateList[$targetLanguage][$v['name']]=$translate['name'];
                }
            }

//            if (count($promises) != 0) {
//                $responses = \GuzzleHttp\Promise\unwrap($promises);
//                foreach ($responses as $k=>$res) {
//                    if ($res->getStatusCode() == "200") {
//                        $resultJson = json_decode($res->getBody()->getContents(), true);
//                        $name = isset($resultJson['trans_result'][0]['dst']) ? $resultJson['trans_result'][0]['dst'] : "";
//                        $tranlsateList[$targetLanguage][$promiseNamess[$k]] =$name;
//                        if (isset($tranlsateIds[$promiseIds[$k]])) {
//                            $translate = \app\admin\model\Translate::get($tranlsateIds[$promiseIds[$k]]);
//                        } else {
//                            $translate = new \app\admin\model\Translate;
//                        }
//                        $translate->internationalization_model_id = $promiseIds[$k];
//                        $translate->lang =$targetLanguage;
//                        $translate->name =$name;
//                        $translate->save();
//                    }
//                }
//            }
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


    public function graph() {
        $data=[];
        $id = $this->request->param("id");
        if (!$id) {
            $this->error("error");
        }
        $promotion = model("promotion")->get($id);
        if (!$promotion || $promotion['user_model_name'] === "") {
            $this->error("error");
        }

        $type = $this->request->param("type", "increased");
        $scope = $this->request->get("scope", '');
        if (!$scope) {
            $this->error("error");
        }
        $scope = explode(" - ", $scope);
        $scope[0] = strtotime($scope[0]);$scope[1] = strtotime($scope[1]);

        $xAxis = [
            "type"=>"category",
            "boundaryGap"=>false,
        ];
        for($stepscope = $scope[0];$stepscope<=$scope[1];) {
            $stepend = strtotime('+1 day',$stepscope);
            $xAxis['data'][] = date('m-d',$stepscope);
            $stepscope = $stepend;
        }
        $data['xAxis'][] = $xAxis;

        $ludomodelUsers =  model($promotion['user_model_name']);
        $legend = [];
        $cheque = [['name'=>'新增']];
        switch ($type) {
            case "increased": {
                $cheque = [['name'=>'玩家新增']];

                break;
            }
            case "active": {
                $cheque = [['name'=>'活跃玩家']];

                break;
            }
            case "keep": {
                $cheque = [['name'=>'新增玩家次日留存率']];

                break;
            }
            case "duration": {
                $cheque = [['name'=>'平均单次使用时长']];

                break;
            }
        }

        foreach($cheque as $ck=>$cv) {
            $legend[] = $cv['name'];
            $series=[
                "type"=>'line',
                "name"=>$cv['name'],
                "data"=>[],
            ];
            for($stepscope = $scope[0]; $stepscope<=$scope[1];) {
                $stepend = strtotime('+1 day',$stepscope);
                switch ($type) {
                    case "increased": {
                        $ludomodelUsers->where("createtime", "BETWEEN", [$stepscope, $stepend]);
                        $series['data'][] = $ludomodelUsers->count();
                        break;
                    }
                    case "active": {
                        $ludomodelUsers->where("logintime", "BETWEEN", [$stepscope, $stepend]);
                        $series['data'][] = $ludomodelUsers->count();
                        break;
                    }
                    case "startover": {
                        $ludomodelUsers->where("logintime", "BETWEEN", [$stepscope, $stepend]);
                        $series['data'][] = $ludomodelUsers->count();
                        break;
                    }
                    case "keep": {
                        $result = $ludomodelUsers->query("                              
                            SELECT 
                              DATE(FROM_UNIXTIME(createtime)) AS registration_date,
                              COUNT(
                                DISTINCT IF(
                                  DATE(FROM_UNIXTIME(logintime)) = DATE_ADD(
                                    DATE(FROM_UNIXTIME(createtime)),
                                    INTERVAL 1 DAY
                                  ),
                                  id,
                                  NULL
                                )
                              ) / COUNT(DISTINCT id) AS next_day_retention_rate 
                            FROM
                              users 
                            WHERE DATE(FROM_UNIXTIME(createtime)) BETWEEN :t1 AND :t2
                            GROUP BY registration_date
                            ", ['t1'=>date('Y-m-d', $stepscope),'t2'=>date('Y-m-d', $stepend)]);
                        $series['data'][] = (count($result) ==1 && $result[0]['next_day_retention_rate'] != null?$result[0]['next_day_retention_rate']:0);
                        break;
                    }
                    case "duration": {
                        $result = $ludomodelUsers->query("                              
                           SELECT 
                                AVG(logintime - prevtime) AS avg_usage_duration
                            FROM 
                                users
                            WHERE 
                                createtime BETWEEN  :t1 AND :t2 AND prevtime!=0
                            AND prevtime IS NOT NULL AND logintime IS NOT NULL;
                            ", ['t1'=>$stepscope,'t2'=>$stepend]);
                        $series['data'][] = (count($result) ==1 && $result[0]['avg_usage_duration'] != null?$result[0]['avg_usage_duration']:0);
                        break;
                    }
                }
                $stepscope = $stepend;
            }
            $data['series'][] = $series;
        }
        $data['legend']['data'] = $legend;

        $this->result($data,1);
    }


    public function statistic() {
        $id = $this->request->param("id");
        if (!$id) {
            $this->error("error");
        }
        $promotion = model("promotion")->get($id);
        if (!$promotion || $promotion['user_model_name'] === "") {
            $this->error("error");
        }
        $ludomodelUsers =  model($promotion['user_model_name']);
        $result = $ludomodelUsers->query("                              
                          SELECT FLOOR(AVG(new_users)) AS avg_new_users_last_7_days
                            FROM (
                                SELECT COUNT(id) AS new_users
                                FROM users
                                WHERE DATEDIFF(FROM_UNIXTIME(createtime), CURDATE()) <= 7
                                GROUP BY DATE(FROM_UNIXTIME(createtime))
                            ) AS user_counts;
                            ");
        $stat['avg_new_users_last_7_days'] = (count($result) ==1 && $result[0]['avg_new_users_last_7_days'] != null?$result[0]['avg_new_users_last_7_days']:0);

        $result = $ludomodelUsers->query("                              
                          SELECT FLOOR(AVG(new_users)) AS avg_active_users_last_7_days
                            FROM (
                                SELECT COUNT(id) AS new_users
                                FROM users
                                WHERE DATEDIFF(FROM_UNIXTIME(logintime), CURDATE()) <= 7
                                GROUP BY DATE(FROM_UNIXTIME(logintime))
                            ) AS user_counts;
                            ");
        $stat['avg_active_users_last_7_days'] = (count($result) ==1 && $result[0]['avg_active_users_last_7_days'] != null?$result[0]['avg_active_users_last_7_days']:0);

        $result = $ludomodelUsers->query(" SELECT COUNT(id) AS users_cnt FROM users");
        $stat['users_cnt'] = (count($result) ==1 && $result[0]['users_cnt'] != null?$result[0]['users_cnt']:0);

        $result = $ludomodelUsers->query("                              
                          SELECT FLOOR(AVG(total_usage_time)) AS avg_usage_time_last_7_days
                            FROM (
                                SELECT SUM(logintime - prevtime) AS total_usage_time
                                FROM users
                                WHERE DATEDIFF(FROM_UNIXTIME(logintime), CURDATE()) <= 7 AND prevtime!=0
                                GROUP BY id
                            ) AS user_usage_time;
                            ");
        $stat['avg_usage_time_last_7_days'] = (count($result) ==1 && $result[0]['avg_usage_time_last_7_days'] != null?$result[0]['avg_usage_time_last_7_days']:0);


        $this->result($stat, 1);
    }


    /**
     * 添加
     */
    public function chart() {



        return $this->view->fetch();
    }
}
