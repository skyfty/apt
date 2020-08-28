<?php

namespace app\admin\controller;

/**
 * 发行渠道
 *
 * @icon fa fa-circle-o
 */
class Compilation extends Cosmetic
{
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Compilation;

    }


    protected function spectacle($model) {
        return $model;
    }


}
