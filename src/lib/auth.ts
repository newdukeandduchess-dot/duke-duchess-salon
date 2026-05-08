import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDatabase from './mongoose';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'admin@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        // For development/demo: hardcoded admin
        if (credentials.email === 'admin@duke.com' && credentials.password === 'admin123') {
          return {
            id: '507f1f77bcf86cd799439011',
            name: 'Admin User',
            email: 'admin@duke.com',
            role: 'admin',
          } as any;
        }

        await connectToDatabase();
        
        // Real DB Check
        const user = await User.findOne({ email: credentials.email });
        if (user && user.password === credentials.password) { // In production, use bcrypt.compare
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          } as any;
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
};
