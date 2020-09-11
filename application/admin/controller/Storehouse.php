<?php

namespace app\admin\controller;

use app\common\controller\Backend;

/**
 * 数据资源
 *
 * @icon fa fa-circle-o
 */
class Storehouse extends Cosmetic
{

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Storehouse;
    }


    protected function spectacle($model) {
        return $model;
    }

}
