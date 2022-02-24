<?php

namespace app\poke\model;

use app\admin\library\Auth;
use think\Model;
use traits\model\SoftDelete;

class Poke extends   \app\common\model\Poke
{
    protected static function init()
    {
        self::beforeInsert(function($row){
            $row['creator_model_id'] =  1;
        });
        parent::init();

        self::beforeInsert(function($row){
            $maxid = self::max("id") + 1;
            $row['idcode'] = sprintf("PO%06d", $maxid);
        });
    }

}
