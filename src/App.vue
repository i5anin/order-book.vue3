<template>
  <OrderBook />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import OrderBook from "@/components/OrderBook.vue";

export default defineComponent({
  name: "App",
  components: {
    OrderBook
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
}

.el-card {
  --el-card-padding: 8px !important;
}

.el-table .el-table__cell {
  padding: 2px 0 !important;
}

/* Цвета из палитры Element Plus — мягче чистых red/green/yellow и тема-зависимы */
.red,
.sell-cell {
  color: var(--el-color-danger, #f56c6c); /* мягкий коралловый — продажа */
}

.green,
.buy-cell {
  color: var(--el-color-success, #67c23a); /* мягкий зелёный — покупка */
}

.yellow,
.highlighted {
  color: var(--el-color-warning, #e6a23c); /* янтарный вместо неонового жёлтого — наши ордера */
}
</style>
