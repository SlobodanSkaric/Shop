export class JwtRefreshDataDto{
    role: "administraotr" | "user";
    id: number;
    identetiy: string;
    exp: number;
    ip: string;
    ua: string;

    toPlainObject(){
        return {
            role: this.role,
            id: this.id,
            identetiy: this.identetiy,
            exp: this.exp,
            ip: this.ip,
            ua: this.ua
        }
    }
}