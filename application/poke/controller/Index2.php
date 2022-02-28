<?php

namespace app\poke\controller;

class Index2 extends Poke
{
    public function index()
    {
        $poke = model("Poke")->select();
        $this->assign("levels", $poke);
        return $this->view->fetch();
    }

}
