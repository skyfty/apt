<?php

namespace app\common\model;

use think\Model;
use traits\model\SoftDelete;
use app\admin\library\Auth;

class Genre extends  Cosmetic
{
    protected $name = 'genre';
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

}