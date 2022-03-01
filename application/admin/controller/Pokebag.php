<?php

namespace app\admin\controller;

use app\common\controller\Backend;

/**
 * 关卡包
 *
 * @icon fa fa-circle-o
 */
class Pokebag extends Cosmetic
{
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Pokebag;
    }


    protected function spectacle($model) {
        return $model;
    }


}
