<?php

namespace app\poke\controller;

use think\Lang;

/**
 * Ajax异步请求接口
 * @internal
 */
class Ajax extends Common
{
    protected $noNeedLogin = ['*'];
    protected $noNeedRight = ['*'];

    /**
     * 加载语言包
     */
    public function lang()
    {
        header('Content-Type: application/javascript');
        $callback = $this->request->get('callback');
        $controllername = input("controllername");
        $this->loadlang($controllername);
        //强制输出JSON Object
        $result = jsonp(Lang::get(), 200, [], ['json_encode_param' => JSON_FORCE_OBJECT | JSON_UNESCAPED_UNICODE]);
        return $result;
    }

    public function pokebag () {
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
    
    /**
     * 上传文件
     */
    public function upload()
    {
        return action('api/common/upload');
    }


}
