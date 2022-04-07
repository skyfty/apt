<?php

namespace app\oss\controller;


use app\common\controller\Api;
use app\poke\model\Poke;

class Money extends Api
{
    protected $noNeedLogin = ['add'];
    protected $noNeedRight = ['add'];
    public function add() {
        $amount = $this->request->param("amount");
        $pokereword = model("money");
        $pokereword->data([
            'amount'=>$amount,
            'type'=>'money',
            'ino'=>1,
            'user_id'=>1,
        ]);
        $pokereword->save();
        $this->success("success");
    }

}
