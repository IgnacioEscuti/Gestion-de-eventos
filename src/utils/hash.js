import { hash, compare, genSalt } from "bcrypt";


export async function createHash(password) {
    return await hash(password, await genSalt(10))
}

export async function isValidPassword(password, hashedPassword) {
    return await compare(password, hashedPassword)
}