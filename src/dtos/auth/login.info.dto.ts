export class LoginInfoDto{
    //role: "administraotr" | "user";
    id: number;
    identetiy: string;
    token: string;

    constructor(id: number, un: string, jwt: string){
        //this.role = role;
        this.id = id;
        this.identetiy = un;
        this.token = jwt;
    }
}