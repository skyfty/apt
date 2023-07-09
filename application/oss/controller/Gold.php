<?php

namespace app\oss\controller;

use app\common\controller\Api;
use app\common\model\Oss;
use think\Log;
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
            "ioc"=>$io,
            "amount"=>$amount,
            "customer_model_id"=>$customer_model_id,
        ];
        model("gold")->create($data);
        return model("gold")->where(["type"=>$type, "customer_model_id"=>$customer_model_id])->sum("amount*ioc");
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

        $sumtype = $this->inout(-1, $type, $amount, $user['customer_model_id']);
        $data = [
            'user_id'=>$user['id'],
            $type=>$sumtype,
        ];
        $oss->save($data);
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
        $sumtype = $this->inout(1, $type, $amount, $user['customer_model_id']);
        $data = [
            'user_id'=>$user['id'],
            $type=>$sumtype,
        ];
        $oss->save($data);
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
                $sumtype = $this->inout(1, "gold", 9999, $user['customer_model_id']);
                $data = [
                    'user_id'=>$user['id'],
                    "gold"=>$sumtype,
                ];
                $oss->save($data);
                break;
            }
            case "goldcoin":
            {
                $sumtype = $this->inout(1, "gold", 99999, $user['customer_model_id']);
                $data = [
                    'user_id'=>$user['id'],
                    "gold"=>$sumtype,
                ];
                $oss->save($data);
                break;
            }
            case "jewel66":
            {
                $sumtype = $this->inout(1, "diamond", 66, $user['customer_model_id']);
                $data = [
                    'user_id'=>$user['id'],
                    "diamond"=>$sumtype,
                ];
                $oss->save($data);
                break;
            }
            case "jewel888":
            {
                $sumtype = $this->inout(1, "diamond", 888, $user['customer_model_id']);
                $data = [
                    'user_id'=>$user['id'],
                    "diamond"=>$sumtype,
                ];
                $oss->save($data);

                break;
            }
            case "jjewel9999":
            {
                $sumtype = $this->inout(1, "diamond", 9999, $user['customer_model_id']);
                $data = [
                    'user_id'=>$user['id'],
                    "diamond"=>$sumtype,
                ];
                $oss->save($data);

                break;
            }
        }
        $data = $oss->getData();
        unset($data["user_id"], $data["_id"]);
        $this->success(__('success'), $data);

    }

}