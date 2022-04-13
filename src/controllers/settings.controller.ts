import { Request, Response } from "express";
import { CreateSettingsInput } from "../schema/settings.schema";
import {
  createSettings,
  findAndUpdateSettings,
  findSettingsForUser,
} from "../service/settings.service";
import { findUserDocument } from "../service/user.service";

export async function createOrUpdateSettingsHandler(
  req: Request<{}, {}, CreateSettingsInput["body"]>,
  res: Response
) {
  const _id = res.locals.user._id;
  const user = await findUserDocument({ _id });

  let settings = await findSettingsForUser(_id);

  if (!settings) {
    settings = await createSettings({ ...req.body, user: _id });
    if (settings) {
      user!.settings = settings._id;
      await user?.save();
    }
  } else {
    settings = await findAndUpdateSettings({ user: _id }, req.body, {
      new: true,
    });
  }

  return res.send({ settings });
}

export async function getSettingsHandler(req: Request, res: Response) {
  const _id = res.locals.user._id;
  const user = await findUserDocument({ _id });

  let settings = await findSettingsForUser(_id);
  if (!settings) {
    settings = await createSettings({ user: _id });
    if (settings) {
      user!.settings = settings._id;
      await user?.save();
    }
  }

  return res.send({ settings });
}
