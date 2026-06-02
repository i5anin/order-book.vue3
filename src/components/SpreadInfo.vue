<template>
  <!-- Информация о спреде -->
  <div class="spread" :class="{ red: spread > 0, green: spread < 0 }">
    Spread: <b>{{ formatSpread() }} %</b>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    // Значение спреда — число, обязательное
    spread: {
      type: Number,
      required: true
    }
  },
  methods: {
    // Форматирование значения спреда
    formatSpread(): string {
      return this.spread.toFixed(2);
    }
  }
});
</script>

<style>
/* Стили для компонента информации о спреде */
.spread {
  font-size: 16px;
}
</style>
