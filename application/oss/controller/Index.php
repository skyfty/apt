<?php

namespace app\oss\controller;

use app\common\controller\Api;
use app\common\model\Oss;
use think\Log;
use think\Request;
use think\Validate;

/**
 * 首页接口
 */
class Index extends Api
{
    protected $noNeedLogin = ['login'];
    protected $noNeedRight = ['login', 'set', 'get', 'logout', 'pass'];

    /**
     * 首页
     *
     */
    public function index() {

    }

    /**
     * 首页
     *
     */
    public function set() {
        $user = $this->auth->getUser();
        if (!$user) {
            $this->error(__('error'));
        }
        $oss = Oss::get($user['id']);
        if (!$oss) {
            $oss = new Oss;
        }

        $data = $this->request->except(['money'], "post");
        $data['user_id'] = $user['id'];
        $result = $oss->save($data);
        if ($result !== false) {
            $this->success(__('success'),$data);
        } else {
            $this->error($oss->getError());
        }
    }

    public function get() {
        $user = $this->auth->getUser();
        if (!$user) {
            $this->error(__('error'));
        }
        $oss = Oss::get($user['id']);

        if ($oss) {
            $data = $oss->getData();
            unset($data["user_id"], $data["_id"]);
        } else {
            $data = ['id'=>$user['id'],'name'=>$user['nickname']];
        }
        $this->success(__('success'), $data);
    }

    public function login() {
        $username = $this->request->param('username');
        $password = $this->request->param('password');
        $rule = [
            'username'  => 'require|length:3,30',
            'password'  => 'require|length:3,30',
            '__token__' => 'token',
        ];
        $data = [
            'username'  => $username,
            'password'  => $password,
        ];
        $validate = new Validate($rule, [], ['username' => __('Username'), 'password' => __('Password')]);
        $result = $validate->check($data);
        if (!$result) {
            $this->error($validate->getError());
        }
        $result = $this->auth->login($username, $password);
        if ($result === true) {
            $this->success(__('Login successful'), ['token' => $this->auth->getToken(),'id' => $this->auth->id, 'username' => $username, 'avatar' => $this->auth->avatar]);
        } else {
            $msg = $this->auth->getError();
            $msg = $msg ?: __('Username or password is incorrect');
            $this->error($msg);
        }
    }

    public function logout() {
        $this->auth->logout();
        $this->success(__('success'));
    }

    public function pass() {
        $user = $this->auth->getUser();
        if (!$user) {
            $this->error(__('error'));
        }
        $poke_id = $this->request->param('poke_id');
        if (!$poke_id) {
            $this->error(__('error'));
        }
        $poke = model("pokepass")->get($poke_id);
        if (!$poke) {
            $this->error(__('error'));
        }
        $pokepass = model("pokepass");
        $pokepass->data([
            'creator_model_id'=>$user['id'],
            'poke_model_id'=>$poke['id'],
            'user_id'=>$user['id'],
        ]);
        $pokepass->save();

        $oss = Oss::get($user['id']);
        if (!$oss) {
            $oss = new Oss;
        }
        $data['user_id'] = $user['id'];
        $data['last_poke'] = $poke_id;
        if (!isset($data['pokes'])) {
            $data['pokes'] = [];
        }
        $data['pokes'][] = $poke_id;
        $oss->save($data);
        $this->success(__('success'));
    }

}