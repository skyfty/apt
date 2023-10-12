<?php

namespace app\oss\controller;

use app\common\controller\Api;

class Promotion extends Api {
    protected $noNeedLogin = ['*'];
    protected $noNeedRight = ['translates'];

    public function translates() {
        $name =$this->request->param("name", null);
        if ($name === null)
            $this->error(__('Params error!'));
        $promotion = model("Promotion")->where(['code_name'=>$name])->find();
        if ($promotion === null)
            $this->error(__('Params error!'));
        $tranlsates = json_decode($promotion->tranlsates, true);


        $this->success(__('success'), $tranlsates);
    }
}