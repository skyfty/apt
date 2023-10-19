<?php

namespace app\admin\model;

use think\App;
use think\Loader;
use think\Model;
use traits\model\SoftDelete;
use app\admin\library\Auth;

class Internationalization extends  \app\common\model\Internationalization
{

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
            if (isset($row['name'])) {
                db('translate')->where('internationalization_model_id', $row->id)->update(['name'=>'']);
            }
        });
    }

}
