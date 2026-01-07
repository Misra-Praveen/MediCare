import { NextFunction, Request, Response } from "express";

const checkRole = (...allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction)=>{
    try {
        const userRole = (req as any).user?.role;
        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: "Access denied" });
        }
        next()
    } catch (error) {
        return res.status(500).json({ message: "Server issue" });
    }
}

export default checkRole