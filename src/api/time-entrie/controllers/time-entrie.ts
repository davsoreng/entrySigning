/**
 * time-entrie controller
 */

import { factories } from "@strapi/strapi";

const db_key = "api::time-entrie.time-entrie";

export default factories.createCoreController(db_key, ({ strapi }) => ({
  async getTimeEntries(ctx) {
    try {
      const { id } = ctx.params;
      if (id) {
        const organizacion = await strapi.service(db_key).obtenerPorId(id);

        return ctx.send({
          ok: true,
          mensaje: "TimeEntries obtenido correctamente",
          datos: organizacion,
        });
      }

      const organizaciones = await strapi.service(db_key).obtenerTodos();

      return ctx.send({
        ok: true,
        mensaje: "OrgMemebers obtenidos correctamente",
        total: organizaciones.length,
        datos: organizaciones,
      });
    } catch (error) {
      ctx.throw(500, {
        mensaje: "Error al obtener las organizaciones",
        error: error.message,
      });
    }
  },
  async createTimeEntries(ctx) {
    try {
      const {
        work_date,
        entry_status,
        started_at,
        ended_at,
        organization_member,
      } = ctx.request.body;
      const nuevaOrganizacion = await strapi.service(db_key).crear({
        work_date,
        entry_status,
        started_at,
        ended_at,
        organization_member,
      });
      ctx.status = 201; // HTTP 201 = Creado
      return ctx.send({
        ok: true,
        mensaje: "Organization Member creado correctamente",
        datos: nuevaOrganizacion,
      });
    } catch (error) {
      ctx.throw(400, {
        mensaje: "Error al crear organization member",
        error: error.message,
      });
    }
  },
  async getTimeEntriesByMember(ctx) {
    try {
      const { id } = ctx.params;
      if (id) {
        const organizacion = await strapi.service(db_key).obtenerPorOrg(id);
        return ctx.send({
          ok: true,
          mensaje: "OrgMember obtenido correctamente",
          datos: organizacion,
        });
      }

      const organizaciones = await strapi.service(db_key).obtenerTodos();

      return ctx.send({
        ok: true,
        mensaje: "OrgMemebers obtenidos correctamente",
        total: organizaciones.length,
        datos: organizaciones,
      });
    } catch (error) {
      console.log("estoy aquí");
      ctx.throw(500, {
        mensaje: "Error al obtener las organizaciones",
        error: error.message,
      });
    }
  },
}));
