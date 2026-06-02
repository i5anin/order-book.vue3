<template>
  <!-- Таблица с ордерами -->
  <el-table class="order-table" :data="visibleOrders" :show-header="showHeader" border>
    <!-- Цена -->
    <el-table-column>
      <template v-slot="{ row }">
        <div
          :class="{
            highlighted: isOurOrder(row),
            'sell-cell': type === 'sell',
            'buy-cell': type === 'buy'
          }"
        >
          <span v-if="currency === 'btc'">
            <b>{{ formatPrice(row.price) }}</b>
          </span>
        </div>
      </template>
      <template v-slot:header>Цена (BTC)</template>
    </el-table-column>
    <!-- Количество -->
    <el-table-column prop="quantity">
      <template v-slot="{ row }">
        <span v-if="row.quantity !== 0">{{ formatQuantity(row.quantity) }}</span>
      </template>
      <template v-slot:header>Количество</template>
    </el-table-column>
    <!-- Сумма -->
    <el-table-column>
      <template v-slot="{ row }">
        <span v-if="row.price !== 0 && row.quantity !== 0">{{
          formatTotal(row.price, row.quantity)
        }}</span>
      </template>
      <template v-slot:header>Сумма</template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import type { Order } from "@/types";

export default defineComponent({
  props: {
    orders: {
      type: Array as PropType<Order[]>,
      required: true
    },
    type: {
      type: String as PropType<"buy" | "sell">,
      required: true
    },
    ourOrders: {
      type: Array as PropType<Order[]>,
      default: () => []
    },
    currency: {
      type: String,
      required: true
    },
    // Показывать ли шапку таблицы (у нижней таблицы выключаем — колонки те же)
    showHeader: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    visibleOrders(): Order[] {
      return this.calculateVisibleOrders();
    }
  },
  methods: {
    calculateVisibleOrders(): Order[] {
      const filteredOrders = this.orders.filter(
        (order) => order.quantity !== 0 && order.total !== 0
      );
      const centerIndex = Math.floor(filteredOrders.length / 2);
      const start = centerIndex - 10;
      const end = centerIndex + 11; // Центр + по 10 рядов с каждой стороны

      if (this.type === "sell") {
        return filteredOrders.slice().reverse().slice(start, end);
      }
      return filteredOrders.slice(start, end);
    },
    isOurOrder(order: Order): boolean {
      return this.ourOrders.some((ourOrder) => ourOrder.price === order.price);
    },
    formatPrice(price: number): string {
      return price.toFixed(2);
    },
    formatQuantity(quantity: number): string {
      return quantity.toFixed(6);
    },
    formatTotal(price: number, quantity: number): string {
      return (price * quantity).toFixed(2);
    }
  }
});
</script>

<style scoped>
/* Стили для таблицы */
.order-table {
  width: 100%;
}
</style>
