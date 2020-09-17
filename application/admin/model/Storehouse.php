<?php

namespace app\admin\model;

use think\App;
use think\Loader;
use think\Model;
use traits\model\SoftDelete;
use app\admin\library\Auth;

class Storehouse extends \app\common\model\Storehouse
{
    protected $append = [
        "estate_info"
    ];


    protected static function init()
    {
        self::beforeInsert(function($row){
            $auth = Auth::instance();
            $row['creator_model_id'] = $auth->isLogin() ? $auth->id : 1;
        });
        parent::init();

        self::beforeInsert(function($row){
            $maxid = self::max("id") + 1;
            $row['idcode'] = sprintf("ST%06d", $maxid);
        });


        self::afterUpdate(function($row){
            $scenery = Scenery::where(["model_table"=>$row['estate_type'],"pos"=>'view'])->cache(!App::$debug)->find();
            $fields = Sight::with('fields')->cache(!App::$debug)->where(['scenery_id'=>$scenery['id']])->column("fields.name");
            $fields2 = Sight::with('fields')->cache(!App::$debug)->where(['scenery_id'=>$scenery['id']])->where("type","in", ["model", "mztree"])->column("fields.name");
            foreach($fields2 as $k=>$v) {
                $fields[] = $v."_model_id";
            }
            $data = [];
            foreach($row->getData() as $k=>$v) {
                if (in_array($k, $fields)) {
                    $data[$k] = $v;
                }
            }
            $validate = Loader::validate($row['estate_type']);
            if(!$validate->check($data)){
                throw new \think\Exception($validate->getError());
            }
            model($row['estate_type'])->where("id",$row['estate_id'])->find()->allowField($fields)->save($data);
        });
    }

    public function getEstateInfoAttr($value, $data)
    {
        $estate_info = [];
        $estate = $this->estate;
        if ($estate) {
            $type_scenery = Scenery::where(["model_table"=>$data['estate_type'],"pos"=>'view'])->cache(!App::$debug)->order("weigh", "ASC")->find();
            $where =array(
                'scenery_id'=>$type_scenery['id']
            );
            $fields = Sight::with('fields')->cache(!App::$debug)->where($where)->order("weigh", "asc")->select();
            foreach($fields as $ff) {
                if (isset($estate[$ff['name']])) {
                    $val = $estate[$ff['name']];
                    if ($ff['type'] == "select") {
                        $val = $ff['content_list'][$val];
                    }
                    $estate_info[] = ['title'=>$ff['title'], 'value'=>$val];
                }
            }

        }
        return $estate_info;
    }
}
