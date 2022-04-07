<?php

namespace app\poke\controller;


use app\poke\model\Poke;

class Money extends Common
{
    protected $noNeedLogin = ['get'];

    public function add() {
        $cnt = model("pokereword")->where('creator_model_id', $this->auth->id)->where("pokebag_model_id", $_POST['pokebag_model_id'])->count();
        if ($cnt > 0) {
            $_POST['name'] = $_POST['name'] ."(".($cnt).")";
        }
        $poke = model("Poke")->create($_POST);
        $this->result($poke, 1);
    }

}
