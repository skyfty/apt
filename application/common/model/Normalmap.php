<?php

namespace app\common\model;

use think\Model;

class Normalmap extends Cosmetic
{
    protected $name = 'normalmap';
    public $keywordsFields = ["name", "idcode"];

    protected static function init()
    {
        $beforeupdate = function($row){
            if (isset($row['name'])) {
                try {
                    $row['slug'] = \fast\Pinyin::get($row['name']);
                } catch(\Exception $e) {
                }
            }
        };
        self::beforeInsert($beforeupdate);self::beforeUpdate($beforeupdate);
    }
    public function promotion() {
        return $this->hasOne('promotion','id','promotion_model_id')->joinType("LEFT")->setEagerlyType(0);
    }

    public function storehouse()
    {
        return $this->morphOne('Storehouse', 'estate');
    }
}
