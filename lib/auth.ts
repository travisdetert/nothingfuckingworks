import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { writeClient, client } from '@/lib/sanity'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      try {
        // Check if user exists in Sanity
        const existingUser = await client.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email: user.email }
        )

        if (!existingUser) {
          // Create new user in Sanity
          await writeClient.create({
            _type: 'user',
            email: user.email,
            name: user.name || '',
            image: user.image || '',
            provider: account?.provider || '',
            providerId: account?.providerAccountId || '',
            createdAt: new Date().toISOString(),
          })
        } else {
          // Update user info
          await writeClient
            .patch(existingUser._id)
            .set({
              name: user.name || existingUser.name,
              image: user.image || existingUser.image,
              lastLogin: new Date().toISOString(),
            })
            .commit()
        }

        return true
      } catch (error) {
        console.error('Sign in error:', error)
        return false
      }
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Fetch user from Sanity to get the _id
        const sanityUser = await client.fetch(
          `*[_type == "user" && email == $email][0]{ _id, name, email, image }`,
          { email: session.user.email }
        )

        if (sanityUser) {
          session.user.id = sanityUser._id
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
}
