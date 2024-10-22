import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import router from "./router/index";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import path from "path";

const app = express();



// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// init router
app.use("/", router);


// swagger
const swaggerDocument = yaml.load(path.join(__dirname, "../swagger.yml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// handle errors
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error("Not found") as Error & { status: number };
    error.status = 404;
    next(error);
});

app.use((error: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500);
    console.log("Error::", error.message);
    res.json({
        status: "error",
        message: error.message
    });
});

export default app;
