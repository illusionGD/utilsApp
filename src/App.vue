<template>
    <header-menu class="menu"></header-menu>
    <div class="content">
        <sidebar></sidebar>
        <div class="main-content scroll-small">
            <router-view></router-view>
        </div>
    </div>
</template>

<style lang="scss">
#app {
    height: 100vh;
    background-color: $GlobalThemeColor;
    color: $GlobalTextColor;
}
.content {
    flex: 1;
    display: flex;
    width: 100%;
    height: calc(100vh - 50px);
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
    flex: 1;
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;
    padding: 10px;
}
</style>
