<?php

namespace app\poke\model;

use app\admin\library\Auth;
use think\Model;
use traits\model\SoftDelete;

class Klondike extends   \app\common\model\Klondike
{
    protected static function init()
    {
        self::beforeInsert(function($row){
            $auth = Auth::instance();
            $row['creator_model_id'] =$row['owners_model_id'] = $auth->isLogin() ? $auth->id : 1;
        });
        parent::init();

        self::beforeInsert(function($row){
            $maxid = self::max("id") + 1;
            $row['idcode'] = sprintf("PO%06d", $maxid);
        });
    }

}
