<?php

namespace app\admin\controller;

use app\admin\model\Modelx;
use app\common\controller\Backend;
use think\App;

/**
 * 图片资源
 *
 * @icon fa fa-circle-o
 */
class Statistic extends Cosmetic
{
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Cause;
    }


    protected function spectacle($model) {
        return $model;
    }


    public function index() {
        $this->request->filter(['strip_tags']);

        $cosmeticModel = Modelx::get(['table' => "cause"],[],!App::$debug);

        if ($this->request->isAjax()) {
            $relationSearch = $this->getRelationSearch($cosmeticModel);;
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $this->model->alias("cause")->where($where)->with($relationSearch);
            $total = $this->model->count();

            $this->model->alias("cause")->where($where)->with($relationSearch)->order($sort, $order)->limit($offset, $limit);
            $list = $this->model->select();

            $relationModel = $this->getRelationModel($cosmeticModel);;
            foreach($list as $row) {
                foreach($relationModel as $rmk=>$rm) {
                    $row->appendRelationAttr($rmk, $rm);
                }
            }
            return json(array("total" => $total, "rows" => collection($list)->toArray()));
        }
        $this->assignScenery($cosmeticModel->id, ['index']);
        return $this->view->fetch("index");
    }
}
