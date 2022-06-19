import { Request, Response } from "express";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { IGNORE_LEAST_CARDINALITY } from "../constants/settings";
import {
  CreatePluginVersionInput,
  GetPluginVersionInput,
  GetPluginVersionsInput,
  UpdatePluginVersionInput,
} from "../schema/pluginVersion.schema";
import { findPlugin, findPluginDocument } from "../service/plugin.service";
import {
  createPluginVersion,
  findAndUpdatePluginVersion,
  findPluginVersion,
  findPluginVersions,
} from "../service/pluginVersion.service";

export async function createPluginVersionHandler(
  req: Request<{}, {}, CreatePluginVersionInput["body"]>,
  res: Response
) {
  const user = res.locals.user;

  const plugin = await findPluginDocument({ _id: req.body.plugin });
  if (!plugin) {
    return res
      .status(404)
      .send({ error: { message: "Could not find the plugin" } });
  }

  // TODO: check that user has permission in the plugin.team

  const _id = slugify(
    `${plugin.name} ${req.body.name} ${Date.now()} ${nanoid()}`,
    { lower: true, strict: true }
  );

  const pluginVersion = await createPluginVersion({
    _id,
    ...req.body,
    user: user._id,
    team: plugin.team,
  });

  if (IGNORE_LEAST_CARDINALITY) {
    plugin.versions?.push(pluginVersion);
    await plugin.save();
  }

  return res.send({ pluginVersion });
}

export async function getPluginVersionHandler(
  req: Request<GetPluginVersionInput["params"]>,
  res: Response
) {
  const pluginVersion = await findPluginVersion({ _id: req.params.id });

  if (!pluginVersion) {
    return res.sendStatus(404);
  }

  return res.send({ pluginVersion });
}

export async function getPluginVersionsHandler(
  req: Request<{}, {}, {}, GetPluginVersionsInput["query"]>,
  res: Response
) {
  let populate: string[] | undefined = undefined;
  if (req.query.populate) {
    populate = req.query.populate.split(";");
  }

  let plugin = null;
  if (req.query.plugin) {
    plugin = await findPlugin({ _id: req.query.plugin });
  }
  if (req.query.plugin && !plugin) {
    return res
      .status(404)
      .send({ error: { message: "Could not find the plugin" } });
  }

  // TODO: if user is not a member of plugin.team return only published plugin versions

  const pluginVersions = await findPluginVersions(
    { ...(plugin && { plugin: plugin._id }) },
    { populate }
  );
  return res.send({ pluginVersions });
}

export async function updatePluginVersionHandler(
  req: Request<
    UpdatePluginVersionInput["params"],
    {},
    UpdatePluginVersionInput["body"]
  >,
  res: Response
) {
  const _id = req.params.id;
  const update = req.body;

  const pluginVer = await findPluginVersion({ _id });

  if (!pluginVer) {
    return res.sendStatus(404);
  }
  if (pluginVer.published) {
    return res.status(403).send({
      error: { message: "Published plugin versions cannot be updated" },
    });
  }

  // TODO: ensure that the user has permission to update this plugin ver

  const pluginVersion = await findAndUpdatePluginVersion({ _id }, update, {
    new: true,
  });

  return res.send({ pluginVersion });
}
