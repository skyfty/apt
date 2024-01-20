<?php

namespace app\bi\controller;

use app\common\controller\Api;
use think\Db;
use think\Exception;
use think\exception\PDOException;
use think\Request;

/**
 * 首页接口
 */
class Index extends Api
{
    protected $noNeedLogin = ['*'];
    protected $noNeedRight = ['*'];

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

        $act = $this->request->param('act');
        if ($act == null) {
            $this->error("param error");
            return;
        }
        $act_time = $this->request->param('act_time', time());


        $channelId = $this->request->param('channel');
        if ($channelId == null) {
            $this->error("param error");
            return;
        }

        $compilation = model("compilation")->where("channel_model_id","eq", function($query)use($channelId) {
            $query->table("__CHANNEL__")->where("english_name|name|idcode|id", $channelId)->field("id");
        })->where("promotion_model_id", $promotion['id'])->find();

        if (!$compilation) {
            $this->error("channel is not found");
            return;
        }

        $trap = $this->request->param('trap');
        $trap = model("trap")->where("name|idcode|id", $trap)->where("promotion_model_id", $promotion['id'])->find();
        if (!$trap) {
            $this->error("trap is not found");
            return;
        }
        $customer_model_id = $this->request->param('uid');
        if ($customer_model_id) {
            $user = model("user")->get($customer_model_id);
            if ($user) {
                $customer_model_id = $user['customer_model_id'];
            }
        }
        $data = $this->request->param('data', '');

        $row = model("cause")->create([
            "promotion_model_id"=>$promotion['id'],
            "channel_model_id"=>$compilation['channel_model_id'],
            "trap_model_id"=>$trap['id'],
            "act_time"=>$act_time,
            "report_time"=>time(),
            "content"=>$data,
            "act"=>$act,
            "customer_model_id"=>$customer_model_id,
            "ip_address"=>$this->request->ip(),
            "user_agent"=>$this->request->header('user-agent')
        ]);
        $this->success("OK", $row);
    }
    public function pick() {
        try {
            $database = $this->request->param('database', 'CountRush');

            $sql = $this->request->param('sql');
            $connectStr = 'mysql://root:1bf46663@127.0.0.1:3306/'.$database.'#utf8';
            if ($sql == null) {
                $table = $this->request->param('table');
                $field = $this->request->param('field','*');
                $id = $this->request->param('id');

                    $ccc = Db::connect($connectStr)->query('select ' . $field . ' from ' . $table . ' where id=:id', ['id' => $id]);

            } else {
                $ccc =  Db::connect($connectStr)->query($sql);

            }
            if (count($ccc) ==1) {
                $this->result("OK", $ccc[0]);

            } else {
                $this->result("OK", $ccc);

            }
        } catch (Exception $e) {
            $this->error($e->getMessage());

        }

    }
}
