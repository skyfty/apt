<?php

namespace app\common\model;

use think\Model;

class Klondike extends Cosmetic
{
    protected $name = 'klondike';
    public $keywordsFields = ["name", "idcode"];

    protected static function init()
    {
        $beforeupdate = function($row){

        };
        self::beforeInsert($beforeupdate);self::beforeUpdate($beforeupdate);
    }

}
