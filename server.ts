import app from "./src/app";

import configEnv from "./src/configs/configEnv";
const port = configEnv.app.port;

const env = process.env.NODE_ENV || "dev";

const server = app.listen(port, () => {
    console.log(`Environment: ${env}\nServer is running on port ${port}`);
});

process.on("SIGINT", () => {
    server.close(() => console.log("Server has been disconnected"));
});
