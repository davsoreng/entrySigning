/**
 * organization controller
 */

import { factories } from "@strapi/strapi";

const db_key = "api::organization.organization";

export default factories.createCoreController(db_key, ({ strapi }) => ({
  async getOrganization(ctx) {
    try {
      const { id } = ctx.params;
      if (id) {
        const organizacion = await strapi.service(db_key).obtenerPorId(id);

        return ctx.send({
          ok: true,
          mensaje: "Producto obtenido correctamente",
          datos: organizacion,
        });
      }

      const organizaciones = await strapi.service(db_key).obtenerTodos();

      return ctx.send({
        ok: true,
        mensaje: "Organizaciones obtenidos correctamente",
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
  async createOrganization(ctx) {
    try {
      const { name } = ctx.request.body;
      console.log(name);
      const nuevaOrganizacion = await strapi.service(db_key).crear({
        name
    });
      ctx.status = 201; // HTTP 201 = Creado
      return ctx.send({
        ok: true,
        mensaje: "Organización creado correctamente",
        datos: nuevaOrganizacion,
      });
    } catch (error) {
      ctx.throw(400, {
        mensaje: "Error al crear la organización",
        error: error.message,
      });
    }
  },
}));
