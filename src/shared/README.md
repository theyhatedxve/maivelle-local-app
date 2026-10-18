# Shared

`types/` holds cross-layer contracts; `utils/` holds pure helpers such as money
arithmetic. These modules may be used by the frontend and local backend.

Do not import frontend components, React hooks, backend services, or database
connections here. Avoid platform side effects and secret logging.

See [the architecture guide](../../docs/architecture.md).
