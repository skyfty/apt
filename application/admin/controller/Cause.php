<?php

namespace app\admin\controller;

use app\common\controller\Backend;

/**
 * 行为统计
 *
 * @icon fa fa-circle-o
 */
class Cause extends Cosmetic
{
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Cause;
    }

    public function ips() {
        return json(array("total" => $total, "rows" => collection($list)->toArray()));

    }

    protected function spectacle($model) {
        return $model;
    }
}
