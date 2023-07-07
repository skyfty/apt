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
    protected $noNeedRight = ['login', 'set', 'get', 'logout', 'pass', 'consume', 'checkPay', 'earn'];

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

        $data = $this->request->except(['money','gold','diamond','star','playCount','winCount','usedCount'], "post");
        $data['user_id'] = $user['id'];
        $result = $oss->save($data);
        if ($result !== false) {
            $this->success(__('success'),$data);
        } else {
            $this->error($oss->getError());
        }
    }

    public function place() {
        $user = $this->auth->getUser();
        if (!$user) {
            $this->error(__('error'));
        }
        $oss = Oss::get($user['id']);
        if (!$oss) {
            $oss = new Oss;
        }
        $value = $this->request->param('value', 0);
        $name = $this->request->param('name');
        $result = $oss->setField($name, $value);
        if ($result !== false) {
            $data = $oss->getData();
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
            'password'  => 'require|length:3,30'
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

    public function consume() {
        $user = $this->auth->getUser();
        if (!$user) {
            $this->error(__('error'));
        }
        $oss = Oss::get($user['id']);
        if (!$oss) {
            $this->error("error");
            return;
        }
        $amount = $this->request->param('amount', 0);
        $type = $this->request->param('type');
        $oss->setDec($type, $amount);
        $data = $oss->getData();
        unset($data["user_id"], $data["_id"]);
        $this->success(__('success'), $data);
    }


    public function earn() {
        $user = $this->auth->getUser();
        if (!$user) {
            $this->error(__('error'));
        }
        $oss = Oss::get($user['id']);
        if (!$oss) {
            $this->error("error");
            return;
        }
        $amount = $this->request->param('amount', 0);
        $type = $this->request->param('type');
        $oss->setInc($type, $amount);
        $data = $oss->getData();
        unset($data["user_id"], $data["_id"]);
        $this->success(__('success'), $data);
    }

    public function checkPay() {
        $user = $this->auth->getUser();
        if (!$user) {
            $this->error(__('error'));
        }
        $oss = Oss::get($user['id']);

        if (!$oss) {
            $this->error(__('error'));
        }
        $productId = $this->request->param('productId');
        switch ($productId)
        {
            case "ad":
            {
                $oss->setInc("gold", 9999);
                break;
            }
            case "goldcoin":
            {
                $oss->setInc("gold", 99999);
                break;
            }
            case "jewel66":
            {
                $oss->setInc("diamond", 66);
                break;
            }
            case "jewel888":
            {
                $oss->setInc("diamond", 888);
                break;
            }
            case "jjewel9999":
            {
                $oss->setInc("diamond", 9999);
                break;
            }
        }
        $data = $oss->getData();
        unset($data["user_id"], $data["_id"]);
        $this->success(__('success'), $data);

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