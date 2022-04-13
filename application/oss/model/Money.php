<?php

namespace app\oss\model;

use app\admin\library\Auth;
use app\common\model\Oss;
use think\Model;

class Money extends Pokereword
{
    protected static function init()
    {
        parent::init();

        $update = function($row){
            $total = Pokereword::where(["user_id"=>$row['user_id'], "type"=>"money"])->sum("amount*ino");
            $oss = Oss::get($row['user_id']);
            if ($oss) {
                $data['user_id'] = $row['user_id'];
                $data['money'] = $total;
                $oss->save($data);
            }
        };
        self::afterDelete($update);self::afterInsert($update);
    }
}