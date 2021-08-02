<?php

namespace app\common\model;

use think\Model;

class Normalmodel extends Cosmetic
{
    protected $name = 'normalmodel';
    public $keywordsFields = ["name", "idcode"];


    public function promotion() {
        return $this->hasOne('promotion','id','promotion_model_id')->joinType("LEFT")->setEagerlyType(0);
    }

    public function storehouse()
    {
        return $this->morphOne('Storehouse', 'estate');
    }
}
