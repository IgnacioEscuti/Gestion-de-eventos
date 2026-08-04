import { userService } from "../services/user.service.js";
import { UserDTO } from "../DTOs/user.dto.js";

export async function getAllUsers(req,res,next){
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({ users: users.map(user => new UserDTO(user)) });
    }
    catch (error) {
        next(error);
    }
}