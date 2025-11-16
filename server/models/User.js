class User {
  
  constructor(prismaUser) {
    this.id = prismaUser.id;
    this.email = prismaUser.email;
    this.firstName = prismaUser.firstName;
    this.lastName = prismaUser.lastName;
    this.role = prismaUser.role;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  is(role) {
    return this.role === role;
  }

  canAccessAdmin() {
    return this.is('admin') || this.is('superadmin');
  }
}

module.exports = User;