<?php

namespace app\poke\model;

use think\Model;

class Admin extends Model
{
    // 开启自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $append = [
    ];

    protected static function init()
    {
        parent::init();
    }

    public function resetPassword($password)
    {
        $password = md5(md5($password) . $this->salt);
        $ret = $this->update(['password' => $password,'id'=>$this->id]);
        return $ret;
    }

    public function staff() {
        return $this->hasOne('staff', 'id', 'staff_id', [], 'LEFT')->setEagerlyType(0);
    }

}
