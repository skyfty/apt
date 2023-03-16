<?php

namespace app\oss\controller;

use app\common\controller\Api;

class Level extends Api
{
    protected $noNeedLogin = ['get'];

    public function get() {
        $site = $this->request->host() == "oss.touchmagic.cn"?"poke.touchmagic.cn":"dev.poke.touchmagic.cn";
        $name=explode(".", $this->request->param("name"));
        $name_length  = count($name);
        $game_table = "Poke";
        if ($name_length == 3) {
            $game_table = $name[0];
            array_splice($name,0,1);
        }
        if ($name_length == 2) {
            $pokebag = model("pokebag")->where("id|idcode|name", $name[0])->where("site", $site)->find();
            if ($pokebag == null) {
                $this->result("not exist", [],-1,"json");
            }

            $where["pokebag_model_id"] = $pokebag['id'];
            $where["id|idcode|name"] = $name[1];
        }
        $where['site'] = $site;

        $poke = model($game_table)->where($where)->find();
        if ($poke == null) {
            $this->result("not exist", [],-1,"json");
        }
        $data = [];
        $data['name'] = $poke['name'];
        $data['id'] = $poke['id'];
        $data['level'] = $poke->formatLevel();
        $this->result('success', $data, 1, "json");
    }


}
