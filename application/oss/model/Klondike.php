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
        $json = json_decode($this['game'], true);
        $json['piles'] = $json['tableau piles'];
        unset($json['tableau piles']);
        $piles = [];
        foreach ($json['piles'] as $k=>$v) {
            array_push($piles, ["cards"=>$v]);
        }
        $json['piles'] = $piles;

        return  [
            'composition'=>$json,
            'moves'=>$this['moves']
        ];
    }

}
