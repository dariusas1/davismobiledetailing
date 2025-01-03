import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Admin from '../../server/models/Admin.js';
import mongoose from 'mongoose';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  },
  pages: {
    signIn: '/admin/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Connect to MongoDB if not connected
          if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI || '');
          }

          const admin = await Admin.findOne({ 
            email: credentials.email,
            active: true 
          });

          if (!admin) {
            return null;
          }

          const isValid = await admin.comparePassword(credentials.password);

          if (!isValid) {
            return null;
          }

          // Update last login
          admin.lastLogin = new Date();
          await admin.save();

          return {
            id: admin._id.toString(),
            email: admin.email,
            name: admin.name,
            role: admin.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
        }
      };
    }
  }
}; 