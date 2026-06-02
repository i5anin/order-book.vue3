<template>
  <!-- Контейнер книги ордеров -->
  <div class="order-book dark">
    <!-- Текущая цена и спред — одной строкой -->
    <el-card v-if="hasSpread" class="summary">
      <span class="summary__coin" aria-hidden="true">₿</span>
      <span class="summary__pair">BTC/USDT</span>
      <b class="summary__price">{{ formattedCoinPrice }}</b>
      <SpreadInfo :spread="spread" />
    </el-card>

    <!-- Спиннер загрузки -->
    <loading-spinner :loading="isLoading">
      <!-- Продажи (asks) — с шапкой -->
      <OrderTable
        :orders="asks"
        type="sell"
        :ourOrders="ourOrders"
        :currency="selectedCurrency"
      />
      <!-- Покупки (bids) — без повторной шапки, колонки те же -->
      <OrderTable
        :orders="bids"
        type="buy"
        :ourOrders="ourOrders"
        :currency="selectedCurrency"
        :show-header="false"
      />
    </loading-spinner>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "pinia";

import OrderTable from "@/components/OrderTable.vue";
import SpreadInfo from "@/components/SpreadInfo.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useOrderBookStore } from "@/stores/orderBook";

export default defineComponent({
  components: {
    OrderTable,
    SpreadInfo,
    LoadingSpinner
  },
  data() {
    return {
      selectedCurrency: "btc"
    };
  },
  computed: {
    // Стейт и геттеры стора (Pinia mapState отдаёт и то, и другое)
    ...mapState(useOrderBookStore, [
      "isLoading",
      "hasSpread",
      "spread",
      "asks",
      "bids",
      "ourOrders",
      "formattedCoinPrice"
    ])
  },
  created() {
    // Подписка на поток данных о книге ордеров
    this.subscribeToOrderBookStream();
  },
  methods: {
    ...mapActions(useOrderBookStore, ["subscribeToOrderBookStream"])
  }
});
</script>

<style scoped>
.summary {
  margin-bottom: 6px;
}

/* Цена и спред в одну центрированную строку */
.summary :deep(.el-card__body) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

/* Иконка монеты BTC — оранжевый бейдж, как на Binance/Bybit */
.summary__coin {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #f7931a;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  margin-right: -4px;
}

.summary__pair {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  letter-spacing: 0.04em;
}

.summary__price {
  font-size: 18px;
}
</style>
