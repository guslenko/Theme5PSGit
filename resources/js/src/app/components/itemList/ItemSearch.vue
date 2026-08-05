<template>
    <div class="search-box">
        <div class="search-box-shadow-frame">
            <input type="search" class="search-input" ref="searchInput" v-model="searchString"
                @input="onValueChanged($event.target.value)"
                @keyup.enter="search()"
                @focus="isSearchFocused = true"
                @blur="onBlurSearchField($event)" placeholder="Suchbegriff oder Artikelnummer...">
            <div class="search-button">
                <button class="search-submit" type="submit" @click="search()">Finden</button>
            </div>

                <div :class="{'no-focus': !isSearchFocused, 'no-results': !hasAutocompleteResults }">
                    <slot name="autocomplete-suggestions">
                        <div class="autocomplete-suggestionsps shadow bg-white">
                        <div class="its">
                            <p class="hl">Artikel</p>
                            <search-suggestion-item
                                :show-images="true"
                                :show-additional-information="true"
                                suggestion-type="item">
                            </search-suggestion-item>
                        </div>
                            <div class="sgg">
                                <p class="hl">Suchvorschläge</p>
                                <search-suggestion-item
                                    :show-count="true"
                                    :show-additional-information="true"
                                    suggestion-type="suggestion">
                                </search-suggestion-item>
                            </div>
                            <div class="cats">
                                <p class="hl">Kategorien</p>
                                <search-suggestion-item
                                    :show-count="true"
                                    :show-additional-information="true"
                                    suggestion-type="category">
                                </search-suggestion-item>
                            </div>

                        </div>
                    </slot>
                </div>

                </div>
    </div>








</template>

<script>
import UrlService from "../../services/UrlService";
import { isNullOrUndefined, defaultValue } from "../../helper/utils";
import { pathnameEquals } from "../../helper/url";
import ApiService from "../../services/ApiService";
import { mapGetters, mapState } from 'vuex';
import { debounce } from '../../helper/debounce';

export default {

    name: "item-search",

    props: {
        showItemImages:
        {
            type: Boolean
        },
        forwardToSingleItem:
        {
            type: Boolean,
            default: App.config.search.forwardToSingleItem
        },
        timeout:
        {
            type: Number,
            default: 500
        }
    },

    data()
    {
        return {
            isSearchFocused: App.isShopBuilder,
            onValueChanged: null,
            searchString: ""
        };
    },

    created()
    {
        this.onValueChanged = debounce(searchString =>
        {
            this.autocomplete(searchString);
        }, defaultValue(this.timeout, 500));
    },

    computed:
    {
        hasAutocompleteResults()
        {
            const item       = this.autocompleteResult.item;
            const category   = this.autocompleteResult.category;
            const suggestion = this.autocompleteResult.suggestion;

            return App.isShopBuilder || (item && item.length) || (category && category.length) || (suggestion && suggestion.length);
        },

        isShopBuilder()
        {
            return App.isShopBuilder;
        },
        ...mapGetters([
           "isLoggedIn"
        ]),

        ...mapState({
            autocompleteResult: state => state.itemSearch.autocompleteResult,
            moduleSearchString: state => state.itemList.searchString
        })
    },

    mounted()
    {
        this.$nextTick(() =>
        {
            const urlParams = UrlService.getUrlParams(document.location.search);

            this.$store.commit("setItemListSearchString", urlParams.query);

            this.$refs.searchInput.value = !isNullOrUndefined(urlParams.query) ? urlParams.query : "";
        });
    },

    methods:
    {
        search()
        {
            if (this.$refs.searchInput.value.length)
            {
                if (pathnameEquals(App.urls.search))
                {
                    this.$store.dispatch("searchItems", this.$refs.searchInput.value);
                }
                else
                {
                    window.open(`${App.urls.search}?query=${ this.searchString }`, "_self", false);
                }
            }
        },

        autocomplete(searchString)
        {
            if (searchString.length >= 2)
            {
                this.$store.dispatch("loadItemSearchAutocomplete", searchString);
            }
            else
            {
                this.$store.commit("setAutocompleteResult", { item: [], category: [], suggestion: [] });
            }
        },

        // hide search, if targetElement of the blur event is not a child of components' root element
        onBlurSearchField(event)
        {
            const target = event.relatedTarget;

            if (isNullOrUndefined(target) || !isNullOrUndefined(target) && !this.$el.contains(target))
            {
                this.isSearchFocused = false;
            }
        }
    },

    watch:
    {
        // set the current search string, after clicking on a suggestion
        moduleSearchString(newVal)
        {
            if (newVal && newVal.length)
            {
                this.searchString = newVal;
            }
        }
    }
}
</script>
