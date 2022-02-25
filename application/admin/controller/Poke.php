<?php

namespace app\admin\controller;

use app\common\controller\Backend;

/**
 * 纸牌关卡
 *
 * @icon fa fa-circle-o
 */
class Poke extends Cosmetic
{
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Poke;
    }


    protected function spectacle($model) {
        return $model;
    }


}
