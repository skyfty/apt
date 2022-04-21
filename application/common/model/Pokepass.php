<?php

namespace app\common\model;

use think\Model;

class Pokepass extends Cosmetic
{
    protected $name = 'pokepass';
    public $keywordsFields = ["name", "idcode"];

    protected static function init()
    {
        $beforeupdate = function($row){

        };
        self::beforeInsert($beforeupdate);self::beforeUpdate($beforeupdate);
    }

}
