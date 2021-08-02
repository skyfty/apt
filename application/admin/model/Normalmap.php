<?php

namespace app\admin\model;

use think\Model;
use traits\model\SoftDelete;
use app\admin\library\Auth;

class Normalmap extends  \app\common\model\Normalmap
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
            $row['idcode'] = sprintf("CO%06d", $maxid);
        });
    }

}

