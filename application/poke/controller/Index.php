<?php

namespace app\poke\controller;


class Index extends Common
{
    public function index()
    {
        $pokebags = model("Pokebag")->select();
        foreach($pokebags as $k=>$v) {
            $list = model("Poke")->where("pokebag_model_id", $v['id'])->select();
            $pokebags[$k]['levels'] = $list;
        }
        $this->assign("pokebags", $pokebags);
        return $this->view->fetch();
    }

}
