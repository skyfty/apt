<?php

namespace app\admin\controller;

use app\common\controller\Backend;
use think\Log;

/**
 * 资源管理
 *
 * @icon fa fa-circle-o
 */
class Wealth extends Cosmetic
{
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Wealth;
    }

    protected function spectacle($model) {
        return $model;
    }


    public function convert($ids) {
        $ids = $ids ? $ids : $this->request->param("ids");
        if ($ids === null)
            $this->error(__('Params error!'));
        $form = $this->request->param("form");
        if ($form === null) {
            $this->error(__('Params error!'));
        }
        $this->model->where("id", "in", $ids)->update(["form"=>$form]);
        $this->success();
    }
}
