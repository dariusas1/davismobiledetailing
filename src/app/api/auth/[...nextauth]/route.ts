import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Admin from '../../../../../server/models/Admin.js';
import mongoose from 'mongoose';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Connect to MongoDB if not connected
          if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI);
          }

          const admin = await Admin.findOne({ email: credentials?.email, active: true });
          
          if (!admin) {
            throw new Error('Invalid credentials');
          }

          const isValid = await admin.comparePassword(credentials?.password);
          
          if (!isValid) {
            throw new Error('Invalid credentials');
          }

          // Update last login
          admin.lastLogin = new Date();
          await admin.save();

          return {
            id: admin._id.toString(),
            email: admin.email,
            name: admin.name,
            role: admin.role
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  },
  pages: {
    signIn: '/admin/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST }; 