import { Response } from "express";

export class apiUtil {
    
    public static responseJsonOk = (res: Response) => res.status(200).json.bind(res)

}