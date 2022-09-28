<?php

namespace app\admin\controller;

use app\common\controller\Backend;

/**
 * 行为统计
 *
 * @icon fa fa-circle-o
 */
class Verify extends Cosmetic
{
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Verify;
    }

    protected function spectacle($model) {

        return $model;
    }
}
