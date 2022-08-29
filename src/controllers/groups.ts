import { Request, Response, NextFunction } from "express";
import Group from "../models/Group";
import { catchAsync, HttpError } from "../utils";

export const createGroup = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const group = await Group.create(req.body);
    res.status(200).send({ _id: group._id.toString() });
  }
);

interface IAddUserToGroupRequestBody {
  userIds: string[];
  groupId: string;
}

export const addUsersToGroup = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { userIds, groupId } = req.body as IAddUserToGroupRequestBody;

    const group = await Group.findOne({ _id: groupId });

    if (!group) throw new HttpError(400);
    await Group.updateOne(
      { _id: groupId },
      {
        members: [...group.members, ...userIds],
      }
    );

    res.status(200).send({ _id: group._id });
  }
);

interface IRenameGroupRequestBody {
  groupId: string;
  name: string;
}

export const renameGroup = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { groupId, name } = req.body as IRenameGroupRequestBody;
    const group = await Group.findOne({ _id: groupId });

    if (!group) throw new HttpError(400);
    await Group.updateOne({ _id: groupId }, { name });

    res.status(200).send({ _id: group._id });
  }
);

export const deleteGroup = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { groupId } = req.body;

    await Group.remove({ _id: groupId });
    res.status(201).send();
  }
);
