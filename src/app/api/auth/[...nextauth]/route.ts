  import NextAuth, { type NextAuthOptions } from "next-auth";
  import AzureAD from "next-auth/providers/azure-ad";
  import CredentialsProvider from "next-auth/providers/credentials";

  export const authConfig: NextAuthOptions = {
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

          if (credentials.email === "demo@example.com" && credentials.password === "demo123") {
            return {
              id: "1",
              email: "demo@example.com",
              name: "Demo User",
            };
          }

          return null;
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
          token.id = user.id;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string;
        }
        return session;
      },
    },
  };

  const handler = NextAuth(authConfig);

  export { handler as GET, handler as POST };
