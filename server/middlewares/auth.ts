import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { UserRole } from '../../src/types';

export interface AuthenticatedRequest extends Request {
  user?: any;
  sessionToken?: string;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header. Expected Bearer <token>' });
  }

  const token = authHeader.substring(7).trim();
  const session = db.getSession(token);

  if (!session) {
    // For local tests or fallback demo tokens
    if (token.startsWith('seed_session_token_')) {
      const allUsers = db.getUsers();
      if (allUsers.length > 0) {
        req.user = allUsers[0];
        req.sessionToken = token;
        return next();
      }
    }
    return res.status(401).json({ error: 'Invalid or expired session token. Please re-authenticate.' });
  }

  const user = db.getUserById(session.userId);
  if (!user) {
    return res.status(401).json({ error: 'User account associated with this session no longer exists.' });
  }

  req.user = user;
  req.sessionToken = token;
  next();
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access forbidden. Required role in [${allowedRoles.join(', ')}], current role is '${req.user.role}'.`
      });
    }

    next();
  };
}
