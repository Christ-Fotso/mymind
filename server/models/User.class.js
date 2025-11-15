class User {

  #uid;
  #firstName;
  #lastName;
  #email;
  #password;
  
  constructor(email,firstName, lastName, password) {
    this.#uid = this.generateUid(); // Génération auto à la création
    this.#email = email;
    this.#password = password;
    this.#firstName = firstName;
    this.#lastName = lastName;
  }
  
  generateUid() {
    const timestamp = Date.now().toString(36); // Ex: "lzbd7s9"
    const randomPart = Math.random().toString(36).substring(2, 8); // Ex: "k9s2d"
    return `usr_${timestamp}_${randomPart}`.toUpperCase();
  }

  get uid() {
    return this.#uid;
  }

  get email() {
    return this.#email.toUpperCase(); 
  }

  set email(value) {
    if (!value.includes('@')) {
      throw new Error("Format d'email invalide !");
    }
    this.#email = value;
  }

  set password(newPassword) {
    if (newPassword.length < 6) {
      throw new Error("Le mot de passe est trop court");
    }
    this.#password = newPassword;
  }
  
  toJSON() {
    return {
      id: this.#uid,
      email: this.#email,
      firstName: this.#firstName,
      lastName: this.#lastName
    };
  }

}

module.exports = User;