import { WebSocket } from 'ws';

interface Message {
	type: string;
	payload: any;
}

class WebSocketClient {
	private socket: WebSocket | null = null;
	private url: string;

	constructor(url: string) {
		this.url = url;
	}

	connect(): void {
		this.socket = new WebSocket(this.url);

		// connected success
		this.socket.on("open", () => {
			console.log("WebSocket connect to", this.url);
			this.sendMessage({ type: "greeting", payload: "Hello Server!" });
		});

		// received messge from server
		this.socket.on("message", (data) => {
			const message: Message = JSON.parse(data.toString());
			console.log("Message from server:", message);
		});

		// connection closed
		this.socket.on("close", () => {
			console.log("WebSocket disconnected.");
		});

		// on error
		this.socket.on("error", (error) => {
			console.error("WebSocket error:", error);
		});
	}

	// send message to server
	sendMessage(message: Message): void {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			const jsonMessage = JSON.stringify(message);
			console.log(typeof jsonMessage);
			console.log(jsonMessage),
				this.socket.send(jsonMessage);
			console.log("Message sent:", jsonMessage);
		} else {
			console.warn("WebSocet is not open. Connot send message.");
		}
	}

	disconnect(): void {
		if (this.socket) {
			this.socket.close();
			console.log("WebSocket connection closed.");
		}
	}
}

const client = new WebSocketClient("ws://localhost:8888/ws");
client.connect();

setTimeout(() => {
	client.sendMessage({ type: "message", payload: "Hello again!" });
}, 5000);

setTimeout(() => {
	client.disconnect();
}, 10000);
