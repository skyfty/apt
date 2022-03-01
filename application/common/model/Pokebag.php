<?php

namespace app\common\model;

use think\Model;

class Pokebag extends Cosmetic
{
    protected $name = 'pokebag';
    public $keywordsFields = ["name", "idcode"];

    protected static function init()
    {
        $beforeupdate = function($row){

        };
        self::beforeInsert($beforeupdate);self::beforeUpdate($beforeupdate);
    }

}
