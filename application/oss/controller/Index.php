<?php

namespace app\oss\controller;

use app\common\controller\Api;
use app\common\model\Oss;
use think\Request;
use think\Validate;

/**
 * 首页接口
 */
class Index extends Api
{
    protected $noNeedLogin = ['login'];
    protected $noNeedRight = ['login', 'set', 'get'];

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
        $data = $this->request->post();
        $data['userid'] = $user['id'];
        $result = $oss->save($data);
        if ($result !== false) {
            $this->success(__('success'));
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
            unset($data["userid"], $data["_id"]);
        } else {
            $data = [];
        }
        $this->success(__('success'), $data);
    }

    public function login() {
        $username = $this->request->post('username');
        $password = $this->request->post('password');
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
}