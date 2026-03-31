/**
 * organization-member service
 */

import { factories } from "@strapi/strapi";

const db_key = "api::organization-member.organization-member";

interface OrganizacionMember {
  user: string;
  organization: string;
  role: 'employee' | 'admin' ;
}

export default factories.createCoreService(db_key, ({ strapi }) => ({
  async obtenerTodos() {
    try {
      const data = await strapi.documents(db_key).findMany({
        fields: ["id", "documentId", "role"],
        populate: {
          user: {
            fields: ["id", "documentId", "username"],
          },
          organization: {
            fields: ["id", "documentId", "name"],
          },
          time_entries: {
            fields: [
              "id",
              "documentId",
              "entry_status",
              "work_date",
              "started_at",
              "ended_at",
            ],
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
        fields: ["id", "documentId", "role"],
        populate: {
          user: {
            fields: ["id", "documentId", "username"],
          },
          organization: {
            fields: ["id", "documentId", "name"],
          },
          time_entries: {
            fields: [
              "id",
              "documentId",
              "entry_status",
              "work_date",
              "started_at",
              "ended_at",
            ],
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
  async crear(orgM: OrganizacionMember) {
    try {
      if (!orgM.user || orgM.user.trim() === "") {
        throw new Error("\"documentId\" de usuario requerido");
      }
      if (!orgM.role || orgM.role.trim() === "" ) {
        throw new Error("Rol de usuario requerido");
      }
      if (!orgM.role || orgM.role.trim() === "" ) {
        throw new Error("Rol de usuario requerido");
      }
      if (!orgM.organization || orgM.organization.trim() === "" ) {
        throw new Error("Organización del usuario requerida");
      }

      const organizacion = await strapi.documents(db_key).create({
        data: {
          user: orgM.user,
          organization: orgM.organization,
          role: orgM.role || "employee"
        },
        fields: ["id", "documentId", "role"],
        populate: {
          user: {
            fields: ["id", "documentId", "username"],
          },
          organization: {
            fields: ["id", "documentId", "name"],
          },
          time_entries: {
            fields: [
              "id",
              "documentId",
              "entry_status",
              "work_date",
              "started_at",
              "ended_at",
            ],
          },
        },
      });

      return organizacion;
    } catch (error) {
      console.error("Error al crear producto:", error);
      throw error;
    }
  },
  async obtenerPorOrg(documentId: string) {
    try {
      const organization = await strapi.documents(db_key).findMany({
        fields: ["id", "documentId", "role"],
        filters : {
          organization : {
            documentId
          }
        },
        populate: {
          user: {
            fields: ["id", "documentId", "username"],
          },
          organization: {
            fields: ["id", "documentId", "name"],
          },
          time_entries: {
            fields: [
              "id",
              "documentId",
              "entry_status",
              "work_date",
              "started_at",
              "ended_at",
            ],
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
