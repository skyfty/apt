<?php

namespace app\bi\model;

use think\Model;
use traits\model\SoftDelete;
use app\admin\library\Auth;

class Verify extends  \app\common\model\Verify
{
    protected static function init()
    {
        parent::init();
    }
}
