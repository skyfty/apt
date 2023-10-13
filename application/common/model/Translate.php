<?php

namespace app\common\model;

use app\common\model\Cosmetic;
use think\Model;

class Translate extends Cosmetic
{
    protected $name = 'translate';
    public $keywordsFields = ["name", "idcode"];

    protected static function init()
    {
        $beforeupdate = function($row){

        };
        self::beforeInsert($beforeupdate);self::beforeUpdate($beforeupdate);
    }

    public function internationalization() {
        return $this->hasOne('internationalization','id','internationalization_model_id')->joinType("LEFT")->setEagerlyType(0);
    }
}
