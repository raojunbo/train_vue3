<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="50px" class="aside">
          <RouterLink class="routerlink" to="/trend" >趋势图</RouterLink>
          <RouterLink class="routerlink" to="/train">训练图</RouterLink>
          <RouterLink class="routerlink" to="/OX">点数图</RouterLink>
      </el-aside>
      <el-container>
        <!-- <el-header class="header"> -->
        <!-- </el-header> -->
        <el-main class="main">
          <div>
            <RouterView />
          </div>
         
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.aside {
  display: flex;
  flex-direction: column;
  background-color: #409eff;
}
.header {
  height: 50px;
  background-color: #409eff;
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
