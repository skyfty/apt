<?php

namespace app\poke\controller;

class Index extends Poke
{
    public function index()
    {
        $poke = model("Poke")->select();
        $this->assign("levels", $poke);
        return $this->view->fetch();
    }

    public function add() {
        $params = $this->request->post();
        $poke = model("Poke")->create($_POST);
        $this->success(__('Login successful'), "", $poke);
    }

    public function del() {
        $poke = model("Poke")->get($this->request->param("id"));
        if ($poke == null) {
            $this->error(__('Login successful'));
        }
        $poke->delete();
        $this->success(__('Login successful'));
    }
    public function rename() {
        $poke = model("Poke")->get($this->request->param("id"));
        if ($poke == null) {
            $this->error(__('Login successful'));
        }
        $poke->name     = $this->request->param("name");
        $poke->save();
        $this->success(__('Login successful'));
    }
}
