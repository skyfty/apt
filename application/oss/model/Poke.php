<?php

namespace app\oss\model;

use app\admin\library\Auth;
use think\Model;
use traits\model\SoftDelete;

class Poke extends   \app\common\model\Poke
{
    protected static function init()
    {

    }
    public function formatLevel() {
        return  [
            'composition'=>json_decode($this['composition'], true),
            'params'=>json_decode($this['params'], true),
            'stage'=>json_decode($this['stage'], true),
            'underpan'=>json_decode($this['underpan'], true),
        ];
    }

}
