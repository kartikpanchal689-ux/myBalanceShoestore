const SERVER_URL = "https://mybalanceshoestore.onrender.com";
let eventSource = null;

export function getSocket(userId, onEvent) {
  if (eventSource) eventSource.close();

  eventSource = new EventSource(`${SERVER_URL}/api/sync/${userId}`);

  eventSource.onmessage = (e) => {
    const event = JSON.parse(e.data);
    onEvent(event);
  };

  eventSource.onerror = () => {
    console.log("SSE connection error, retrying...");
  };
}

export function disconnectSocket() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
}