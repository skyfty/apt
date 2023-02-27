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
        $game = $this->request->param('game');
        if ($game == null) {
            $this->error("game id error");
            return;
        }

        $promotion = model("promotion")->where("idcode|id", $game)->find();
        if (!$promotion) {
            $this->error("game is not found");
            return;
        }

        $act = $this->request->param('act');
        if ($act == null) {
            $this->error("param error");
            return;
        }
        $act_time = $this->request->param('act_time', time());


        $channelId = $this->request->param('channel');
        if ($channelId == null) {
            $this->error("param error");
            return;
        }

        $compilation = model("compilation")->where("channel_model_id","eq", function($query)use($channelId) {
            $query->table("__CHANNEL__")->where("english_name|name|idcode|id", $channelId)->field("id");
        })->where("promotion_model_id", $promotion['id'])->find();

        if (!$compilation) {
            $this->error("channel is not found");
            return;
        }

        $trap = $this->request->param('trap');
        $trap = model("trap")->where("identifying|name|idcode|id", $trap)->where("promotion_model_id", $promotion['id'])->find();
        if (!$trap) {
            $this->error("trap is not found");
            return;
        }
        $data = $this->request->param('data', '');
        $uid = $this->request->param('uid');

        $row = model("cause")->create([
            "promotion_model_id"=>$promotion['id'],
            "channel_model_id"=>$compilation['channel_model_id'],
            "trap_model_id"=>$trap['id'],
            "act_time"=>$act_time,
            "report_time"=>time(),
            "content"=>$data,
            "act"=>$act,
            "uid"=>$uid,
            "ip_address"=>$this->request->ip(),
            "user_agent"=>$this->request->header('user-agent')
        ]);
        $this->success("OK", $row);
    }
}
