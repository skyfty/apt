<?php

namespace app\common\model;

use think\Model;

class Pokereword extends Cosmetic
{
    protected $name = 'pokereword';
    public $keywordsFields = ["name", "idcode"];

    protected static function init()
    {
        $beforeupdate = function($row){

        };
        self::beforeInsert($beforeupdate);self::beforeUpdate($beforeupdate);
    }

}
