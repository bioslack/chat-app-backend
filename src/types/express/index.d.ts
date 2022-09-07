export {};

declare global {
  namespace Express {
    export interface Request {
      id?: string;
      filename?: string;
    }
  }
}
