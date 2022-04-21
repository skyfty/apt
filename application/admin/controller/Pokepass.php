<?php

namespace app\admin\controller;

use app\common\controller\Backend;

/**
 * 纸牌过关
 *
 * @icon fa fa-circle-o
 */
class Pokepass extends Cosmetic
{
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Pokepass;
    }


    protected function spectacle($model) {
        return $model;
    }


}
