import React, { useContext, useEffect, useState } from 'react'
import {AppContext} from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';

const MyAppointments = () => {

  const {backendUrl,token,getDoctorsData}=useContext(AppContext);

  const [appointments, setAppointments] =useState([]);
  const months=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const navigate=useNavigate();
  const slotDateFormat=(date)=>{
    const dateArray=date.split('_');
    return dateArray[0]+' '+months[(dateArray[1])-1]+' '+dateArray[2];

  }  
  const getuserAppointments=async()=>{
    try{
      const {data}=await axios.get(backendUrl+'/api/user/list-appointment',{
        headers:{
          token
        }
      });
      if(data.success){
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }
    }
    catch(err){
      console.log(err);
      toast.error(err.message);
    }
  }
  
  const cancelAppointment=async(appointmentId)=>{
    try{
      const {data}=await axios.post(backendUrl+'/api/user/cancel-appointment',{appointmentId},{headers:{token}});
      if(data.success){
        toast.success(data.message);
        
        getuserAppointments();
        navigate('/my-appointments');
      }
      
    }
    catch(err){
      console.log(err);
      toast.error(err.message);
    }
  }

  const initPayment=async(order)=>{
    const options={
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:order.amount,
      currency:order.currency,
      name:'Appointment Payment',
      description:'Appointment Payment',
      order_id:order.id,
      receipt:order.receipt,
      handler:async function(response){
        console.log(response);
        try {
          const {data}=await axios.post(backendUrl+'/api/user/verifyRazorpay',response,{headers:{token}});
          if(data.success){
            toast.success(data.message);
            getuserAppointments();
            getDoctorsData();
          }
          else{
            toast.error(data.message);
          }
        } catch (error) {
          
        }
       }
      }
    const razorpay=new window.Razorpay(options);
    razorpay.open();
    }
  

  const appointmentRazorpay=async(appointmentId)=>{
    try {
      const {data}=await axios.post(backendUrl+'/api/user/payment-razorpay',{appointmentId},{headers:{token}});
      if(data.success){
        initPayment(data.order)
      }
      }
     catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    if(token) getuserAppointments();
  },[token]);

  return (
    <div>
      <p className=' pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        {appointments.map((item,index)=>(
          <div className=' grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b ' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt=""/>
            </div>
            <div className='flex-1 text-sm text-zinc-600 '>
              <p className=' text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className=' text-zinc-700 font-medium mt-1'>Address:</p>
              <p className=' text-sm'>{item.docData.address.line1}</p>
              <p className='text-sm'>{item.docData.address.line2}</p>
              <p className='text-sm mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>{slotDateFormat(item.slotDate)} |{item.slotTime}</p>
            </div>
            <div>
            </div>
            <div className='flex flex-col gap-2 justify-end'>
              {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50 '>Paid</button>}
              {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={()=>appointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
              {!item.cancelled && !item.isCompleted && <button onClick={()=>cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appointment</button>}
              {item.cancelled && !item.isCompleted && <p className='text-sm text-red-600 text-center sm:min-w-48 py-2 border rounded'>Cancelled</p>}
              {item.isCompleted && <button className='text-sm text-green-600 text-center sm:min-w-48 py-2 border rounded'>Completed</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
