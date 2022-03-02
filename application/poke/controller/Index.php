<?php

namespace app\poke\controller;

class Index extends Common
{
    protected $noNeedLogin = ['index', 'login'];

    public function index()
    {
        if ($this->auth->isLogin()) {
            $where = [];
            if (!$this->auth->isSuperAdmin()) {
                $where['creator_model_id'] = $this->auth->id;
            }
            $pokebags = model("Pokebag")->where($where)->select();
            foreach($pokebags as $k=>$v) {
                $list = model("Poke")->where("pokebag_model_id", $v['id'])->where($where)->select();
                $pokebags[$k]['levels'] = $list;
            }
            $this->assign("pokebags", $pokebags);
        } else {
            $this->assign("pokebags", []);

        }
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
            $msg = $msg ? $msg : __('Username or password is incorrect');
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
