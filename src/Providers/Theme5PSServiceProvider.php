<?php

namespace Theme5PSGit\Providers;

use Plenty\Plugin\ServiceProvider;
use Plenty\Plugin\Events\Dispatcher;
use Plenty\Plugin\Templates\Twig;
use IO\Helper\TemplateContainer;
use IO\Helper\ResourceContainer;
use IO\Extensions\Functions\Partial;
use IO\Services\ItemSearch\Helper\ResultFieldTemplate;
use Plenty\Plugin\ConfigRepository;
use Plenty\Modules\Webshop\Template\Providers\TemplateServiceProvider;



/**
 * Class Theme5PSServiceProvider
 * @package Theme5PS\Providers
 */
class Theme5PSServiceProvider extends TemplateServiceProvider
{
    // Run template overrides before plentyShop LTS registers its legacy Ceres fallback.
    const PRIORITY = 1000;

    public function register()
    {

    }

    public function boot(Twig $twig, Dispatcher $dispatcher, ConfigRepository $config)
    {
        $enabledOverrides = explode(", ", $config->get("Theme5PSGit.templates.override"));

        // plentyShop LTS requests this legacy Ceres template directly.
        // Map it to the theme's local fallback before template resolution.
        $this->overrideTemplate("Ceres::Homepage.Homepage", "Theme5PSGit::Homepage.Homepage");

        $this->overrideTemplate("Ceres::Search.Filter", "Theme5PSGit::ItemList.Components.Filter.FindologicFilterWrapper");
        $this->overrideTemplate("Findologic::Category.Item.Partials.SearchFilters", "Theme5PSGit::Category.Item.Partials.SearchFilters");
        $this->overrideTemplate("Findologic::content.scripts", "Theme5PSGit::ItemList.Components.Filter.Scripts");

        $dispatcher->listen('IO.Resources.Import',
            function (ResourceContainer $container) {
                $container->addScriptTemplate('Theme5PSGit::ItemList.Components.Filter.FindologicItemFilterList');
                $container->addScriptTemplate('Theme5PSGit::ItemList.Components.Filter.FindologicItemFilter');
                $container->addScriptTemplate('Theme5PSGit::ItemList.Components.Filter.FindologicItemDropdown');
                //$container->addScriptTemplate('Theme5PSGit::ItemList.Components.Filter.FindologicItemPrice');
            }
        );


        // Override partials
        $dispatcher->listen('IO.init.templates', function (Partial $partial) use ($enabledOverrides)
        {
            $partial->set('head', 'Ceres::PageDesign.Partials.Head');
            $partial->set('header', 'Ceres::PageDesign.Partials.Header.Header');
            $partial->set('page-design', 'Ceres::PageDesign.PageDesign');
            $partial->set('footer', 'Ceres::PageDesign.Partials.Footer');

            if (in_array("head", $enabledOverrides) || in_array("all", $enabledOverrides))
            {
                $partial->set('head', 'Theme5PSGit::PageDesign.Partials.Head');
            }

            if (in_array("header", $enabledOverrides) || in_array("all", $enabledOverrides))
            {
                $partial->set('header', 'Theme5PSGit::PageDesign.Partials.Header.Header');
            }

            if (in_array("page_design", $enabledOverrides) || in_array("all", $enabledOverrides))
            {
                $partial->set('page-design', 'Theme5PSGit::PageDesign.PageDesign');
            }

            if (in_array("footer", $enabledOverrides) || in_array("all", $enabledOverrides))
            {
                $partial->set('footer', 'Theme5PSGit::PageDesign.Partials.Footer');
            }

            return false;
        }, self::PRIORITY);

        // Keep IO from falling back to the missing Ceres::Homepage.Homepage template.
        $dispatcher->listen('IO.tpl.home', function (TemplateContainer $container)
        {
            $container->setTemplate('Theme5PSGit::Homepage.Homepage');
            return false;
        }, self::PRIORITY);

        // Override template for content categories
        if (in_array("category_content", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.category.content', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::Category.Content.CategoryContent');
                return false;
            }, self::PRIORITY);
        }

        // Override category view
        if (in_array("category_view", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.category.item', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::Category.Item.CategoryItem');
                return false;
            }, self::PRIORITY);
        }

        // Override shopping cart
        if (in_array("basket", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.basket', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::Basket.Basket');
                return false;
            }, self::PRIORITY);
        }

        // Override checkout
        if (in_array("checkout", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.checkout', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::Checkout.CheckoutView');
                return false;
            }, self::PRIORITY);
        }

        // Override order confirmation page
        if (in_array("order_confirmation", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.confirmation', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::Checkout.OrderConfirmation');
                return false;
            }, self::PRIORITY);
        }

        // Override login page
        if (in_array("login", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.login', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::Customer.Login');
                return false;
            }, self::PRIORITY);
        }

        // Override register page
        if (in_array("register", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.register', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::Customer.Register');
                return false;
            }, self::PRIORITY);
        }

        // Override single item page
        if (in_array("item", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.item', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::Item.SingleItemWrapper');
                return false;
            }, self::PRIORITY);
        }

        // Override search view
        if (in_array("search", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.search', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::Category.Item.CategoryItem');
                return false;
            }, self::PRIORITY);
        }

        // Override my account
        if (in_array("my_account", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.my-account', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::MyAccount.MyAccountView');
                return false;
            }, self::PRIORITY);
        }

        // Override wish list
        if (in_array("wish_list", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.wish-list', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::WishList.WishListView');
                return false;
            }, self::PRIORITY);
        }

        // Override contact page
        if (in_array("contact", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.contact', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::Customer.Contact');
                return false;
            }, self::PRIORITY);
        }

        // Override order return view
        if (in_array("order_return", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.order.return', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::OrderReturn.OrderReturnView');
                return false;
            }, self::PRIORITY);
        }

        // Override order return confirmation
        if (in_array("order_return_confirmation", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.order.return.confirmation', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::OrderReturn.OrderReturnConfirmation');
                return false;
            }, self::PRIORITY);
        }

        // Override cancellation rights
        if (in_array("cancellation_rights", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.cancellation-rights', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::StaticPages.CancellationRights');
                return false;
            }, self::PRIORITY);
        }

        // Override cancellation form
        if (in_array("cancellation_form", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.cancellation-form', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::StaticPages.CancellationForm');
                return false;
            }, self::PRIORITY);
        }

        // Override legal disclosure
        if (in_array("legal_disclosure", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.legal-disclosure', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::StaticPages.LegalDisclosure');
                return false;
            }, self::PRIORITY);
        }

        // Override privacy policy
        if (in_array("privacy_policy", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.privacy-policy', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::StaticPages.PrivacyPolicy');
                return false;
            }, self::PRIORITY);
        }

        // Override terms and conditions
        if (in_array("terms_conditions", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.terms-conditions', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::StaticPages.TermsAndConditions');
                return false;
            }, self::PRIORITY);
        }

        // Override item not found page
        if (in_array("item_not_found", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.item-not-found', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::StaticPages.ItemNotFound');
                return false;
            }, self::PRIORITY);
        }

        // Override page not found page
        if (in_array("page_not_found", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.page-not-found', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::StaticPages.PageNotFound');
                return false;
            }, self::PRIORITY);
        }

        // Override newsletter opt-out page
        if (in_array("newsletter_opt_out", $enabledOverrides) || in_array("all", $enabledOverrides))
        {

            $dispatcher->listen('IO.tpl.newsletter.opt-out', function (TemplateContainer $container)
            {
                $container->setTemplate('Theme5PSGit::Newsletter.NewsletterOptOut');
                return false;
            }, self::PRIORITY);
        }

        $enabledResultFields = [];

        if(!empty($config->get("Theme5PSGit.result_fields.override")))
        {
            $enabledResultFields = explode(", ", $config->get("Theme5PSGit.result_fields.override"));
        }

        if(!empty($enabledResultFields))
        {
            $dispatcher->listen( 'IO.ResultFields.*', function(ResultFieldTemplate $templateContainer) use ($enabledResultFields)
            {
                $templatesToOverride = [];

                // Override list item result fields
                if (in_array("list_item", $enabledResultFields) || in_array("all", $enabledResultFields))
                {
                    $templatesToOverride[ResultFieldTemplate::TEMPLATE_LIST_ITEM] = 'Theme5PSGit::ResultFields.ListItem';
                }

                // Override single item view result fields
                if (in_array("single_item", $enabledResultFields) || in_array("all", $enabledResultFields))
                {
                    $templatesToOverride[ResultFieldTemplate::TEMPLATE_SINGLE_ITEM] = 'Theme5PSGit::ResultFields.SingleItem';
                }

                // Override basket item result fields
                if (in_array("basket_item", $enabledResultFields) || in_array("all", $enabledResultFields))
                {
                    $templatesToOverride[ResultFieldTemplate::TEMPLATE_BASKET_ITEM] = 'Theme5PSGit::ResultFields.BasketItem';
                }

                // Override auto complete list item result fields
                if (in_array("auto_complete_list_item", $enabledResultFields) || in_array("all", $enabledResultFields))
                {
                    $templatesToOverride[ResultFieldTemplate::TEMPLATE_AUTOCOMPLETE_ITEM_LIST] = 'Theme5PSGit::ResultFields.AutoCompleteListItem';
                }

                // Override category tree result fields
                if (in_array("category_tree", $enabledResultFields) || in_array("all", $enabledResultFields))
                {
                    $templatesToOverride[ResultFieldTemplate::TEMPLATE_CATEGORY_TREE] = 'Theme5PSGit::ResultFields.CategoryTree';
                }

                $templateContainer->setTemplates($templatesToOverride);
            }, self::PRIORITY);
        }
    }
}
