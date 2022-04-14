<?php

namespace app\poke\controller;


use app\poke\model\Poke;

class Level extends Common
{
    protected $noNeedLogin = ['get'];

    public function add() {
        $cnt = model("Poke")->where("pokebag_model_id", $_POST['pokebag_model_id'])->count();
        if ($cnt > 0) {
            $_POST['name'] = $_POST['name'] ."(".($cnt).")";
        }
        $poke = model("Poke")->create($_POST);
        $this->result($poke, 1);
    }

    public function del() {
        Poke::destroy($this->request->param("ids/a"));
        $this->success();
    }
    public function rename() {
        $id = $this->request->param("id");
        $name = $this->request->param("name");
        $cnt = model("Poke")->where("name", $name)->where("id", "neq", $id)->count();
        if ($cnt > 0) {
            $this->error(__('record exists'));
        }

        $poke = model("Poke")->get($id);
        if ($poke == null) {
            $this->error(__('Can not find the record'));
        }
        $poke->name     = $name;
        $poke->save();
        $this->result($poke, 1);
    }

    public function update() {
        $poke = model("Poke")->get($this->request->param("id"));
        if ($poke == null) {
            $this->error(__('Can not find the record'));
        }
        $poke->composition     = $_POST['composition'];
        $poke->save();
        $this->result($poke->composition, 1);
    }

    public function params() {
        $poke = model("Poke")->get($this->request->param("id"));
        if ($poke == null) {
            $this->error(__('Can not find the record'));
        }
        $poke->allowField(true)->save($_POST);
        $this->success();
    }

    private function formatLevel($poke) {
        return  [
            'composition'=>json_decode($poke['composition'], true),
            'params'=>json_decode($poke['params'], true),
            'stage'=>json_decode($poke['stage'], true),
            'underpan'=>json_decode($poke['underpan'], true),
        ];
    }

    public function download() {
        $pokes = model("Poke")->all($this->request->param("ids/a"));
        if ($pokes == null) {
            $this->error(__('Can not find the record'));
        }
        $fileName = \fast\Random::build("unique").".zip";
        $destFileDir = 'uploads/'. date('Ymd') . DS;
        $uploadDir = ROOT_PATH ."/public/" .$destFileDir;
        if (!file_exists($uploadDir))
            mkdir($uploadDir);

        $zip = new \ZipArchive();
        if (!$zip->open($uploadDir.$fileName, \ZipArchive::CREATE)) {
            $this->error(__('Can not find the record'));
        }

        foreach($pokes as $k=>$poke) {
            $data['name'] = $poke['name'];
            $data['level'] = $this->formatLevel($poke);
            $zip->addFromString($data['name'].".json", json_encode($data, JSON_UNESCAPED_UNICODE));
        }
        $zip->close();
        $this->success("",$destFileDir.$fileName);
    }

    public function get() {
        $name=explode(".", $this->request->param("name"));
        if (count($name) == 2) {
            $pokebag = model("pokebag")->where("id|idcode|name", $name[0])->find();
            if ($pokebag == null) {
                $this->result([], -1, 'error',"json");
            }
            $where["pokebag_model_id"] = $pokebag['id'];
            $where["id|idcode|name"] = $name[1];
        } else {
            $where = ["id|idcode|name"=>$name[0]];
        }

        $poke = model("Poke")->where($where)->find();
        if ($poke == null) {
            $this->result([], -1, 'error',"json");
        }
        $data = [];
        $data['name'] = $poke['name'];
        $data['level'] = $this->formatLevel($poke);
        $this->result($data, 1, 'success',"json");
    }


}
