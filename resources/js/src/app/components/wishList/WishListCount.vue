<template>
    <a :href="urlWishList"  rel="nofollow" :aria-label="$translate('Ceres::Template.wishList')">
      <button class="shop-nav__btn">
        <i class="icon__wish-list">
          <span class="shop-nav__wish-list-wrap">
            <span class="shop-nav__wish-list-amount">{{ wishListCount }}</span>
          </span>
        </i>
        <span class="wish-list-text">{{ $translate('Ceres::Template.wishList') }}</span>
      </button>
    </a>


</template>

<script>
export default {
    computed:
    {
        wishListCount()
        {
            return this.$store.getters.wishListCount;
        },

        urlWishList()
        {
            return App.urls.wishList;
        }
    }
}
</script>
