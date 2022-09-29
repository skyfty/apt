<?php

namespace app\bi\controller;

use app\common\controller\Api;
use think\Request;

/**
 * 首页接口
 */
class Verify extends Api
{
    protected $noNeedLogin = ['*'];
    protected $noNeedRight = ['*'];

    public function index() {
        $code = $this->request->param('code');
        if ($code == null) {
            $this->error("game id error");
            return;
        }
        $verify = model("verify")->where("name", $code)->find();
        if ($verify == null || $verify['status'] == "disallow") {
            $this->error("disallow");
        }
        $this->success("allow");
    }
}
