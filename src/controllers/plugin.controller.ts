import { Request, Response } from "express";
import { IGNORE_LEAST_CARDINALITY } from "../constants/settings";
import { TeamDocument } from "../models/team.model";
import {
  CreatePluginInput,
  GetPluginInput,
  GetPluginsInput,
} from "../schema/plugin.schema";
import {
  createPlugin,
  findPlugin,
  findPlugins,
} from "../service/plugin.service";
import { findTeam, findTeamDocument } from "../service/team.service";

export async function createPluginHandler(
  req: Request<{}, {}, CreatePluginInput["body"]>,
  res: Response
) {
  const user = res.locals.user;

  let team:
    | (TeamDocument & {
        _id: any;
      })
    | null = null;
  if (req.body.team) {
    team = await findTeamDocument({ _id: req.body.team });
  } else {
    team = await findTeamDocument({ autoCreated: true, user: user._id });
  }
  if (!team) {
    return res
      .status(404)
      .send({ error: { message: "Could not find the team" } });
  }

  const plugin = await createPlugin({
    ...req.body,
    user: user._id,
    team: team._id,
  });

  if (IGNORE_LEAST_CARDINALITY) {
    team.plugins?.push(plugin);
    await team.save();
  }

  return res.send({ plugin });
}

export async function getPluginHandler(
  req: Request<GetPluginInput["params"]>,
  res: Response
) {
  const plugin = await findPlugin({ _id: req.params.id });

  if (!plugin) {
    return res.sendStatus(404);
  }

  return res.send({ plugin });
}

export async function getPluginsHandler(
  req: Request<{}, {}, {}, GetPluginsInput["query"]>,
  res: Response
) {
  let populate: string[] | undefined = undefined;
  if (req.query.populate) {
    populate = req.query.populate.split(";");
  }

  let team = null;
  if (req.query.team) {
    team = await findTeam({ _id: req.query.team });
  }
  if (req.query.team && !team) {
    return res
      .status(404)
      .send({ error: { message: "Could not find the team" } });
  }

  // TODO: if user is not a member of this team return only public plugins

  const plugins = await findPlugins(
    {
      ...(team && { team: team._id }),
    },
    {
      populate,
    }
  );
  return res.send({ plugins });
}

export async function getMyPluginsHandler(
  req: Request<{}, {}, {}, GetPluginsInput["query"]>,
  res: Response
) {
  let populate: string[] | undefined = undefined;
  if (req.query.populate) {
    populate = req.query.populate.split(";");
  }

  const user = res.locals.user;

  let team = null;
  if (req.query.team) {
    team = await findTeam({ _id: req.query.team });
    // TODO: check that user is a member of this team
  } else {
    team = await findTeam({ autoCreated: true, user: user._id });
  }
  if (!team) {
    return res
      .status(404)
      .send({ error: { message: "Could not find the team" } });
  }

  const plugins = await findPlugins(
    { team: team._id },
    {
      populate,
    }
  );
  return res.send({ plugins });
}
