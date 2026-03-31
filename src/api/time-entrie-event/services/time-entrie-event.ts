/**
 * time-entrie-event service
 */

import { factories } from "@strapi/strapi";
import { errors } from "@strapi/utils";

const { ApplicationError, ValidationError } = errors;

const db_key = "api::time-entrie-event.time-entrie-event";

interface TimeEntrieEvent {
  time_entrie: string;
  event_type: "start" | "resume" | "pause" | "end";
  event_at: Date;
}

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
        fields: ["id", "documentId", "event_type", "event_at"],
        populate: {
          time_entrie: {
            fields: ["id", "documentId"],
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
        fields: ["id", "documentId", "event_type", "event_at"],
        populate: {
          time_entrie: {
            fields: ["id", "documentId"],
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

  async verifyTEE(a: TimeEntrieEvent) {
    if (isNaN(new Date(a.event_at).getTime())) {
      throw new Error("Event_at requerido");
    }
    if (!a.time_entrie || a.time_entrie.trim() === "") {
      throw new Error('Time_entrie "documentId" requerido');
    }
    if (!a.event_type || a.event_type.trim() === "") {
      throw new Error("Entry_type requerida");
    }
  },

  async start(te: TimeEntrie) {
    try {
      //Este documentId, es el del time-entrie padre. Valida el estado de

      if (isNaN(new Date(te.work_date).getTime())) {
        throw new ValidationError("WorkDate requerido");
      }
      /* if (isNaN(new Date(te.ended_at).getTime())) {
        throw new Error("Ended_at requerido");
      } */
      if (isNaN(new Date(te.started_at).getTime())) {
        throw new ValidationError("Started_at requerido");
      }
      if (!te.entry_status || te.entry_status.trim() === "") {
        throw new ValidationError("Entry_status requerida");
      }

      const entrie = await strapi
        .documents("api::time-entrie.time-entrie")
        .create({
          data: {
            work_date: te.work_date,
            ended_at: te.ended_at,
            started_at: te.started_at,
            entry_status: te.entry_status || "active",
            organization_member: te.organization_member,
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

      await strapi.documents(db_key).create({
        data: {
          time_entrie: entrie.documentId,
          event_type: "start",
          event_at: entrie.started_at,
        },
      });

      return entrie;
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof ApplicationError
      ) {
        throw error;
      }
      throw new ApplicationError(
        'Error al modificar para "Start Entrie": ' + error.message,
      );
    }
  },
  async pause(documentId: string) {
    try {
      //Este documentId, es el del time-entrie padre. Valida el estado de
      const entrie = await strapi
        .documents("api::time-entrie.time-entrie")
        .findOne({
          documentId,
        });
      if (!entrie) {
        throw new ValidationError(
          `Time-entrie con ID ${documentId} no encontrado`,
        );
      }
      if (entrie.entry_status === "active") {
        const updated = await strapi
          .documents("api::time-entrie.time-entrie")
          .update({
            documentId,
            data: {
              entry_status: "paused",
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
        await strapi.documents(db_key).create({
          data: {
            time_entrie: entrie.documentId,
            event_type: "pause",
            event_at: entrie.updatedAt || new Date(),
          },
        });
        return updated;
      } else if (entrie.entry_status === "paused") {
        throw new ValidationError("No se puede pausar, ya está en pausa.");
      } else if (entrie.entry_status === "completed") {
        throw new ValidationError(
          "No se puede pausar, ya está completada la jornada.",
        );
      }

      return entrie;
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof ApplicationError
      ) {
        throw error;
      }
      throw new ApplicationError(
        'Error al modificar para "Pause Entrie": ' + error.message,
      );
    }
  },
  async resume(documentId: string) {
    try {
      const entrie = await strapi
        .documents("api::time-entrie.time-entrie")
        .findOne({
          documentId,
        });

      if (!entrie) {
        throw new ValidationError(
          `Time-entrie con ID ${documentId} no encontrado`,
        );
      }

      if (entrie.entry_status === "paused") {
        const updated = await strapi
          .documents("api::time-entrie.time-entrie")
          .update({
            documentId,
            data: {
              entry_status: "active",
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

        await strapi.documents(db_key).create({
          data: {
            time_entrie: entrie.documentId,
            event_type: "resume",
            event_at: new Date(),
          },
        });
        return updated;
      } else if (entrie.entry_status === "active") {
        throw new ValidationError(
          "No se puede activar, ya no se encuentra en pausa.",
        );
      } else if (entrie.entry_status === "completed") {
        throw new ValidationError(
          "No se puede reaunudar, ya está completada la jornada.",
        );
      }

      return entrie;
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof ApplicationError
      ) {
        throw error;
      }
      throw new ApplicationError(
        'Error al modificar para "Resume Entrie": ' + error.message,
      );
    }
  },
  async end(documentId: string) {
    try {
      const entrie = await strapi
        .documents("api::time-entrie.time-entrie")
        .findOne({
          documentId,
        });

      if (!entrie) {
        throw new ValidationError(
          `Time-entrie con ID ${documentId} no encontrado`,
        );
      }

      if (entrie.entry_status === "active") {
        const updated = await strapi
          .documents("api::time-entrie.time-entrie")
          .update({
            documentId,
            data: {
              entry_status: "completed",
              ended_at : new Date()
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

        await strapi.documents(db_key).create({
          data: {
            time_entrie: entrie.documentId,
            event_type: "end",
            event_at: new Date(),
          },
        });
        return updated;
      } else if (entrie.entry_status === "paused") {
        throw new ValidationError(
          "No se puede finalizar, ya que se encuentra en pausa.",
        );
      } else if (entrie.entry_status === "completed") {
        throw new ValidationError(
          "No se puede completar, ya está completada la jornada.",
        );
      }

      return entrie;
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof ApplicationError
      ) {
        throw error;
      }
      throw new ApplicationError(
        'Error al modificar para "End Entrie": ' + error.message,
      );
    }
  },
  async obternerTEEbyTE(id) {
    try {
      const entrie = await strapi.documents(db_key).findMany({
        filters: {
          time_entrie: id,
        },
        fields: ["id", "documentId", "event_type", "event_at"],
        populate: {
          time_entrie: {
            fields: ["id", "documentId"],
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
          },
        },
      });
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof ApplicationError
      ) {
        throw error;
      }
      throw new ApplicationError(
        'Error al modificar para "End Entrie": ' + error.message,
      );
    }
  },
}));
