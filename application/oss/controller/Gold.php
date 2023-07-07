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

    public function inout($io, $type, $amount, $customer_model_id) {
        $data = [
            "type"=>$type,
            "inout"=>$io,
            "amount"=>$amount,
            "customer_model_id"=>$customer_model_id,
        ];
        model("gold")->create($data);
        return model("gold")->where(["type"=>$type, "customer_model_id"=>$customer_model_id])->sum("amount*inout");
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
        $oss->setField($type, $this->inout(-1, $type, $amount, $user['customer_model_id']));
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
        $oss->setField($type, $this->inout(1, $type, $amount, $user['customer_model_id']));
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
                $oss->setField("gold", $this->inout(1, "gold", 9999, $user['customer_model_id']));
                break;
            }
            case "goldcoin":
            {
                $oss->setField("gold", $this->inout(1, "gold", 99999, $user['customer_model_id']));
                break;
            }
            case "jewel66":
            {
                $oss->setField("diamond", $this->inout(1, "diamond", 66, $user['customer_model_id']));
                break;
            }
            case "jewel888":
            {
                $oss->setField("diamond", $this->inout(1, "diamond", 888, $user['customer_model_id']));
                break;
            }
            case "jjewel9999":
            {
                $oss->setField("diamond", $this->inout(1, "diamond", 9999, $user['customer_model_id']));
                break;
            }
        }
        $data = $oss->getData();
        unset($data["user_id"], $data["_id"]);
        $this->success(__('success'), $data);

    }

}