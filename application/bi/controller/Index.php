<?php

namespace app\bi\controller;

use app\common\controller\Api;
use think\Request;

/**
 * 首页接口
 */
class Index extends Api
{
    protected $noNeedLogin = ['*'];
    protected $noNeedRight = ['*'];

    /**
     * 首页
     *
     */
    public function index() {
        $gameId = Request::instance()->param('gameId');
        if ($gameId == null) {
            $this->error("game id error");
            return;
        }
        $act = Request::instance()->param('act');
        if ($act == null) {
            $this->error("param error");
            return;
        }
        $act_time = Request::instance()->param('act_time', time());


        $channelId = Request::instance()->param('channelId');
        if ($channelId == null) {
            $this->error("param error");
            return;
        }
        $channel = model("channel")->where("english_name|name|idcode", $channelId)->find();
        if (!$channel) {
            $this->error("channel is not found");
            return;
        }

        $act = Request::instance()->param('act');

        $trapId = Request::instance()->param('trapId');
        $trap = model("trap")->where("identifying|name|idcode", $trapId)->find();
        if (!$trap) {
            $this->error("trap is not found");
            return;
        }

        $promotion = model("promotion")->where("idcode", $gameId)->find();
        if (!$promotion) {
            $this->error("game is not found");
            return;
        }
        $data = Request::instance()->param('data', '');

        model("cause")->create([
            "promotion_model_id"=>$promotion['id'],
            "channel_model_id"=>$channel['id'],
            "trap_model_id"=>$trap['id'],
            "act"=>$act,
            "act_time"=>$act_time,
            "report_time"=>time(),
            "content"=>$data,
        ]);
        $this->success("OK");
    }
}
