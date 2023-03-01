<?php

namespace app\admin\controller;

use app\common\controller\Backend;

/**
 * 图片资源
 *
 * @icon fa fa-circle-o
 */
class Statistic extends Cosmetic
{
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Picture;
    }


    protected function spectacle($model) {
        return $model;
    }


}
