  import NextAuth, { type NextAuthOptions, type DefaultSession } from "next-auth";
  import AzureAD from "next-auth/providers/azure-ad";
  import CredentialsProvider from "next-auth/providers/credentials";

  declare module "next-auth" {
    interface Session extends DefaultSession {
      user: DefaultSession["user"] & {
        id: string;
        role?: string;
      };
    }
  }

  declare module "next-auth/jwt" {
    interface JWT {
      id?: string;
      role?: string;
    }
  }

  type TestUser = {
    id: string;
    email: string;
    password: string;
    name: string;
    role: "admin" | "user";
  };

  const TEST_USERS: TestUser[] = [
    {
      id: "admin",
      email: "admin@example.com",
      password: "admin123",
      name: "Administrador",
      role: "admin",
    },
    {
      id: "user",
      email: "user@example.com",
      password: "user123",
      name: "Cliente",
      role: "user",
    },
  ];

  const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ?? "dev-only-nextauth-secret";

  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = NEXTAUTH_SECRET;
  }

  if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === "development") {
    process.env.NEXTAUTH_URL = "http://localhost:3000";
  }

  export const authConfig: NextAuthOptions = {
    secret: NEXTAUTH_SECRET,
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const normalizedEmail = credentials.email.toLowerCase();

          const user = TEST_USERS.find(
            ({ email, password }) => email === normalizedEmail && password === credentials.password,
          );

          if (!user) {
            return null;
          }

          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        },
      }),
      ...(process.env.AZURE_AD_CLIENT_ID && 
          process.env.AZURE_AD_CLIENT_SECRET && 
          process.env.AZURE_AD_TENANT_ID
        ? [
            AzureAD({
              clientId: process.env.AZURE_AD_CLIENT_ID,
              clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
              tenantId: process.env.AZURE_AD_TENANT_ID,
            }),
          ]
        : []),
    ],
    session: { strategy: "jwt" },
    pages: {
      signIn: "/login",
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = (user as TestUser).id;
          token.role = (user as TestUser).role;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string;
          (session.user as typeof session.user & { role?: string }).role = token.role as string;
        }
        return session;
      },
    },
  };

  const handler = NextAuth(authConfig);

  export { handler as GET, handler as POST };
