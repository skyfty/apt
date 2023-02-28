<?php

namespace app\common\model;

use think\Model;

class Cause extends Cosmetic
{
    protected $name = 'cause';
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

    public function customer() {
        return $this->hasOne('customer','id','customer_model_id')->joinType("LEFT")->setEagerlyType(0);
    }
    public function promotion() {
        return $this->hasOne('promotion','id','promotion_model_id')->joinType("LEFT")->setEagerlyType(0);
    }
    public function channel() {
        return $this->hasOne('channel','id','channel_model_id')->joinType("LEFT")->setEagerlyType(0);
    }
    public function trap() {
        return $this->hasOne('trap','id','trap_model_id')->joinType("LEFT")->setEagerlyType(0);
    }
}
