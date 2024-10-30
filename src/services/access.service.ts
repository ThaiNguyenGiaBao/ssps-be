import { BadRequestError, ForbiddenError, NotFoundError } from "../helper/errorRespone";
import db from "../dbs/initDatabase";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../model/user.model";
dotenv.config();

class AccessService {
    static async SignUp({ email, username, password }: { email: string; username: string; password: string }) {
        if (!email || !username || !password) {
            throw new BadRequestError("Email, username, password are required");
        }
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            throw new BadRequestError("Username must be alphanumeric and not contains space");
        }

        // Check if the user already exists
        //const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        const userResult = await userModel.findUserByEmail(email);

        if (userResult) {
            throw new ForbiddenError("User already exists");
        }

        const avatarUrl = "https://avatar.iran.liara.run/username?username=" + username;

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await userModel.createUser({
            email,
            username,
            hashedPassword,
            avatarUrl
        });

        console.log("New user", newUser);

        // Remove the password from the response
        delete newUser.password;
        return {
            user: newUser
        };
    }

    static async SignIn({ email, password }: { email: string; password: string }) {
        if (!email || !password) {
            throw new BadRequestError("Email and password are required");
        }

        const user = await userModel.findUserByEmail(email);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        if (await bcrypt.compare(password, user.password)) {
            const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "secret");
            const { password, ...userWithoutPassword } = user;
            return {
                ...userWithoutPassword,
                accessToken
            };
        } else {
            throw new ForbiddenError("Invalid password");
        }
    }
}

export default AccessService;
