<?php

namespace app\admin\controller;

use app\admin\model\Scenery;
use app\admin\model\Sight;
/**
 * 客户管理
 *
 * @icon fa fa-circle-o
 */

class Customer extends Cosmetic
{
    protected $selectpageFields = ['name', 'idcode', 'slug', 'id'];
    protected $searchFields = ['name', 'idcode', 'slug'];
    protected $selectpageShowFields = ['name', 'idcode'];

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model("customer");
    }

    public function account($ids) {
        $row = $this->model->with($this->relationSearch)->find($ids);
        if (!$row)
            $this->error(__('No Results were found'));
        $this->view->assign("row", $row);

        $scenery = Scenery::get(['model_table' => 'account', 'name'=>"customer"],[],true);
        $where =array(
            'scenery_id'=>$scenery['id'],
            "fields.name"=>array("not in", array("weigh",'reckon','reckon_type'))
        );
        $fields =  Sight::with('fields')->where($where)->order("weigh", "DESC")->cache(true)->select();;
        $content = $this->view->fetch();
        return array("content"=>$content, "fields"=>$fields);
    }

    protected function spectacle($model) {
        $branch_model_id = $this->request->param("branch_model_id");
        if ($branch_model_id == null) {
            if ($this->auth->isSuperAdmin() || !$this->admin || !$this->admin['staff_id']) {
                return $model;
            }
        }
        $branch_model_id = $branch_model_id != null ?$branch_model_id: $this->staff->branch_model_id;

        $model->where("customer.branch_model_id", $branch_model_id);

        return $model;
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
