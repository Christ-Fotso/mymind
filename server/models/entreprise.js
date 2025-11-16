// Fichier : ./src/models/Tenant.js
class Tenant {

  constructor(prismaTenant) {
    if (!prismaTenant || !prismaTenant.id) {
      throw new Error("Objet Prisma Tenant invalide.");
    }
    this.id = prismaTenant.id;
    this.name = prismaTenant.name;
    this.createdAt = prismaTenant.createdAt;
    
    // Ajoutez les relations chargées par Prisma si nécessaire
    this.users = prismaTenant.users; 
    this.projects = prismaTenant.projects;
  }
  
  /**
   * Retourne le nombre d'utilisateurs si la relation 'users' est chargée
   * @returns {number | undefined}
   */
  getUserCount() {
    return this.users ? this.users.length : undefined;
  }
}

module.exports = Tenant;