<?php

namespace app\admin\model;

use think\Model;
use traits\model\SoftDelete;
use app\admin\library\Auth;

class Dossier extends  \app\common\model\Dossier
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
            $row['idcode'] = sprintf("ST%06d", $maxid);
        });
    }

}
