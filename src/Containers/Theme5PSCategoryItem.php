<?php

namespace Theme5PS\Containers;

use Plenty\Plugin\Templates\Twig;

class Theme5PSCategoryItem
{
    public function call(Twig $twig): string
    {
        return $twig->render('Theme5PSGit::ItemList.Components.CategoryItem');
    }
}
