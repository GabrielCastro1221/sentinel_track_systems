const UserRepository = require("../../../repositories/auth/user.repository");
const { logger } = require("../../../middlewares/logger.middleware");

class SocketUser {
    constructor(io) {
        this.io = io;
        this.initSocketEvents();
    }

    initSocketEvents() {
        this.io.on("connection", async (socket) => {
            logger.info("WebSocket users connected");

            socket.on("createUser", async (data) => {
                try {
                    const newUser = await UserRepository.createUser(data);
                    socket.emit("userCreated", newUser);
                } catch (error) {
                    socket.emit("error", error.message);
                }
            });

            socket.on("getUsers", async ({ page, role, gender }) => {
                try {
                    const users = await UserRepository.getUsers({ page, role, gender });
                    socket.emit("usersList", users);
                } catch (error) {
                    socket.emit("error", "Error fetching users list");
                }
            });

            socket.on("getUserProfile", async (id) => {
                try {
                    const user = await UserRepository.getUserProfile(id);
                    socket.emit("userProfile", user);
                } catch (error) {
                    socket.emit("error", "Error fetching user profile");
                }
            });

            socket.on("getUserPets", async (userId) => {
                try {
                    const pets = await UserRepository.getUserPets(userId);
                    socket.emit("userPets", pets);
                } catch (error) {
                    socket.emit("error", "Error fetching user pets");
                }
            });

            socket.on("getUserTickets", async (userId) => {
                try {
                    const tickets = await UserRepository.getUserTickets(userId);
                    socket.emit("userTickets", tickets);
                } catch (error) {
                    socket.emit("error", "Error fetching user tickets");
                }
            });

            socket.on("updateUser", async ({ id, updateData }) => {
                try {
                    const updatedUser = await UserRepository.updateUser(id, updateData);
                    socket.emit("userUpdated", updatedUser);
                } catch (error) {
                    socket.emit("error", "Error updating user");
                }
            });

            socket.on("changeRole", async ({ id, newRole }) => {
                try {
                    const updatedUser = await UserRepository.changeRole(id, newRole);
                    socket.emit("roleChanged", updatedUser);
                } catch (error) {
                    socket.emit("error", "Error changing user role");
                }
            });

            socket.on("deleteUser", async (id) => {
                try {
                    const deletedUser = await UserRepository.deleteUser(id);
                    socket.emit("userDeleted", deletedUser);
                } catch (error) {
                    socket.emit("error", "Error deleting user");
                }
            });

            socket.on("disconnect", () => {
                logger.info("Client disconnected from User socket:", socket.id);
            });
        });
    }
}

module.exports = SocketUser;
