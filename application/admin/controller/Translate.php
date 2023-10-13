<?php

namespace app\admin\controller;

use app\admin\model\Fields;
use app\admin\model\Modelx;
use app\admin\model\Sight;
use app\common\controller\Backend;
use think\App;

/**
 * 行为统计
 *
 * @icon fa fa-circle-o
 */
class Translate extends Cosmetic
{
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Translate;
    }

    public function list() {
        $ids =$this->request->param("ids", null);
        if ($ids === null)
            $this->error(__('Params error!'));
        $row = model("internationalization")->get($ids);
        $this->view->assign("row", $row);

        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax()) {
            $list = $this->model->where(['internationalization_model_id'=>$ids])->select();
            return json(array("total" => count($list), "rows" => collection($list)->toArray()));
        }

        $this->view->engine->layout('layout/select');

        $allfields = Sight::with('fields')->cache(!App::$debug)->where(['sight.scenery_id'=>904])->order("weigh", "asc")->select();
        $this->assignconfig('allFields', $allfields);

        return $this->view->fetch("list");
    }
}
