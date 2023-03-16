<?php

namespace app\oss\model;

use app\common\model\Cosmetic;
use think\Model;
use traits\model\SoftDelete;

class Klondike extends   \app\common\model\Cosmetic
{
    protected $name = 'klondike';
    public $keywordsFields = ["name", "idcode"];

    protected static function init()
    {

    }
    public function formatLevel() {
        return  [
            'game'=>json_decode($this['game'], true),
            'moves'=>$this['moves']
        ];
    }

}
