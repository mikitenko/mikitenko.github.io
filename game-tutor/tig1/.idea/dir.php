<?php

// make directories for ffmpeg merger script

$dir = scandir(getcwd());

foreach($dir as $v => $k)
{
    if ($k != "." && $k != "..")
        print "file '" . $k . "'<br/>";
}

?>