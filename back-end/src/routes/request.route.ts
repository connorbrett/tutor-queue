import { Router } from 'express';
import RequestController from '@controllers/request.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateRequestDto } from '@/dtos/request.dto';
import authMiddleware from '@/middlewares/auth.middleware';

class RequestRoute implements Routes {
  public path = '/request';
  public router = Router();
  public controller = new RequestController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //this.router.delete(`${this.path}`);
    this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(CreateRequestDto, 'body'), this.controller.update);
    this.router.post(`${this.path}`, validationMiddleware(CreateRequestDto, 'body'), this.controller.create);
    this.router.get(`${this.path}`, authMiddleware, this.controller.getQueue);
    this.router.get(`${this.path}current`, authMiddleware, this.controller.getCurrent);
    this.router.post(`${this.path}assign`, authMiddleware, this.controller.assign);
    this.router.get(`${this.path}/:id`, this.controller.getById);
  }
}

export default RequestRoute;
