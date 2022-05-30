<?php
$num = $_GET['num'];
$res = file_get_contents("http://mnks.jxedt.com/get_question?r=0.2544343069870654&index=$num");
echo $res;
