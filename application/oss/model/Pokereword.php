<?php

namespace app\oss\model;

use app\admin\library\Auth;
use app\common\model\Oss;
use think\Model;

class Pokereword extends   \app\common\model\Pokereword
{
    protected static function init()
    {
        self::beforeInsert(function($row){
            $auth = Auth::instance();
            $row['creator_model_id'] =$row['owners_model_id'] = $auth->isLogin() ? $auth->id : 1;
        });
        parent::init();
    }
}
