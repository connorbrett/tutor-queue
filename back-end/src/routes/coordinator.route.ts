import { Router } from 'express';
import UserController from '@controllers/users.controller';
import { Routes } from '@interfaces/routes.interface';

class CoordinatorRoute implements Routes {
  public path = '/';
  public router = Router();
  public controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/tutors`, this.controller.getUsers);
    this.router.get(`${this.path}/verify`);
  }
}

export default CoordinatorRoute;
