<?php

namespace app\admin\controller;

use app\admin\model\Fields;
use app\admin\model\Modelx;
use app\admin\model\Scenery;
use app\admin\model\Sight;
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

    public function trap() {
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax()) {
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $list = [];
            $channels = model("channel")->order($sort, $order)->limit($offset, $limit)->select();
            foreach ($channels as $k=>$v) {
                array_push($list, ['title'=>$v['name'],'id'=>$v['id']]);
            }
            $total = count($channels);
            return json(array("total" => $total, "rows" => collection($list)->toArray()));

        }
        return $this->view->fetch("trap");
    }

    public function customer() {
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax()) {
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $list = [];
            $channels = model("channel")->order($sort, $order)->limit($offset, $limit)->select();
            foreach ($channels as $k=>$v) {
                array_push($list, ['title'=>$v['name']]);
            }
            $total = count($channels);
            return json(array("total" => $total, "rows" => collection($list)->toArray()));

        }
        return $this->view->fetch("customer");
    }

    public function channel() {
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax()) {
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $list = [];
            $channels = model("channel")->order($sort, $order)->limit($offset, $limit)->select();
            foreach ($channels as $k=>$v) {
                array_push($list, ['title'=>$v['name']]);
            }
            $total = count($channels);
            return json(array("total" => $total, "rows" => collection($list)->toArray()));

        }
        return $this->view->fetch("channel");
    }


    public function graph() {
        $data=[];

        $type = $this->request->param("type", "increased");
        $scope = $this->request->get("scope", '');
        if (!$scope) {
            return [];
        }
        $scope = explode(" - ", $scope);
        $scope[0] = strtotime($scope[0]);$scope[1] = strtotime($scope[1]);

        $xAxis = [
            "type"=>"category",
            "boundaryGap"=>false,
        ];
        for($stepscope = $scope[0];$stepscope<=$scope[1];) {
            $stepend = strtotime('+1 day',$stepscope);
            $xAxis['data'][] = date('m-d',$stepscope);
            $stepscope = $stepend;
        }
        $data['xAxis'][] = $xAxis;

        $legend = [];
        $cheque = [['name'=>'新增']];
        foreach($cheque as $ck=>$cv) {
            $legend[] = $cv['name'];
            $series=[
                "type"=>'line',
                "name"=>$cv['name'],
                "data"=>[],
            ];
            for($stepscope = $scope[0]; $stepscope<=$scope[1];) {
                $stepend = strtotime('+1 day',$stepscope);
                $this->model->where("createtime", "BETWEEN", [$stepscope, $stepend]);
                switch ($type) {
                    case "increased": {
                        $series['data'][] = $this->model->count();
                        break;
                    }
                    case "sum": {
                        $field = $this->request->param("field", "amount");
                        $series['data'][] = $this->model->sum($field);
                        break;
                    }
                }
                $stepscope = $stepend;
            }
            $data['series'][] = $series;
        }
        $data['legend']['data'] = $legend;

        $this->result($data,1);
    }
}
