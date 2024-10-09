import { BadRequestError, ForbiddenError, NotFoundError } from "../helper/errorRespone";
import db from "../dbs/initDatabase";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class AccessService {
    static async SignUp({ email, username, password }: { email: string; username: string; password: string }) {
        if (!email || !username || !password) {
            throw new BadRequestError("Email and username are required");
        }
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            throw new BadRequestError("Username must be alphanumeric and not contains space");
        }
        //const query = 'SELECT * FROM '

        // Check if the user already exists
        const userResult = await db.query("SELECT * FROdsasM users WHERE email = $1", [email]);

        if (userResult.rows.length > 0) {
            throw new BadRequestError("User already exists");
        }

        

        const avatarUrl = "https://avatar.iran.liara.run/username?username=" + username;

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUserResult = await db.query(
            `INSERT INTO users (email, username, password, isAdmin, avatarUrl) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [email, username, hashedPassword, false, avatarUrl]
        );

        const newUser = newUserResult.rows[0];

        console.log("New user", newUser);
        return {
            user: newUser
        };
    }

    static async SignIn({ email, password }: { email: string; password: string }) {
        if (!email || !password) {
            throw new BadRequestError("Email and password are required");
        }

        const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = userResult.rows[0];

        if (!user) {
            throw new NotFoundError("User not found");
        }

        if (await bcrypt.compare(password, user.password)) {
            const accessToken = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET || "secret");
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
