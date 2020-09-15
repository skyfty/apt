<?php

namespace app\admin\controller;

use app\common\controller\Backend;

/**
 * 音乐资源
 *
 * @icon fa fa-music
 */
class Music extends Cosmetic
{
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Music;
    }


    protected function spectacle($model) {
        return $model;
    }

}
