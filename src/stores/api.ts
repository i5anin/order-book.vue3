// Подписка на поток обновлений стакана (order book) через WebSocket Binance.
// Возвращает промис, который резолвится открытым WebSocket-соединением.
export function subscribeToOrderBookStream(): Promise<WebSocket> {
  const baseUrl = "wss://stream.binance.com:9443";
  const requestUrl = `${baseUrl}/ws/btcusdt@depth@1000ms`;

  const socket = new WebSocket(requestUrl);

  return new Promise((resolve, reject) => {
    // Соединение установлено — отдаём сокет наружу
    socket.onopen = () => resolve(socket);
    // Ошибка соединения — отклоняем промис
    socket.onerror = (error) => reject(error);
  });
}
