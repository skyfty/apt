<?php

namespace app\madcap\controller;

use app\poke\model\Admin;

class Index extends Common
{
    protected $noNeedLogin = ['index', 'login'];

    public function index()
    {

        return $this->view->fetch();
    }


}
