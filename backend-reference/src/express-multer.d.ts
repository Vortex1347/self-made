/** Типы для multer. После `npm install` используются @types/multer из node_modules. */
declare module 'multer' {
  import { Request } from 'express';
  export interface File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
  }
  export function diskStorage(options: {
    destination?: (req: Request, file: File, cb: (error: Error | null, destination: string) => void) => void;
    filename?: (req: Request, file: File, cb: (error: Error | null, filename: string) => void) => void;
  }): unknown;
}

declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
      }
    }
  }
}

export {};
