<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="100px" class="aside">
        <div ></div>
        <img class="logo" alt="Vue logo" src="./assets/logo.png">
        <RouterLink class="routerlink" to="/trend" >趋势图</RouterLink>
        <RouterLink class="routerlink" to="/OX">点数图</RouterLink>
        <RouterLink class="routerlink" to="/train">训练图</RouterLink>
      </el-aside>
      <el-container>
        <el-header>Headers</el-header>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.aside {
  display: flex;
  flex-direction: column;
}
.header {
  height: 75px;
}
.logo {
  width: 75px;
  height: 75px;
}
.routerlink {
  height: 50px;
  text-align: center;
}
.main {
  padding: 0;
}
</style>
