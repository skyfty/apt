<?php

namespace app\oss\controller;

use app\common\controller\Api;

/**
 * 首页接口
 */
class Auth extends Api
{
    protected $noNeedLogin = ['index'];

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
        $channelId = $this->request->param('channel');

        $compilation = model("compilation")->where("channel_model_id","eq", function($query)use($channelId) {
            $query->table("__CHANNEL__")->where("english_name|name|idcode|id", $channelId)->field("id");
        })->where("promotion_model_id", $promotion['id'])->find();
        if (!$compilation) {
            $this->error("channel is not found");
            return;
        }
        $auth_id = $this->request->param('auth_id');
        if (!$auth_id) {
            $this->error("channel is not found");
            return;
        }
        $nickname = $this->request->param('nickname');

        $user = model("user")->where("auth_id", $auth_id)->find();
        if ($user == null) {
            model("customer")->allowField(true)->create([
                "channel_model_id"=>$channelId,
                "anonymous"=>1,
                "auth_id"=>$auth_id,
                "name"=>$nickname]);

        }
        $result = $this->auth->authlogin($auth_id);

        if ($result === true) {
            $this->success(__('Login successful'), ['token' => $this->auth->getToken(),'id' => $this->auth->id, 'username' => $nickname, 'avatar' => $this->auth->avatar]);
        } else {
            $msg = $this->auth->getError();
            $msg = $msg ?: __('Username or password is incorrect');
            $this->error($msg);
        }
    }


}