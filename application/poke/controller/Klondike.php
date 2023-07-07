<?php

namespace app\poke\controller;

class Klondike extends Common
{
    protected $noNeedLogin = ['*'];
    protected $noNeedRight = ['*'];

    public function bag () {
        $where['game'] = "Klondike";
        $pokebags = model("Pokebag")->where($where)->field("name,id")->select();
        foreach($pokebags as $k=>$v) {
            $list = model("klondike")->where("pokebag_model_id", $v['id'])->field("name,id,game,moves")->select();
            foreach($list as $k2=>$v2) {
                $list[$k2]["game"] = json_decode($v2["game"],true);
            }
            $pokebags[$k]['levels'] = $list;
        }
        $result = json($pokebags);

        return $result;
    }
    public function add() {
        unset($_POST["_ajax"]);
        $cnt = model("Klondike")->where("pokebag_model_id", $_POST['pokebag_model_id'])->count();
        if ($cnt > 0) {
            $_POST['name'] = $_POST['name'] ."(".($cnt).")";
        }
        $_POST["site"] = $this->request->host();

        $poke = model("Klondike")->create($_POST);
        $this->result($poke, 1);
    }

    public function del() {
        model("Klondike")->destroy($this->request->param("ids"));
        $this->success();
    }
    public function rename() {
        $id = $this->request->param("id");
        $klondike = model("Klondike")->get($id);
        if ($klondike == null) {
            $this->error(__('Can not find the record'));
        }
        $name = $this->request->param("name");
        $where = [
            "pokebag_model_id"=> $klondike->pokebag_model_id,
            "name"=> $name
        ];
        $cnt = model("Klondike")->where($where)->where("id", "neq", $id)->count();
        if ($cnt > 0) {
            $this->error(__('名称重复'));
        }

        $klondike->name     = $name;
        $klondike->save();
        $this->result($klondike, 1);
    }

    public function update() {
        $klondike = model("Klondike")->get($this->request->param("id"));
        if ($klondike == null) {
            $this->error(__('Can not find the record'));
        }
        $klondike->composition     = $_POST['composition'];
        $klondike->save();
        $this->result($klondike->composition, 1);
    }

    public function params() {
        $klondike = model("Klondike")->get($this->request->param("id"));
        if ($klondike == null) {
            $this->error(__('Can not find the record'));
        }
        $klondike->allowField(true)->save($_POST);
        $this->success();
    }

}