<?php

namespace app\poke\controller;


use app\poke\model\Pokebag;

class Bag extends Common
{
    public function add() {
        $cnt = model("Pokebag")->count();
        if ($cnt > 0) {
            $_POST['name'] = $_POST['name'] ."(".($cnt).")";
        }
        $poke = model("Pokebag")->create($_POST);
        $this->result($poke, 1);
    }

    public function del() {
        Pokebag::destroy($this->request->param("ids/a"));
        $this->success();
    }
    public function rename() {
        $id = $this->request->param("id");
        $name = $this->request->param("name");
        $cnt = model("Pokebag")->where("name", $name)->where("id", "neq", $id)->count();
        if ($cnt > 0) {
            $this->error(__('record exists'));
        }
        $poke = model("Pokebag")->get($id);
        if ($poke == null) {
            $this->error(__('Can not find the record'));
        }
        $poke->name     = $name;
        $poke->save();
        $this->result($poke, 1);
    }

    public function params() {
        $poke = model("Pokebag")->get($this->request->param("id"));
        if ($poke == null) {
            $this->error(__('Can not find the record'));
        }
        $poke->allowField(true)->save($_POST);
        $this->success();
    }

    public function download() {
        $pokes = model("Pokebag")->all($this->request->param("ids/a"));
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
            $data = json_decode($poke['content'], true);
            $data['name'] = $poke['name'];
            $zip->addFromString($data['name'].".json", json_encode($data, JSON_UNESCAPED_UNICODE));
        }
        $zip->close();
        $this->success("",$destFileDir.$fileName);
    }
}
