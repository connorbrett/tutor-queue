import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import requestModel from '@/models/request.model';
import { Request, Status } from '@/interfaces/request.interface';
import { CreateRequestDto } from '@/dtos/request.dto';

class RequestService {
  public requests = requestModel;

  public async assign(id: string, userId: string): Promise<Request> {
    const req: Request = await this.requests.findByIdAndUpdate(id, { status: Status.InProgress, tutor: userId });
    if (!req) throw new HttpException(404, 'Id not recognized');
    return req;
  }

  public async getCurrent(userId: string): Promise<Request> {
    const current: Request = await this.requests.findOne({ tutor: userId, status: Status.InProgress });
    return current;
  }

  public async findAll(): Promise<Request[]> {
    const users: Request[] = await this.requests.find();
    return users;
  }

  public async getQueue(): Promise<Request[]> {
    const users: Request[] = await this.requests.find({ status: Status.Waiting });
    return users;
  }

  public async findById(id: string): Promise<Request> {
    if (isEmpty(id)) throw new HttpException(400, 'Need to provide an id');

    const found: Request = await this.requests.findOne({ _id: id });
    if (!found) throw new HttpException(409, 'No request with that ID');

    return found;
  }

  public async findByEmail(email: string): Promise<Request> {
    if (isEmpty(email)) throw new HttpException(400, 'Need to provide an email');

    const found: Request = await this.requests.findOne({ email });
    if (!found) throw new HttpException(409, 'No request with that email');

    return found;
  }

  public async create(data: CreateRequestDto): Promise<Request> {
    if (isEmpty(data)) throw new HttpException(400, "You're not userData");

    const found: Request = await this.requests.findOne({ email: data.email });
    if (found) throw new HttpException(409, `You're email ${data.email} already exists`);

    // validation about data.

    const created: Request = await this.requests.create(data);

    return created;
  }

  public async update(id: string, data: CreateRequestDto): Promise<Request> {
    if (isEmpty(data)) throw new HttpException(400, "You're not userData");

    const updated: Request = await this.requests.findByIdAndUpdate(id, { data });
    if (!updated) throw new HttpException(409, "You're not user");

    return updated;
  }

  public async delete(id: string): Promise<Request> {
    const deleteUserById: Request = await this.requests.findByIdAndDelete(id);
    if (!deleteUserById) throw new HttpException(409, "You're not user");

    return deleteUserById;
  }
}

export default RequestService;
