<?php

namespace app\admin\controller;

use app\common\controller\Backend;

/**
 * 纸牌奖励
 *
 * @icon fa fa-circle-o
 */
class Pokereword extends Cosmetic
{
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Pokereword;
    }


    protected function spectacle($model) {
        return $model;
    }


}
