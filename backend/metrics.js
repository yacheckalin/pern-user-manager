import client from "prom-client";

const register = client.register;

client.collectDefaultMetrics({
  register,
  prefix: "node_",
});

export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
});
