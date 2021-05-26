<?php

namespace app\admin\controller;

use app\common\controller\Backend;
use think\Log;

/**
 * 资源管理
 *
 * @icon fa fa-circle-o
 */
class Dossier extends Cosmetic
{
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Dossier;
    }

    protected function spectacle($model) {
        return $model;
    }

}
