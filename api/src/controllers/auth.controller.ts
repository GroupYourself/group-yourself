import { Request, Response, Router } from 'express';
import { AuthService } from '../services/auth.service';
import { StatusCodes } from 'http-status-codes';


export class AuthController {

   public path = '/auth';
   public router = Router();

   private authService: AuthService;

   constructor(
      services: Map<Object, Object>
   ) {
      this.authService = services.get(AuthService.constructor) as AuthService;

      this.router.post(`${this.path}/register`, this.register);
   }

   /**
    * POST /auth/register
    */
   register = async (req: Request, res: Response) => {
      try {
         await this.authService.register(req.body);
         res.status(StatusCodes.CREATED).send();
      } catch (err) {
         res.status(401).send(err.message);
      }
   }

}