/**
 * organization-member controller
 */

import { factories } from "@strapi/strapi";

const db_key = "api::organization-member.organization-member";

export default factories.createCoreController(db_key, ({ strapi }) => ({
  async getOrgMemeber(ctx) {
    try {
      const { id } = ctx.params;
      if (id) {
        const organizacion = await strapi.service(db_key).obtenerPorId(id);

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
  async createOrgMemeber(ctx) {
    try {
      const { user,organization,role } = ctx.request.body;
      const nuevaOrganizacion = await strapi.service(db_key).crear({
        user, organization, role
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
  async getOrgMemberByOrg(ctx){
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
  }
}));
