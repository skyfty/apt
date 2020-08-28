<?php

namespace app\admin\controller;


/**
 * 统计项目
 *
 * @icon fa fa-circle-o
 */
class Trap extends Cosmetic
{

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Trap;
    }

    protected function spectacle($model) {
        return $model;
    }


}
