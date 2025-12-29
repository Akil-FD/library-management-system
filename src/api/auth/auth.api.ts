
import { CommonResType, LoginPayload, LoginResponse } from "@/api/types"

export const authApi = {
    login(data: LoginPayload): Promise<CommonResType<LoginResponse>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        token: "fSSlw48yx7Bm5Z9HEiekvmb4ZCJWW9uS97wHVtrd80q2Jp29ZUUIdTFQ5sqSoYYle",
                        role: data.role,
                        email: data.email,
                        name: "John Doe",
                        id: "1",
                    },
                    success: true,
                })
            }, 1000)
        })
    },

    logout: () => {

    },
}
