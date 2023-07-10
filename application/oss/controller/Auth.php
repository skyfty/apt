<?php

namespace app\oss\controller;

use app\common\controller\Api;
use app\common\model\Oss;

/**
 * 首页接口
 */
class Auth extends Api
{
    protected $noNeedLogin = ['index'];


    public function award($amount, $customer_model_id) {

    }

    public function index() {
        $channelId = $this->request->param('channel');
        $channel = model("channel")->where("english_name|name|idcode|id", $channelId)->find();
        if (!$channel) {
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
            $customer = model("customer")->allowField(true)->create([
                "channel_model_id"=>$channel['id'],
                "anonymous"=>1,
                "auth_id"=>$auth_id,
                "name"=>$nickname]);
            model("gold")->create([
                "type"=>"gold",
                "ioc"=>1,
                "amount"=>1000,
                "customer_model_id"=>$customer['id'],
            ]);
            $oss = Oss::get($customer['user_id']);
            if (!$oss) {
                $oss = new Oss;
            }
            $data['id'] = $customer['user_id'];
            $data['user_id'] =$customer['user_id'];
            $data['gold'] = 1000;
            $data['name'] = $nickname;
            $data['level'] = 0;
            $data['diamond'] = 0;
            $data['playCount'] = 0;
            $data['winCount'] = 0;
            $data['vodkaCount'] = 0;
            $data['usedCount'] = 0;

            $result = $oss->save($data);
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