export class ApiResponse{
    status: string;
    stautsCode: number;
    message: string | null;

    constructor(status: string, statusCode: number, message: string | null = null){
        this.status = status;
        this.stautsCode = statusCode;
        this.message = message;
    }
}