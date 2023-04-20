import { omit } from "lodash";
import { FilterQuery } from "mongoose";
import { ServiceOptions } from "@services";
import ProjectModel, { ProjectDocument, ProjectInput } from "@models/project";

export async function createProject(input: ProjectInput) {
  const project = await createProjectDocument(input);

  return omit(project.toJSON(), "secrets");
}
export async function createProjectDocument(input: ProjectInput) {
  const project = await ProjectModel.create(input);

  return project;
}

export async function findProject(query: FilterQuery<ProjectDocument>) {
  return ProjectModel.findOne(query).lean();
}

export async function findProjectDocument(query: FilterQuery<ProjectDocument>) {
  return ProjectModel.findOne(query);
}

export async function findProjects(query: FilterQuery<ProjectDocument>, options: ServiceOptions) {
  return ProjectModel.find(query)
    .skip(options.skip)
    .limit(options.limit)
    .sort(options.sort)
    .populate(options.populate)
    .lean();
}
