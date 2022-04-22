<?php

namespace app\oss\controller;

use app\common\controller\Api;

class Level extends Api
{
    protected $noNeedLogin = ['get'];

    private function formatLevel($poke) {
        return  [
            'composition'=>json_decode($poke['composition'], true),
            'params'=>json_decode($poke['params'], true),
            'stage'=>json_decode($poke['stage'], true),
            'underpan'=>json_decode($poke['underpan'], true),
        ];
    }

    public function get() {
        $name=explode(".", $this->request->param("name"));
        if (count($name) == 2) {
            $pokebag = model("pokebag")->where("id|idcode|name", $name[0])->find();
            if ($pokebag == null) {
                $this->result("not exist", [],-1,"json");
            }
            $where["pokebag_model_id"] = $pokebag['id'];
            $where["id|idcode|name"] = $name[1];
        } else {
            $where = ["id|idcode|name"=>$name[0]];
        }

        $poke = model("Poke")->where($where)->find();
        if ($poke == null) {
            $this->result("not exist", [],-1,"json");
        }
        $data = [];
        $data['name'] = $poke['name'];
        $data['id'] = $poke['id'];
        $data['level'] = $this->formatLevel($poke);
        $this->result('success', $data, 1, "json");
    }


}
