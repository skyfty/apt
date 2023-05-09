<?php

namespace app\chatgpt\controller;

class Index extends Common
{
    protected $noNeedLogin = ['index', 'login'];

    public function index()
    {
        return $this->view->fetch();
    }

    /**
     * 管理员登录
     */
    public function login() {
        $url = $this->request->get('url', 'index/index');
        if ($this->auth->isLogin()) {
            $this->success(__("You've logged in, do not login again"), $url);
        }

        $username = $this->request->post('username');
        $password = $this->request->post('password');
        $result = $this->auth->login($username, $password, 86400);
        if ($result === true) {
            $this->success(__('Login successful'), $url, ['url' => $url, 'id' => $this->auth->id, 'username' => $username, 'avatar' => $this->auth->avatar]);
        } else {
            $msg = $this->auth->getError();
            $msg = $msg ?: __('Username or password is incorrect');
            $this->error($msg, $url, ['token' => $this->request->token()]);
        }
    }

    /**
     * 注销登录
     */
    public function logout()
    {
        $this->auth->logout();
        $this->success(__('Logout successful'), 'index/index');
    }

}
