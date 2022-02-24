<?php

namespace app\common\model;

use think\Model;

class Poke extends Cosmetic
{
    protected $name = 'poke';
    public $keywordsFields = ["name", "idcode"];

    protected static function init()
    {
        $beforeupdate = function($row){

        };
        self::beforeInsert($beforeupdate);self::beforeUpdate($beforeupdate);
    }

}
