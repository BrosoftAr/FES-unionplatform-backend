import { NowRequest, NowResponse } from "@now/node";
import { ObjectId, FilterQuery } from "mongodb";
import {
  allowCors,
  onlyLoggedIn,
  getPlaceInformation,
} from "../imports/helpers";
import getDatabaseConnection from "../imports/dbConnection";
import {
  SocialConflict,
  SocialConflictProjection,
} from "../../client/src/shared/SocialConflict";

module.exports = async (req: NowRequest, res: NowResponse) => {
  try {
    allowCors({ res });
    const requestedUrl = req.url;

    const db = await getDatabaseConnection();
    const SocialConflicts = await db.collection("socialConflicts");
    const Categories = await db.collection("categories");

    // LIST
    if (requestedUrl === "/api/socialConflicts/list") {
      const { searchFilter } = req.body;
      const selector: FilterQuery<SocialConflict> = { isActive: true };
      if (searchFilter) {
        selector.title = {
          $regex: new RegExp(searchFilter, "i"),
        };
      }

      const projection: SocialConflictProjection = {
        isActive: 0,
      };
      const socialConflicts: SocialConflict[] = await SocialConflicts.find(
        selector,
        {
          projection,
          sort: {
            createdAt: -1,
          },
        }
      ).toArray();

      res.status(200).json({ socialConflicts });
      return;
    }

    await onlyLoggedIn({ req, res });

    // ADD
    if (requestedUrl === "/api/socialConflicts/add") {
      const { socialConflictValues: newSocialConflict } = req.body;

      const { place_id } = newSocialConflict.location;

      const placeInfo = await getPlaceInformation({ place_id });

      const {
        insertedId: newSocialConflictId,
      } = await SocialConflicts.insertOne({
        ...newSocialConflict,
        location: {
          ...newSocialConflict.location,
          ...placeInfo,
        },
        isActive: true,
        createdAt: new Date(),
      });

      res
        .status(200)
        .json({ newSocialConflictId })
        .end();
    }

    // EDIT
    else if (requestedUrl === "/api/socialConflicts/edit") {
      const { socialConflictId, socialConflictValues } = req.body;
      if (typeof socialConflictId !== "string") {
        return;
      }

      const { modifiedCount } = await SocialConflicts.updateOne(
        { _id: new ObjectId(socialConflictId) },
        {
          $set: {
            ...socialConflictValues,
            updatedAt: new Date(),
          },
        }
      );

      res
        .status(200)
        .json({ modifiedCount })
        .end();
    }

    // DETAIL
    else if (requestedUrl === "/api/socialConflicts/detail") {
      const { socialConflictId } = req.body;
      if (typeof socialConflictId !== "string") {
        return;
      }

      const socialConflict = await SocialConflicts.findOne({
        _id: new ObjectId(socialConflictId),
      });

      res
        .status(200)
        .json({ socialConflict })
        .end();
    }

    // REMOVE
    else if (requestedUrl === "/api/socialConflicts/remove") {
      const { socialConflictId } = req.body;
      if (typeof socialConflictId !== "string") {
        return;
      }

      const { modifiedCount } = await SocialConflicts.updateOne(
        { _id: new ObjectId(socialConflictId) },
        {
          $set: {
            isActive: false,
            updatedAt: new Date(),
          },
        }
      );

      res
        .status(200)
        .json({ modifiedCount })
        .end();
    }
  } catch (e) {
    console.log(e);
  }
};
