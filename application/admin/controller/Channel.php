<?php

namespace app\admin\controller;

/**
 * 运营渠道
 *
 * @icon fa fa-circle-o
 */
class Channel extends Cosmetic
{

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Channel;
    }



    protected function spectacle($model) {
          return $model;
    }
}
