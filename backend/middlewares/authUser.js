import jwt from 'jsonwebtoken'

//user authentication middleware

const authUser=async(req,res,next)=>{
    try {
        const {token}=req.headers
        if(!token){
            return res.json({success:false,message:"not authorized login again"})
        }
        const tokendecode=jwt.verify(token,process.env.JWT_SECRET)
        
        req.body.userId=tokendecode.id;        
        next();

    } catch (error) {
        console.log(error)
        res.json({ success: false, message:error.message});
    }
}
export default authUser