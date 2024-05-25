<template>
    <sidebar></sidebar>
    <div class="main-content">
        <router-view></router-view>
    </div>
</template>

<style lang="scss">
// @import '@/assets/css/global.scss';

#app {
    display: flex;
    width: 100%;
    height: 100vh;
    background-color: $GlobalThemeColor;
    color: $GlobalTextColor;
    padding: 0;
}

body {
    margin: 0;
    padding: 0;
}
</style>
<style lang="scss" scoped>
.nav-menu {
    float: left;
}
.main-content {
    // width: 100%;
    flex: 1;
    box-sizing: border-box;
    min-height: 100vh;
    overflow-y: auto;
    padding: 10px;
}
</style>
