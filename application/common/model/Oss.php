<?php

namespace app\common\model;

use think\Model;

class Oss extends Model
{
    protected $pk = 'user_id';

    protected $connection = [
        // 数据库类型
        'type'  =>  '\think\mongo\Connection',
        // 数据库名
        'database'       => 'uuu',
        // 用户名
        'username'       => '',
        // 密码
        'password'       => '',
        // 端口
        'hostport'       => '27017',
    ];
}
