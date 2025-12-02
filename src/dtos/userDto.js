export class UserDTO {
  constructor(user) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.phoneNumber = user.phoneNumber;
    this.dateOfBirth = user.dateOfBirth;
    this.role = user.role;
    this.imageUrl = user.imageUrl || null;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  static fromModel(userModelInstance) {
    if (!userModelInstance) return null;
    return new UserDTO(userModelInstance.toJSON ? userModelInstance.toJSON() : userModelInstance);
  }
}