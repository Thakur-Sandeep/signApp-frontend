import { toast } from "react-toastify";

export const handleSuccess=(msg)=>{
    toast.success(msg,{
        position:"top-center"
    })
}
export const handleError=(msg)=>{
    toast.error(msg,{
        position:"top-center"
    })
}
export const API_BASE_URL = "https://signapp-backend-v9u4.onrender.com";