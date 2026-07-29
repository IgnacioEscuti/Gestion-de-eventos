import { userService } from "../services/user.service.js";

export async function getAllUsers(req,res,next){
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({users});
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}