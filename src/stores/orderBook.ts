import { defineStore } from "pinia";

import { subscribeToOrderBookStream } from "@/stores/api";
import type { DepthMessage, Order } from "@/types";

interface OrderBookState {
  isLoading: boolean;
  asks: Order[];
  bids: Order[];
  ourOrders: Order[];
  currentCoinPrice: number;
}

export const useOrderBookStore = defineStore("orderBook", {
  state: (): OrderBookState => ({
    isLoading: true, // Флаг загрузки данных
    asks: [], // Предложения на продажу
    bids: [], // Предложения на покупку
    ourOrders: [], // Наши ордера
    currentCoinPrice: 0 // Текущая цена монеты
  }),

  getters: {
    // Есть ли спред (заполнены обе стороны стакана)
    hasSpread: (state): boolean => state.bids.length > 0 && state.asks.length > 0,

    // Разница между лучшим аском и лучшим бидом
    spread(state): number {
      if (!this.hasSpread) {
        return 0;
      }
      const bestBid = state.bids[0].price;
      const bestAsk = state.asks[0].price;
      return bestAsk - bestBid;
    },

    // Текущая цена монеты, округлённая до двух знаков (для отображения)
    formattedCoinPrice: (state): string => state.currentCoinPrice.toFixed(2)
  },

  actions: {
    async subscribeToOrderBookStream() {
      try {
        // Подписываемся на поток событий стакана
        const socket = await subscribeToOrderBookStream();
        this.isLoading = false; // Соединение установлено — убираем загрузку

        socket.onmessage = (event: MessageEvent) => {
          const data: DepthMessage = JSON.parse(event.data);

          this.asks = data.a.map((ask) => ({
            price: parseFloat(ask[0]),
            quantity: parseFloat(ask[1])
          }));
          this.bids = data.b.map((bid) => ({
            price: parseFloat(bid[0]),
            quantity: parseFloat(bid[1])
          }));

          if (this.bids.length > 0) {
            this.currentCoinPrice = this.bids[0].price;
          }
        };
      } catch (error) {
        console.error("Failed to subscribe to order book stream:", error);
        this.isLoading = false; // В случае ошибки тоже убираем загрузку
      }
    }
  }
});
