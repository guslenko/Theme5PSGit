<template>
    <div v-if="facet.name" class="card pt-4 border-0 wwmif3" :class="facet.cssClass + ' filterfacets-card-' + facet.id">
        <div class="h3 title py-0">{{ facetName }}</div>

        <div v-if="facet.type === 'price'">
            <item-filter-price></item-filter-price>
        </div>

        <!-- div v-else class="form-check-wrapper" v-for="value in facets" :key="value.id" :class="value.cssClass">
            <div class="form-check mb-0 pl-0">
                <input :id="'option-' + value.id + '-' + _uid" class="form-check-input d-none" type="checkbox" :checked="isSelected(value.id)" @change="updateFacet(value)" :disabled="isLoading || value.count <= 0">
                <label :for="'option-' + value.id + '-' + _uid" class="form-check-label" :class="[paddingClasses, isSelected(value.id) ? 'bg-appearance' : '', 'option-' + value.id]" :style="paddingInlineStyles">
                    <div class="d-flex">
                        <span class="flex-grow-1">{{ value.name }}</span>
                        <div class="filter-badge">{{ value.count }}</div>
                    </div>
                </label>
            </div>
        </div -->
        <!--
          <div v-else class="form-check-wrapper" v-for="value in facets" :key="value.id" :class="value.cssClass">
            <div class="form-check" >
                <input :id="'option-' + value.id + '-' + _uid" class="form-check-input" type="checkbox" :checked="isSelected(value.id)" @change="updateFacet(value)" :disabled="isLoading || value.count <= 0">
                <label :for="'option-' + value.id + '-' + _uid"
                :title="value.name"
                class="form-check-label"
                :class="{{
                'filterfacets-color': facet.id == '1', 'filterfacets-cssColor': value.cssClass.includes('color_css'),
                'filterfacets-color-white': value.cssClass === '#ffffff' || value.cssClass === 'white'
                }}"
                :style= "[(facet.id == '1' && !value.cssClass.includes('color_css'))? {{'background': value.cssClass}} : {{}}]"
                :id="'option-' + value.id + '-' + _uid">
                <template v-if="facet.id != '1'">
                    {{ value.name }}
                </template>
                </label>
                <div class="filter-badge bg-appearance">{{ value.count }}</div>
            </div>
        </div>
        -->

      <div v-else class="form-check-wrapper" v-for="value in facets" :key="value.id" :class="value.cssClass">
            <div class="form-check">
                <input :id="'option-' + value.id" class="form-check-input d-none" type="checkbox" :checked="isSelected(value.id)" @change="updateFacet(value)" :disabled="isLoading || value.count <= 0">
                <label :for="'option-' + value.id"
                :title="value.name"
                class="form-check-label"
                :class="[paddingClasses, isSelected(value.id) ? 'bg-appearance' : '', 'option-' + value.id]"
                :style="paddingInlineStyles"
                :id="'option-' + value.id">
                <template v-if="facet.id != '1'">
                    {{ value.name }}
                </template>
                </label>
                <div class="filter-badge bg-appearance">{{ value.count }}</div>
            </div>
        </div>

    </div>
</template>

<script>
import { mapState } from "vuex";
import ItemFilterPrice from "./ItemFilterPrice.vue";

export default {

    name: "item-filter",

    components:
    {
        ItemFilterPrice
    },

    props:
    {
        facet:
        {
            type: Object
        },
        paddingClasses:
        {
            type: String,
            default: null
        },
        paddingInlineStyles:
        {
            type: String,
            default: null
        }
    },

    computed:
    {
        facets()
        {
            return this.facet.values;
        },

        facetName()
        {
            if (this.facet.translationKey && this.facet.translationKey.length > 0)
            {
                return this.$translate("Ceres::Template." + this.facet.translationKey);
            }

            return this.facet.name;
        },

        ...mapState({
            selectedFacets: state => state.itemList.selectedFacets,
            isLoading: state => state.itemList.isLoading
        })
    },

    methods:
    {
        updateFacet(facetValue)
        {
            const toolbarElements = document.getElementsByClassName("widget-toolbar");

            for (const toolbarElement of toolbarElements)
            {
                if (toolbarElement.contains(this.$vnode.elm))
                {
                    window.localStorage.setItem("openFilterToolbar", true);
                }
            }

            this.$store.dispatch("selectFacet", { facetValue });
        },

        isSelected(facetValueId)
        {
            return this.selectedFacets.findIndex(selectedFacet => selectedFacet.id === facetValueId) > -1;
        }
    }
}
</script>
