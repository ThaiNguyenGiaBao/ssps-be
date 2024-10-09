import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../helper/errorRespone";
import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
                isAdmin: boolean;
            };
        }
    }
}

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
        throw new UnauthorizedError("Unauthorized");
    }

    jwt.verify(token, process.env.JWT_SECRET || "secret", async (err: jwt.VerifyErrors | null, member: any) => {
        if (err) {
            throw new UnauthorizedError("Unauthorized");
        }

        req.user = member as { id: string; isAdmin: boolean };
        console.log("User::", req.user);
        next();
    });
};

export { authenticateToken };
