/**
 * organization service
 */

import { factories } from '@strapi/strapi';

const db_key = "api::organization.organization"

interface Organizacion{
    name:string;
}

export default factories.createCoreService(db_key, ({ strapi }) => ({
  async obtenerTodos() {
    try {
      const data = await strapi.documents(db_key).findMany();
      return data;
    } catch (error) {
      console.error('Error al obtener las organizaciones:', error);
      throw error;
    } 
  },
  async obtenerPorId(documentId: string) {
    try {
      const organization = await strapi
        .documents(db_key)
        .findOne({ documentId });
      
      if (!organization) {
        throw new Error(`Organización con ID ${documentId} no encontrado`);
      }
      return organization;
    } catch (error) {
      console.error('Error al obtener la organización:', error);
      throw error;
    }
  },
  async crear(org: Organizacion) {
    try {
      if (!org.name || org.name.trim() === '') {
        throw new Error('El nombre es requerido');
      }

      const organizacion = await strapi.documents(db_key).create({
        data: {
          name: org.name.trim(),
        },
      });

      return organizacion;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },
}));