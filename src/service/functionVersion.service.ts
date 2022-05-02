// https://github.com/request/request/issues/3143

import { FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
// import vm from "vm";
import { VM } from "vm2";
import axios from "axios";
import request from "request";
import requireFromUrl from "require-from-url";
import { ServiceOptions } from ".";
import FunctionVersionModel, {
  FunctionVersionDocument,
  FunctionVersionInput,
} from "../models/functionVersion.model";
import { findUser } from "./user.service";
import { PermissionScope } from "../constants/permissions";
import { createLog } from "./log.service";
import { Env } from "../constants/env";
import { DataType } from "../constants/log";
import { LogType } from "../constants/log";

const defaultPopulate = ["function", "team", "user"];

export async function createFunctionVersion(input: FunctionVersionInput) {
  const functionVersion = await createFunctionVersionDocument(input);

  return functionVersion.toJSON();
}
export async function createFunctionVersionDocument(
  input: FunctionVersionInput
) {
  const functionVersion = await FunctionVersionModel.create(input);

  return functionVersion;
}

export async function findFunctionVersion(
  query: FilterQuery<FunctionVersionDocument>
) {
  return FunctionVersionModel.findOne(query).lean();
}

export async function findFunctionVersions(
  query: FilterQuery<FunctionVersionDocument>,
  options?: ServiceOptions
) {
  return FunctionVersionModel.find(query)
    .populate(options?.populate || defaultPopulate)
    .sort({ createdAt: -1 })
    .lean();
}

export async function findAndUpdateFunctionVersion(
  query: FilterQuery<FunctionVersionDocument>,
  update: UpdateQuery<FunctionVersionDocument>,
  options: QueryOptions
) {
  return FunctionVersionModel.findOneAndUpdate(query, update, options);
}

export interface RunOptions {
  test?: boolean;
  args: {
    form?: object;
    user: {
      _id: string;
      accessToken: string;
    };
  };
}

export async function runFunctionVersion(
  query: FilterQuery<FunctionVersionDocument>,
  options: RunOptions
) {
  const functionVersion = await FunctionVersionModel.findOne(query)
    .populate(["function", "team"])
    .lean();

  if (!functionVersion) {
    throw new Error("Cannot find function version");
  }

  let testForm = undefined;
  const testData = functionVersion.testData;
  if (testData) {
    const testDataJson = JSON.parse(testData);
    testForm = testDataJson["form"];
  }

  const user = await findUser({ _id: options.args.user._id });

  const sandbox = {
    axios,
    request,
    requireFromUrl,
    agnos: {
      form: options.args.form || options.test ? testForm : undefined,
      function: {
        _id: functionVersion.function._id,
        name: functionVersion.function.name,
        secrets: functionVersion.function.secrets || {},
        team: {
          _id: functionVersion.team._id,
          name: functionVersion.team.name,
        },
        version: {
          _id: functionVersion._id,
          name: functionVersion.name,
          scopes: functionVersion.scopes,
          secrets: functionVersion.secrets || {},
        },
      },
      secrets: {
        ...(functionVersion.function.secrets || {}),
        ...(functionVersion.secrets || {}),
      },
      ...(functionVersion.scopes &&
        functionVersion.scopes.includes(PermissionScope["READ:USER"]) && {
          user: {
            email: user?.email,
            name: user?.name,
            picture: user?.picture,
          },
        }),
      // design
      // environment
    },
    process: {
      env: {
        NODE_ENV: options.test ? "test" : "production",
      },
    },
    console: {//====================
      log: (data: any) => {
        let dataType = DataType.OBJECT;
        switch (typeof data) {
          case "boolean":
            dataType = DataType.BOOLEAN;
            break;
          case "bigint":
          case "number":
            dataType = DataType.NUMBER;
            break;
          case "string":
            dataType = DataType.STRING;
            break;
          case "undefined":
            dataType = DataType.UNDEFINED;
            break;
        }
        createLog(
          {
            data,
            dataType,
            env: options.test ? Env.TEST : Env.PRODUCTION,
            meta: {
              function: functionVersion.function._id,
              functionName: functionVersion.function.name,
              version: functionVersion._id,
              versionName: functionVersion.name,
              user: user?._id,
            },
            source: functionVersion.function._id,
            type: LogType.INFO,
          },
          { accessToken: options.args.user.accessToken }
        );
      },
    },
  };
  const vm = new VM({
    sandbox,
    timeout: 10000,
  });
  const result = vm.run(functionVersion.code);

  // const script = new vm.Script(`(function(){${functionVersion.code}})()`);
  //   const script = new vm.Script(functionVersion.code);
  //   const context = vm.createContext(sandbox);
  //   const result = script.runInContext(context);

  return result;
}
