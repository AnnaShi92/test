<?php
//定义变量，接收前端的参数
$num = $_GET['num'];
//解决跨域
$con = file_get_contents("http://mnks.jxedt.com/get_question?r=0.2544343069870654&index=$num");
echo $con;
