<?php

namespace app\admin\model;

use think\Model;
use traits\model\SoftDelete;
use app\admin\library\Auth;

class Promotion extends  \app\common\model\Promotion
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
            $row['idcode'] = sprintf("PR%06d", $maxid);
        });

        self::afterInsert(function($row){
            $data = [];
            foreach(model("channel")->select() as $channel) {
                $data[] = [
                    "channel_model_id"=>$channel['id'],
                    "promotion_model_id"=>$row['id'],
                ];
            }
            model("Compilation")->saveAll($data);
        });
        self::afterDelete(function($row){
            model("Compilation")->where("promotion_model_id", $row['id'])->delete();
        });
    }

}
