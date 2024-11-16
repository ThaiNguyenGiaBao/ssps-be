import { BadRequestError, NotFoundError } from "../helper/errorRespone";
import ConfigModel, { Config } from "../model/page.model";
import PermitedFileModel, { PermitedFile } from "../model/permitedFile.model";

export class ConfigService {
  static async getPermitedFile(): Promise<PermitedFile[]> {
    const permitedFiles: PermitedFile[] = await PermitedFileModel.findAllPermitedFiles();
    return permitedFiles
  }

  static async addPermitedFile(permitedFile: PermitedFile): Promise<PermitedFile> {
    if (permitedFile.type === undefined) {
      throw new BadRequestError("Permited File Type must be neither null nor undefined")
    }
    const result = await PermitedFileModel.addPermitedFile(permitedFile);
    if (result === null) {
      throw new BadRequestError("Cannot add this file type!");
    }
    return result;
  } 

  static async updatePermitedFile(type: string, data: Partial<PermitedFile>) {
    if (!type) 
      throw new BadRequestError("File type is required.");

    const values = Object.values(data);
    values.forEach(value => {
      if (!value)
        throw new BadRequestError("Updated value cannot be null | undefined!")
    });

    const result = await PermitedFileModel.updatePermitedFile(type, data);
    if (result === null)
      throw new BadRequestError("Cannot update this permited file config.");
    return result;
  }

  static async deletePermitedFile(type: string): Promise<PermitedFile> {
    const result = await PermitedFileModel.deletePermitedFile(type);
    if (result === null) 
      throw new NotFoundError("Cannot find that permited file type!");
    return result;
  }

  static async getPageConfig(): Promise<Config> {
    const config: Config | null = await ConfigModel.getPageConfig();
    if (config === null) {
      throw new NotFoundError("Configuration not found!");
    }
    return config;
  }

  static async updatePageConfig(data: Partial<Config>): Promise<Config> {
    if (data.dategivenpage === undefined && data.defaultnumpage === undefined) 
      throw new BadRequestError("'dategivenpage' or 'defaultNumPage' must be given.");
    if (data.dategivenpage && isNaN(Date.parse(data.dategivenpage)))
      throw new BadRequestError("Not valid date format!");

    const result = await ConfigModel.updatePageConfig(data);
    if (result === null) 
      throw new BadRequestError("Update unsuccessfully");
    return result;
  }
}