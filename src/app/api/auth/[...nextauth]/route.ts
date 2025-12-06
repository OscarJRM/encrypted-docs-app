import NextAuth, { type NextAuthOptions, type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role?: string;
      accessToken?: string;
    };
  }

  interface User {
    id: string;
    role?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "dev-only-nextauth-secret";

export const authConfig: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        cedula: { label: "Cédula", type: "text" },
        password: { label: "Contraseña", type: "password" },
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          let accessToken = null;

          // Scenario 1: Login with Token (from Microsoft Callback)
          if (credentials?.token) {
            accessToken = credentials.token;
          } 
          // Scenario 2: Login with Cedula/Password
          else if (credentials?.cedula && credentials?.password) {
            const response = await axios.post(`${API_URL}/auth/login`, {
              cedula: credentials.cedula,
              password: credentials.password,
            });
            // Handle different possible response structures
            accessToken = response.data?.accessToken || response.data?.access_token || response.data?.token;
          }

          if (!accessToken) {
            return null;
          }

          // Decode JWT to get user info
          // We use Buffer to decode the base64 payload of the JWT
          const parts = accessToken.split('.');
          if (parts.length !== 3) {
            throw new Error("Invalid JWT format");
          }
          
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
          
          console.log("[NextAuth] Decoded JWT payload:", payload);

          const user = {
            id: payload.sub || payload.id || "unknown",
            name: payload.name || payload.username || payload.email || "User",
            email: payload.email || payload.username,
            role: payload.role || "user",
            accessToken: accessToken,
          };

          console.log("[NextAuth] Authorized user:", user);

          return user;

        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
