import getDatabaseConnection from "../imports/dbConnection";
import { getPlaceInformation } from "../imports/helpers";

module.exports = async (req, res) => {
  const db = await getDatabaseConnection();
  const SocialConflicts = await db.collection("socialConflicts");

  const socialConflicts = await SocialConflicts.find(
    { location: { $ne: null }, "location.district": { $exists: false } },
    { fields: { _id: 1, "location.place_id": 1 } }
  ).toArray();

  let count = 0;
  for (const socialConflict of socialConflicts) {
    const placeInfo = await getPlaceInformation({
      place_id: socialConflict.location.place_id,
    });

    const { locality, district, province, address_components } = placeInfo;

    SocialConflicts.update(
      {
        _id: socialConflict._id,
      },
      {
        $set: {
          "location.locality": locality,
          "location.district": district,
          "location.province": province,
          "location.address_components": address_components,
        },
      }
    );

    count += 1;
    console.log(count, socialConflict.length);
  }

  console.log(socialConflicts);

  res.status(200).json({ asd: "ok" });
};
