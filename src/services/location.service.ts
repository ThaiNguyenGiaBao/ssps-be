import { BadRequestError, NotFoundError } from "../helper/errorRespone";
import LocationModel from "../model/location.model";
import { Location } from "../model/location.model";

class LocationService {
  static async getAllLocation({offset, limit}: {offset: number, limit: number}): Promise<Location[]>  {
    const result = await LocationModel.getAllLocation({offset, limit});
    return result;
  }

  static async getLocation(location: Partial<Location>, {offset, limit}: {offset: number, limit: number}): Promise<Location[]>  {
    if (!(location.buildingname || location.campusname || location.roomnumber || location.id)) 
      throw new BadRequestError(
        "One of four attributes (buildingname, campusname, roomnumber, id) must be given."
      );
    const result = await LocationModel.getLocation(location, {offset, limit});
    return result;
  }

  static async insertLocation(location: Location): Promise<Location>  {
    if (!location.campusname) 
      throw new BadRequestError("campusname must be given.");
    if (!location.buildingname) 
      throw new BadRequestError("buildingname must be given.");
    if (!location.roomnumber) 
      throw new BadRequestError("roomnumber must be given.");
    if (location.campusname !== "LTK" && location.campusname !== "DA") 
      throw new BadRequestError("campusname must be 'LTK' or 'DA'");

    const result = await LocationModel.insertLocation(location.campusname, 
      location.buildingname, location.roomnumber);
    if (result === null) 
      throw new BadRequestError("Cannot insert the given location");
    return result;
  }

  static async deleteLocation(id: string): Promise<Location>  {
    if (!id) 
      throw new BadRequestError("id must be given.");

    const result = await LocationModel.deleteLocation(id);
    if (result === null)
      throw new NotFoundError("Cannot found the location to be deleted.");
    return result;
  }

  static async updateLocation(id: string, data: Partial<Location>): Promise<Location> {
    if (!id) 
      throw new BadRequestError("id must be given.");

    const location: Partial<Location> = {
      ...(data.campusname && { campusname: data.campusname }),
      ...(data.buildingname && { buildingname: data.buildingname }),
      ...(data.roomnumber && { roomnumber: data.roomnumber }),
    };

    if (location.campusname && location.campusname !== "LTK" && location.campusname !== "DA") 
      throw new BadRequestError("campusname must be 'LTK' or 'DA'");

    const result = await LocationModel.updateLocation(id, location);
    if (result === null)
      throw new NotFoundError("Not found the location with ID " + id);
    return result;
  }
};

export default LocationService;