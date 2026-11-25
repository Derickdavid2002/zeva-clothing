
import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"

class IncorrectUsernameError extends CredentialsSignin {
  code = "incorrect_username"
}

class IncorrectPasswordError extends CredentialsSignin {
  code = "incorrect_password"
}

class MissingAdminCredentialsError extends CredentialsSignin {
  code = "admin_credentials_not_configured"
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const validUsername = process.env.ADMIN_USERNAME
        const validPassword = process.env.ADMIN_PASSWORD

        if (!validUsername || !validPassword) {
          throw new MissingAdminCredentialsError()
        }

        if (credentials?.username !== validUsername) {
          throw new IncorrectUsernameError()
        }

        if (credentials?.password !== validPassword) {
          throw new IncorrectPasswordError()
        }

        return {
          id: "1",
          name: process.env.ADMIN_DISPLAY_NAME || "Zeva Admin",
          email: process.env.ADMIN_EMAIL || "",
        }
      },
    }),
  ],

  pages: {
    signIn: "/admin/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
})
