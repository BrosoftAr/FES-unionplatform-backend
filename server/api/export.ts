import { NowRequest, NowResponse } from "@now/node";
import { allowCors, onlyLoggedIn } from "../imports/helpers";
import getDatabaseConnection from "../imports/dbConnection";
import moment from "moment";
import { SocialConflict } from "../../client/src/shared/SocialConflict";
import { Category } from "../types/Category";
import { motivesLabelsEnum } from "../../client/src/shared/motives";
import { contractTypeLabelsEnum } from "../../client/src/shared/contractTypeEnum";
import { actionTypeLabelsEnum } from "../../client/src/shared/actionType";
import { antagonistsLabelsEnum } from "../../client/src/shared/antagonists";
import { organizationTypeLabelEnum } from "../../client/src/shared/organizationType";

const stringify = require("csv-stringify/lib/sync");

module.exports = allowCors(async (req: NowRequest, res: NowResponse) => {
  try {
    const requestedUrl = req.url;

    const db = await getDatabaseConnection();
    const SocialConflicts = await db.collection("socialConflicts");
    const Categories = await db.collection("categories");

    await onlyLoggedIn({ req, res });

    // ACCIONES
    if (requestedUrl === "/api/export/actions") {
      const socialConflicts: SocialConflict[] = await SocialConflicts.find({
        isActive: true,
      }).toArray();
      const categories: Category[] = await Categories.find({}).toArray();

      const csvData = [
        [
          "Empresa/Ente",
          "Sector",
          "Provincia",
          "Distrito",
          "Lugar",
          "Principal demanda",
          "Otras demandas",
          "Tipo de contrato",
          "Resolución del conflicto",
          "Fecha accion",
          "Medidas",
          "Contra quien",
          "Duracion de la medida",
          "Cantidad de participantes",
          "Tipo de organización convocante",
          "Nombre de organización",
          "Rol del sindicato",
          "Apoyo sectores",
          "Choques con la policia",
          "Presencia de la izquierda",
          "Link 1",
          "Link 2",
          "Observaciones",
        ],
      ];
      socialConflicts.forEach((socialConflict) => {
        const {
          title,
          location,
          sectorId,
          mainDemand,
          otherDemands,
          contractType,
          resolution,
          actions,
          observations,
        } = socialConflict;

        let categoryName = "";
        if (sectorId) {
          const category = categories.find(
            (category) => category._id.toString() === sectorId.toString()
          );
          if (category) {
            categoryName = category.title;
          }
        }

        actions.forEach((action) => {
          csvData.push([
            title, //"Empresa/Ente"
            categoryName, //Sector
            location && location.province
              ? location.province.long_name.replace("Province", "").trim()
              : "", //Provincia
            location && location.district ? location.district.long_name : "", //Distrito
            location ? location.description : "", //Lugar
            motivesLabelsEnum[mainDemand], //Principal demanda
            otherDemands &&
              otherDemands
                .map((demand) => motivesLabelsEnum[demand])
                .join(", "), // Otras demandas
            contractType &&
              contractType
                .map((contractType) => contractTypeLabelsEnum[contractType])
                .join(", "), // Tipo de contrato
            resolution, // "Resolución del conflicto",
            action.date && moment(action.date).format("DD/MM/YYYY"), // "Fecha accion",
            action.actionTypeIds &&
              action.actionTypeIds
                .map((actionType) => actionTypeLabelsEnum[actionType])
                .join(", "), // "Medidas",
            action.antagonists &&
              action.antagonists
                .map((antagonist) => antagonistsLabelsEnum[antagonist])
                .join(", "), // "Contra quien",
            action.actionDuration, // "Duracion de la medida",
            action.actionParticipants && action.actionParticipants.toString(), // "Cantidad de participantes",
            action.organizationTypes &&
              action.organizationTypes
                .map(
                  (organizationType) =>
                    organizationTypeLabelEnum[organizationType]
                )
                .join(", "), // "Tipo de organización convocante",
            action.organizationName, // "Nombre de organización",
            action.unionRole, // "Rol del sindicato",
            action.supportedBy, // "Apoyo sectores",
            action.clashes ? "Si" : "No", // "Choques con la policia",
            action.leftPresent ? "Si" : "No", // "Presencia de la izquierda",
            action.link1, // "Link 1",
            action.link2, // "Link 2",
            observations, // "Observaciones",

            // location && location.district ? location.district.long_name : "",
            // location && location.province ? location.province.long_name : "",
            // location ? location.coords.lat.toString() : "",
            // location ? location.coords.lng.toString() : "",
          ]);
        });
      });
      const csv = stringify(csvData);

      res
        .status(200)
        .json({ csv })
        .end();
    }
  } catch (e) {
    console.log(e);
  }
});
