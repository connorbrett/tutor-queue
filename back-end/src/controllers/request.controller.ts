import { NextFunction, Request, Response } from 'express';
import { Request as Model } from '@interfaces/request.interface';
import RequestService from '@services/request.service';
import { CreateRequestDto } from '@/dtos/request.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';

class RequestController {
  public service = new RequestService();

  public assign = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const data: Model = await this.service.assign(req.params.id, req.user._id);

      res.status(200).json({ data, message: 'getCurrent' });
    } catch (error) {
      next(error);
    }
  };

  public getCurrent = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const data: Model = await this.service.getCurrent(req.user._id);

      res.status(200).json({ data, message: 'getCurrent' });
    } catch (error) {
      next(error);
    }
  };

  public getQueue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: Model[] = await this.service.getQueue();

      res.status(200).json({ data, message: 'queue' });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data: Model = await this.service.findById(id);

      res.status(200).json({ data, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const form: CreateRequestDto = req.body;
      const data: Model = await this.service.create(form);

      res.status(201).json({ data, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const form: CreateRequestDto = req.body;
      const data: Model = await this.service.update(id, form);

      res.status(200).json({ data, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const data: Model = await this.service.delete(id);

      res.status(200).json({ data, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default RequestController;
