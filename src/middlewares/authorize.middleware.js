export function authorizeRoles(roles = []) {
    return async function (req, res, next) {
        if(!req.user){
            return res.status(401).json({
                status: "error",
                message: "Usuario no autenticado"
            })
        }
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                status:"error",
                message:"Usuario no autorizado"
            })
        }
    next()
    }
}