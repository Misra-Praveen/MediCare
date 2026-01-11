import BillModule from "../models/BillModule";

export const generateBillNumber = async()=>{
    const year = new Date().getFullYear();
    const prefix = `MC-${year}`;

    const lastBillNo = await BillModule.findOne({
        billNumber: {$regex: `^${prefix}`}
    }).sort({ createdAt: -1 });

    let nextSequence = 1;
    if(lastBillNo){
        let lastNo = lastBillNo.billNumber.slice(6);
        nextSequence= (Number(lastNo) +1)
    }
    const paddedSequence = String(nextSequence).padStart(6, "0")
    const billNumber = `${prefix}-${paddedSequence}`
    return billNumber;
}