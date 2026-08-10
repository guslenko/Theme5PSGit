<?php

namespace Theme5PSGit\Containers;

use Plenty\Plugin\Templates\Twig;

class Theme5PSScriptContainer
{
    public function call(Twig $twig):string
    {
        return $twig->render('Theme5PSGit::Script');
    }
}