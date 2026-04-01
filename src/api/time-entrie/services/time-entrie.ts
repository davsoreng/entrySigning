/**
 * time-entrie service
 */

import { factories } from "@strapi/strapi";

const db_key = "api::time-entrie.time-entrie";

interface TimeEntrie {
  work_date: Date;
  entry_status: "active" | "paused" | "completed";
  started_at: Date;
  ended_at: Date;
  organization_member: string;
}

export default factories.createCoreService(db_key, ({ strapi }) => ({
  async obtenerTodos() {
    try {
      const data = await strapi.documents(db_key).findMany({
        fields: [
          "id",
          "documentId",
          "entry_status",
          "started_at",
          "ended_at",
          "work_date",
        ],
        populate: {
          organization_member: {
            fields: ["id", "documentId"],
            populate: {
              user: {
                fields: ["username"],
              },
              organization: {
                fields: ["name"],
              },
            },
          },
        },
      });
      return data;
    } catch (error) {
      console.error("Error al obtener las organizaciones:", error);
      throw error;
    }
  },
  async obtenerPorId(documentId: string) {
    try {
      const organization = await strapi.documents(db_key).findOne({
        documentId,
        fields: [
          "id",
          "documentId",
          "entry_status",
          "started_at",
          "ended_at",
          "work_date",
        ],
        populate: {
          organization_member: {
            fields: ["id", "documentId"],
            populate: {
              user: {
                fields: ["username"],
              },
              organization: {
                fields: ["name"],
              },
            },
          },
        },
      });

      if (!organization) {
        throw new Error(`Organización con ID ${documentId} no encontrado`);
      }
      return organization;
    } catch (error) {
      console.error("Error al obtener la organización:", error);
      throw error;
    }
  },
  /* async crear(a: TimeEntrie) {
    try {
      if (isNaN(new Date(a.work_date).getTime())) {
        throw new Error("WorkDate requerido");
      }
      if (isNaN(new Date(a.ended_at).getTime())) {
        throw new Error("Ended_at requerido");
      }
      if (isNaN(new Date(a.started_at).getTime())) {
        throw new Error("Started_at requerido");
      }
      if (!a.entry_status || a.entry_status.trim() === "") {
        throw new Error("Entry_status requerida");
      }

      const organizacion = await strapi.documents(db_key).create({
        data: {
          work_date: a.work_date,
          ended_at: a.ended_at,
          started_at: a.started_at,
          entry_status: a.entry_status || "active",
          organization_member: a.organization_member,
        },
        fields: [
          "id",
          "documentId",
          "entry_status",
          "started_at",
          "ended_at",
          "work_date",
        ],
        populate: {
          organization_member: {
            fields: ["id", "documentId"],
            populate: {
              user: {
                fields: ["username"],
              },
              organization: {
                fields: ["name"],
              },
            },
          },
        },
      });

      return organizacion;
    } catch (error) {
      console.error("Error al crear producto:", error);
      throw error;
    }
  }, */
  async obtenerPorOrg(documentId: string) {
    try {
      const organization = await strapi.documents(db_key).findMany({
        fields: [
          "id",
          "documentId",
          "entry_status",
          "started_at",
          "ended_at",
          "work_date",
        ],
        filters : {
            organization_member : {
                user : {
                    documentId
                }
            }
        },
        populate: {
          organization_member: {
            fields: ["id", "documentId"],
            populate: {
              user: {
                fields: ["id","documentId","username"],
              },
              organization: {
                fields: ["name"],
              },
            },
          },
        },
      });

      if (!organization) {
        throw new Error(`Organización con ID ${documentId} no encontrado`);
      }
      return organization;
    } catch (error) {
      console.error("Error al obtener la organización:", error);
      throw error;
    }
  },
}));
