<?php

namespace app\admin\controller;

use app\common\controller\Backend;

/**
 * 行为统计
 *
 * @icon fa fa-circle-o
 */
class Causeip extends Cosmetic
{
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Cause;
    }

    protected function spectacle($model) {

        return $model;
    }
}
