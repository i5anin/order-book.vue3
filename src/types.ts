// Ордер в стакане: цена и количество (total опционален — приходит не всегда)
export interface Order {
  price: number;
  quantity: number;
  total?: number;
}

// Формат сообщения потока глубины рынка Binance (depth stream)
export interface DepthMessage {
  // a — асики (предложения на продажу): массив пар [цена, количество]
  a: [string, string][];
  // b — биды (предложения на покупку): массив пар [цена, количество]
  b: [string, string][];
}
