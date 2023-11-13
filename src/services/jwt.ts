import JWT from 'jsonwebtoken'
import { prismaClient } from "../clients/db";
import { Token } from 'graphql';
import { User } from '@prisma/client';

const JWT_Secret = '$fuhjcb@8769'

class JWTService {
    public static generateTokenForUser(user: User) {
        const payload = {
            id: user?.id,
            email: user?.email,
        }

        const token = JWT.sign(payload, JWT_Secret)
        return token
    }
}

export default JWTService