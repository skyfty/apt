<?php

namespace app\api\model;

use think\Model;
use traits\model\SoftDelete;
use app\admin\library\Auth;

class Promotion extends  \app\common\model\Promotion
{
    protected static function init()
    {
        parent::init();
    }

}
