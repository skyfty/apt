<?php

namespace app\common\model;

use think\Model;

class Storehouse extends Cosmetic
{
    protected $name = 'storehouse';
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
        self::afterInsert(function($row){
            $estate = model($row['estate_type'])->create(['storehouse_model_id'=>$row['id']]);
            $row['estate_id'] = $estate['id'];
            $row->save();
        });
        self::afterDelete(function($row){
            model($row['estate_type'])->where(['storehouse_model_id'=>$row['id']])->delete();
        });


    }
    public function promotion() {
        return $this->hasOne('promotion','id','promotion_model_id')->joinType("LEFT")->setEagerlyType(0);
    }
    public function estate()
    {
        return $this->morphTo();
    }

    public function picture() {
        return $this->hasOne('picture','id','estate_id')->joinType("LEFT")->setEagerlyType(0);
    }

    public function shape() {
        return $this->hasOne('shape','id','estate_id')->joinType("LEFT")->setEagerlyType(0);
    }

    public function music() {
        return $this->hasOne('music','id','estate_id')->joinType("LEFT")->setEagerlyType(0);
    }
}
