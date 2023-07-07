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
class Gold extends Api
{
    protected $noNeedLogin = [];
    protected $noNeedRight = ['consume', 'checkPay', 'earn'];

    public function index() {

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

}