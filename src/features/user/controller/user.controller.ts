import { Request } from "express";
import { LeanDocument, ObjectId } from "mongoose";
import { DEFAULT_ORG_PICTURE } from "@constants/defaults";
import { RoleName } from "@constants/permissions";
import { IGNORE_LEAST_CARDINALITY } from "@constants/settings";
import { CreateUserRequest } from "@schemas/user";
import { createMembership } from "../../../service/membership.service";
import { createSettings } from "../../../service/settings.service";
import { createUserDocument, findUser } from "@services/user";
import { Obj, Response } from "@types";
import logger from "@utils/logger";
import { UserDocument } from "@models/user";
import { USER_NOT_FOUND } from "@constants/errors";
import { createOrgDocument } from "@services/org";
import errorObject from "@utils/error";

export async function createUserHandler(
  req: Request<Obj, Obj, CreateUserRequest["body"]>,
  res: Response<LeanDocument<UserDocument & { _id: ObjectId }>>
) {
  try {
    const user = await createUserDocument(req.body);
    const org = await createOrgDocument({
      name: user.name,
      email: user.email,
      personal: true,
      description: "This is my own space and I can invite people in.",
      private: true,
      picture: user.picture || DEFAULT_ORG_PICTURE,
      user: user._id,
    });
    const membership = await createMembership({
      user: user._id,
      org: org._id,
      role: RoleName.OWNER,
    });

    const settings = await createSettings({ user: user._id });

    if (IGNORE_LEAST_CARDINALITY) {
      org.memberships?.push(membership);
      await org.save();
      user.memberships?.push(membership);
    }
    user.settings = settings._id;
    await user.save();

    return res.send({ data: user });
  } catch (error: unknown) {
    logger.error(error);
    return res.status(409).send({ error: errorObject(error) });
  }
}

export async function getMeHandler(req: Request, res: Response<LeanDocument<UserDocument & { _id: ObjectId }>>) {
  try {
    const _id = res.locals.user?._id;
    const user = await findUser({ _id });
    if (!user) {
      throw new Error(USER_NOT_FOUND);
    }
    return res.send({ data: user });
  } catch (error: unknown) {
    logger.error(error);
    return res.status(404).send({ error: errorObject(error) });
  }
}
