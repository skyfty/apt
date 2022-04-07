<?php

namespace app\common\model;

use app\admin\library\Auth;
use think\Model;

class Pokereword extends Cosmetic
{
    protected $name = 'pokereword';
    public $keywordsFields = ["name", "idcode"];

    protected static function init()
    {

        parent::init();

        self::beforeInsert(function($row){
            $maxid = self::max("id") + 1;
            $row['idcode'] = sprintf("PO%06d", $maxid);
        });
    }

}
