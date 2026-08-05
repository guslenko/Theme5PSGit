<?php

namespace Theme5PS\Containers;

use Plenty\Plugin\Templates\Twig;

class Theme5PSCategoryItem
{
    public function call(Twig $twig): string
    {
        return $twig->render('Theme5PS::ItemList.Components.CategoryItem');
    }
}
