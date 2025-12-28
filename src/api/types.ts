import { User } from "@/types/auth";
import { UserRole } from "@/types/enums/auth.enum";

export type CommonResType<T> = {
    data: T;
    success: boolean;
}


// --- Auth --- 

export type LoginPayload = {
    role: UserRole,
    email: string
    password: string
}

export type LoginResponse = User &{
    token: string,
}




