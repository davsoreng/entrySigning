/**
 * time-entrie-event controller
 */

import { factories } from "@strapi/strapi";

const db_key = "api::time-entrie-event.time-entrie-event";

export default factories.createCoreController(db_key, ({ strapi }) => ({
  async getTimeEntryEvent(ctx) {
    try {
      const { id } = ctx.params;
      if (id) {
        const organizacion = await strapi.service(db_key).obtenerPorId(id);

        return ctx.send({
          ok: true,
          mensaje: "Event Time Entries obtenido correctamente",
          datos: organizacion,
        });
      }

      const organizaciones = await strapi.service(db_key).obtenerTodos();

      return ctx.send({
        ok: true,
        mensaje: "Event Time Entries obtenidos correctamente",
        total: organizaciones.length,
        datos: organizaciones,
      });
    } catch (error) {
      ctx.throw(500, {
        mensaje: "Error al obtener los Event Time Entries ",
        error: error.message,
      });
    }
  },
  async startTimeEntriesEvent(ctx) {
    try {
      const {
        work_date,
        ended_at,
        started_at,
        entry_status,
        organization_member,
      } = ctx.request.body;
      const entrie = await strapi.service(db_key).start({
        work_date,
        entry_status,
        started_at,
        ended_at,
        organization_member,
      });
      ctx.status = 201; // HTTP 201 = Creado
      return ctx.send({
        ok: true,
        mensaje: "Start Entrie",
        datos: entrie,
      });
    } catch (error) {
      console.error("Error en Start Entrie:", error);

      const status =
        error.name === "ValidationError" ? 400 : error.status || 500;

      return ctx.throw(status, error.message);
    }
  },

  async pauseTimeEntriesEvent(ctx) {
    try {
      const { id } = ctx.params;
      //const { time_entrie, event_type, event_at } = ctx.request.body;
      const entrie = await strapi.service(db_key).pause(id);
      ctx.status = 201; // HTTP 201 = Creado
      return ctx.send({
        ok: true,
        mensaje: "Pause Entrie",
        datos: entrie,
      });
    } catch (error) {
      console.error("Error en Pause Entrie:", error);

      const status =
        error.name === "ValidationError" ? 400 : error.status || 500;

      return ctx.throw(status, error.message);
    }
  },
  async resumeTimeEntriesEvent(ctx) {
    try {
      const { id } = ctx.params;
      //const { time_entrie, event_type, event_at } = ctx.request.body;
      const entrie = await strapi.service(db_key).resume(id);
      ctx.status = 201; // HTTP 201 = Creado
      return ctx.send({
        ok: true,
        mensaje: "Resume Entrie",
        datos: entrie,
      });
    } catch (error) {
      console.error("Error en Resume Entrie:", error);

      const status =
        error.name === "ValidationError" ? 400 : error.status || 500;

      return ctx.throw(status, error.message);
    }
  },
  async endTimeEntriesEvent(ctx) {
    try {
      const { id } = ctx.params;
      //const { time_entrie, event_type, event_at } = ctx.request.body;
      const entrie = await strapi.service(db_key).end(id);
      ctx.status = 201; // HTTP 201 = Creado
      return ctx.send({
        ok: true,
        mensaje: "End Entrie",
        datos: entrie,
      });
    } catch (error) {
      console.error("Error en End Entrie:", error);

      const status =
        error.name === "ValidationError" ? 400 : error.status || 500;

      return ctx.throw(status, error.message);
    }
  },
  async getTimeEntriesEveByEntrie(ctx) {
    try {
      const { id } = ctx.params;
      const events = await strapi.service(db_key).obtenerTEEbyTE(id);
      ctx.status = 201; // HTTP 201 = Creado
      return ctx.send({
        ok: true,
        mensaje: "Eventes obteneidos por time entrie",
        datos: events,
      });
    } catch (error) {
      console.error("Error al obtener los eventos por time entrie:", error);
      const status =
        error.name === "ValidationError" ? 400 : error.status || 500;
      return ctx.throw(status, error.message);
    }
  },
}));
