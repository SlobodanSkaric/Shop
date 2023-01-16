export class LoginInfoDto{
    //role: "administraotr" | "user";
    id: number;
    identetiy: string;
    token: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;

    constructor(id: number, un: string, jwt: string, refreshToken: string, refreshTokenExpiresAt: string){
        //this.role = role;
        this.id = id;
        this.identetiy = un;
        this.token = jwt;
        this.refreshToken = refreshToken;
        this.refreshTokenExpiresAt = refreshTokenExpiresAt;
    }
}