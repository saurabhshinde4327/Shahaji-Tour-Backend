const Client = require('../models/Client');
const logger = require('../utils/logger');

class ClientService {
  static async register(data) {
    const { email } = data;
    
    // Check if email already exists
    const exists = await Client.emailExists(email);
    if (exists) {
      throw new Error('Email already exists!');
    }

    const clientId = await Client.create(data);
    logger.success(`Client registered: ${email}`);
    return clientId;
  }

  static async login(email, password) {
    const client = await Client.findByEmail(email);
    
    if (!client || client.password !== password) {
      throw new Error('Invalid email or password');
    }

    logger.success(`Login successful for: ${email}`);
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address
    };
  }

  static async getTotalClients() {
    return await Client.count();
  }

  static async getAllClients() {
    return await Client.findAll();
  }
}

module.exports = ClientService;

