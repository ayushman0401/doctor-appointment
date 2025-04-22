import doctorModel from '../models/doctorModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js';

const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;

        const docData = await doctorModel.findById(docId);
        const newAvailability = !docData.available;

        await doctorModel.findByIdAndUpdate(docId, { available: newAvailability });

        res.json({
            success: true,
            message: `Doctor is now ${newAvailability ? 'available' : 'not available'}`
        });
        
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

const doctorList=async(req,res)=>{
    try {
        const doctors=await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true,doctors})
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}


//api for doctor login
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await doctorModel.findOne({ email });
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        const isMatch = await bcrypt.compare(password,doctor.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
        res.json({success:true,token})
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}    

//api to get doctor appointments for doctor panel 
const appointmentsDoctor=async(req,res)=>{
    try {
        const { docId } = req.body;
        const appointments = await appointmentModel.find({docId});
        res.json({ success: true,appointments});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

//api to mark appointment as completed for doctor panel
const appointmentComplete=async(req,res)=>{
    try {
        const {docId,appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        if (appointmentData && appointmentData.docId===docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
            res.json({ success: true, message: 'Appointment completed'});
        }
        else {
            res.status(404).json({ success: false, message: 'Mark Failed' });
        }  
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }

}
//api to cancel appointment as completed for doctor panel
const appointmentCancel=async(req,res)=>{
    try {
        const {docId,appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        if (appointmentData && appointmentData.docId===docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
            res.json({ success: true, message: 'Appointment cancelled'});
        }
        else {
            res.status(404).json({ success: false, message: 'cancellation Failed' });
        }  
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }

}

//api to get dashboard data for doctor panel
const doctorDashboard=async(req,res)=>{
    try {
        const { docId } = req.body;
        const appointments = await appointmentModel.find({docId});
        let  earnings = 0;
        appointments.forEach(appointment => {
            if (appointment.isCompleted || appointment.payment) {
                earnings += appointment.amount;
            }
        });
        let patients=[]
        appointments.map(appointment=>{
            if(!patients.includes(appointment.userId)){
                patients.push(appointment.userId)
            }
        }
        )
        const dashData={
            earnings,
            appointments:appointments.length,
            patients:patients.length,
            latestAppointments:appointments.reverse().slice(0,5),

        }
        res.json({ success: true,dashData});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

//api to get doctor profile for doctor panel
const doctorProfile=async(req,res)=>{
    try {
        const { docId } = req.body;
        const profileData = await doctorModel.findById(docId).select(['-password']);
        res.json({ success: true,profileData});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

//api to update doctor profile for doctor panel
const doctorProfileUpdate=async(req,res)=>{
    try {
        const { docId, fees,address,available } = req.body;
        const updatedDoctor = await doctorModel.findByIdAndUpdate(docId, { fees,address,available });
        res.json({ success: true, message: 'Profile Updated'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}



export { changeAvailability,doctorList,loginDoctor,appointmentsDoctor,appointmentComplete,appointmentCancel,doctorDashboard,doctorProfile,doctorProfileUpdate} 
