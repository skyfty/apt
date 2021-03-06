<?php

namespace app\common\model;


class Article extends Cosmetic
{
    // 表名
    protected $name = 'article';
    public $keywordsFields = ["name", "idcode"];


    protected static function init()
    {
        parent::init();

        self::beforeInsert(function($row){
            $maxid = self::max("id") + 1;
            $row['idcode'] = sprintf("BL%06d", $maxid);
        });
    }

    public function chapters() {
        return $this->hasOne('chapters','id','chapters_model_id')->joinType("LEFT")->setEagerlyType(0);
    }
}
