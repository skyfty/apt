<?php

namespace app\poke\controller;


use app\poke\model\Poke;

class Level extends Common
{
    public function add() {
        $poke = model("Poke")->create($_POST);
        $this->result($poke, 1);
    }

    public function del() {
        Poke::destroy($this->request->param("ids/a"));
        $this->success();
    }
    public function rename() {
        $poke = model("Poke")->get($this->request->param("id"));
        if ($poke == null) {
            $this->error(__('Can not find the record'));
        }
        $poke->name     = $this->request->param("name");
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
            $data = json_decode($poke['content'], true);
            $data['name'] = $poke['name'];
            $zip->addFromString($data['name'].".json", json_encode($data, JSON_UNESCAPED_UNICODE));
        }
        $zip->close();
        $this->success("",$destFileDir.$fileName);
    }
}
