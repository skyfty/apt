<?php

namespace app\bi\model;

use think\Model;

class Cause extends  \app\common\model\Cause
{
    protected static function init()
    {
        self::beforeInsert(function($row){
            $row['creator_model_id'] =  1;
        });
        parent::init();

        self::beforeInsert(function($row){
            $maxid = self::max("id") + 1;
            $row['idcode'] = sprintf("CA%06d", $maxid);
        });
    }

}
