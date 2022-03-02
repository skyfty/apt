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

    // 密码加密
    protected function encryptPassword($password, $salt = '', $encrypt = 'md5')
    {
        return $encrypt($password . $salt);
    }

    public function staff() {
        return $this->hasOne('staff', 'id', 'staff_id', [], 'LEFT')->setEagerlyType(0);
    }

}
