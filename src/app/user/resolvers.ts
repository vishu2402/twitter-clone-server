import axios from 'axios';
import { prismaClient } from '../../clients/db';
import JWTService from '../../services/jwt';
import { User } from '.';

interface GoogleTokenResult {
    iss?: string
    nbf?: string
    aud?: string
    sub?: string
    email?: string
    email_verified?: string
    azp?: string
    name?: string
    picture?: string
    given_name?: string
    family_name?: string
    iat?: string
    exp?: string
    jti?: string
    alg?: string
    kid?: string
    typ?: string
}

const queries = {
    verifyGoogleToken: async(parent: any, { token }:{ token: string }) => {
        const GoogleToken: string = token;
        const GoogleOauthURL = new URL('https://oauth2.googleapis.com/tokeninfo');
        GoogleOauthURL.searchParams.set('id_token', GoogleToken);

        try {
            const { data } = await axios.get<GoogleTokenResult>(GoogleOauthURL.toString());
            
            const user = await prismaClient.user.findUnique({ where: { email: data.email}})

            if(!user) {
                await prismaClient.user.create({
                    data: {
                        email: data.email!,
                        firstName: data.given_name!,
                        lastName: data.family_name,
                        profileImageURL: data.picture,
                    }
                })
            }

            const userIndb = await prismaClient.user.findUnique({ where: { email: data.email }})

            if(!userIndb) throw new Error('User with email not found')
            const userToken = await JWTService.generateTokenForUser(userIndb)
            return userToken
        } catch (error) {
            console.error(error);
        }
    }
};

export const resolvers = { queries };
