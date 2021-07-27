import UserDbInterface from './user';
import { Request } from 'express';

export default interface RequestWithUser extends Request {
    user?: UserDbInterface;
}