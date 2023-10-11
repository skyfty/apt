<?php

namespace app\common\model;

use think\Model;
use traits\model\SoftDelete;
use app\admin\library\Auth;

class Promotion extends Cosmetic
{
    protected $name = 'promotion';
    public $keywordsFields = ["name", "idcode"];

    protected static function init()
    {
    }
    public function genre() {
        return $this->hasOne('genre','id','genre_model_id')->joinType("LEFT")->setEagerlyType(0);
    }

    public function internationalization() {
        return $this->hasMany('internationalization', "promotion_model_id");
    }

}