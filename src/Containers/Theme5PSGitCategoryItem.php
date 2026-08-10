<?php

namespace Theme5PSGit\Containers;

use Plenty\Plugin\Templates\Twig;

class Theme5PSGitCategoryItem
{
    public function call(Twig $twig): string
    {
        return $twig->render('Theme5PSGit::ItemList.Components.CategoryItem');
    }
}
