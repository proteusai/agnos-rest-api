import { Request, Response } from "express";
import { CreateSettingsInput } from "../schema/settings.schema";
import { createSettingsDocument, findAndUpdateSettings, findOneSetOfSettings } from "../service/settings.service";
import { findUserDocument } from "@services/user";
import { Obj } from "@types";

export async function createOrUpdateSettingsHandler(
  req: Request<Obj, Obj, CreateSettingsInput["body"]>,
  res: Response
) {
  const _id = res.locals.user._id;
  const user = await findUserDocument({ _id });

  let settings = await findOneSetOfSettings({ user: _id });

  if (!settings) {
    settings = await createSettingsDocument({ ...req.body, user: _id });
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

  let settings = await findOneSetOfSettings({ user: _id });
  if (!settings) {
    settings = await createSettingsDocument({ user: _id });
    if (settings) {
      user!.settings = settings._id;
      await user?.save();
    }
  }

  return res.send({ settings });
}
