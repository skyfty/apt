<?php

namespace app\admin\controller;

use app\common\controller\Backend;

/**
 * 游戏类型
 *
 * @icon fa fa-circle-o
 */
class Genre extends Cosmetic
{
    
    /**
     * Genre模型对象
     * @var \app\admin\model\Genre
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Genre;
    }



    protected function spectacle($model) {
        return $model;
    }
}
