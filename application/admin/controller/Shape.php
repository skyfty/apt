<?php

namespace app\admin\controller;

use app\common\controller\Backend;

/**
 * 模型资源
 *
 * @icon fa fa-circle-o
 */
class Shape extends Cosmetic
{
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Shape;
    }


    protected function spectacle($model) {
        return $model;
    }

    

}
