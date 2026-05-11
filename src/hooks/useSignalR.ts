import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

export function useSignalR(hubUrl: string) {
  const connection = useRef<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => localStorage.getItem("tns_access_token") || "",
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    conn.onclose(() => setIsConnected(false));
    conn.onreconnecting(() => setIsConnected(false));
    conn.onreconnected(() => setIsConnected(true));

    const start = async () => {
      try {
        await conn.start();
        setIsConnected(true);
        console.log("SignalR Connected to", hubUrl);
      } catch (err) {
        console.error("SignalR Connection Error:", err);
        setTimeout(start, 5000);
      }
    };

    connection.current = conn;
    start();

    return () => {
      conn.stop();
    };
  }, [hubUrl]);

  return { connection: connection.current, isConnected };
}
