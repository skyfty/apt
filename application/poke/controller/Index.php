<?php

namespace app\poke\controller;

class Index extends Poke
{
    public function index()
    {
        return $this->view->fetch();
    }

}
