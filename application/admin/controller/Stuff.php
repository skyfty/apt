<?php

namespace app\admin\controller;

use app\common\controller\Backend;

/**
 * 基础资源
 *
 * @icon fa fa-circle-o
 */
class Stuff extends Cosmetic
{

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Stuff;
    }


    protected function spectacle($model) {
        return $model;
    }


}
