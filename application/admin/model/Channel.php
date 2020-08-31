<?php

namespace app\admin\model;

use think\Model;
use app\admin\library\Auth;

class Channel extends \app\common\model\Channel
{

    protected static function init()
    {
        self::beforeInsert(function($row){
            $auth = Auth::instance();
            $row['creator_model_id'] = $auth->isLogin() ? $auth->id : 1;
        });
        parent::init();

        self::beforeInsert(function($row){
            $maxid = self::max("id") + 1;
            $row['idcode'] = sprintf("CH%06d", $maxid);
        });

        self::afterInsert(function($row){
            $data = [];
            foreach(model("promotion")->select() as $promotion) {
                $data[] = [
                    "channel_model_id"=>$row['id'],
                    "promotion_model_id"=>$promotion['id'],
                ];
            }
            model("Compilation")->saveAll($data);
        });
        self::afterDelete(function($row){
            model("Compilation")->where("channel_model_id", $row['id'])->delete();
        });
    }

}
