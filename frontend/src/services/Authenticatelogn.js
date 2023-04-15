import { getToken } from "./TokenServices"
export const authenticate=()=>{
   
   const user = getToken()
   
   if(user===null)
{
return null
}   
else{
return user
}     }