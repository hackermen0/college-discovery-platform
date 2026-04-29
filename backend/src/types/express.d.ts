declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string | null;
        name: string | null;
        imageUrl: string | null;
      };
    }
  }
}

export {};
