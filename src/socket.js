const SERVER_URL = "https://mybalanceshoestore.onrender.com";
let eventSource = null;
let reconnectTimer = null;

export function getSocket(userId, onEvent) {
  if (eventSource) eventSource.close();

  function connect() {
    eventSource = new EventSource(`${SERVER_URL}/api/sync/${userId}`);

    eventSource.onmessage = (e) => {
      const event = JSON.parse(e.data);
      onEvent(event);
    };

    eventSource.onerror = () => {
      console.log("SSE disconnected, reconnecting in 3s...");
      eventSource.close();
      reconnectTimer = setTimeout(connect, 3000); // auto reconnect
    };
  }

  connect();
}

export function disconnectSocket() {
  if (reconnectTimer) clearTimeout(reconnectTimer);
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
}