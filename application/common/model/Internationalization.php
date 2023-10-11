<?php

namespace app\common\model;

use app\common\model\Cosmetic;
use think\Model;

class Internationalization extends Cosmetic
{
    protected $name = 'internationalization';
    public $keywordsFields = ["name", "idcode"];

    protected static function init()
    {
        $beforeupdate = function($row){

        };
        self::beforeInsert($beforeupdate);self::beforeUpdate($beforeupdate);
    }

    public function promotion() {
        return $this->hasOne('promotion','id','promotion_model_id')->joinType("LEFT")->setEagerlyType(0);
    }

}
