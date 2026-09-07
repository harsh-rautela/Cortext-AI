import React from 'react'
import {AnimatePresence, color, motion} from "motion/react"
import { Crown, Currency, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { createOrder } from '../features/createOrder'
import { verifyPayment } from '../features/verifyPayment'
import { setUserdata } from '../redux/userSlice'
import getCurrentUser from '../features/getCurrentUser'
const BillingDrawer = ({open,onClose}) => {
    const {userData} = useSelector(state=>state.user)
    const dispatch = useDispatch();
  const handleUpgrade = async (plan)=>{
    try {
        const data = await createOrder(plan);
        const options = {
            key:import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount:data?.order.amount,
            Currency:data?.order.currency,
            name:"CortextAI",
            description:`${data?.plan.name} Plan`,
            order_id:data?.order.id,
            handler:async (response)=>{
                try {
                    const data = await  verifyPayment({
                    razorpay_order_id:response.razorpay_order_id,
                    razorpay_payment_id:response.razorpay_payment_id,
                    razorpay_signature:response.razorpay_signature
                });
                 const udata = await getCurrentUser();
                 dispatch(setUserdata(udata));

                }catch(error){
                    console.error(
                            "Payment verification failed:",
                            error
                        );
                }
            },
            theme:{
                color:"#4F46ES"
            }
        }
        const razorpay = new window.Razorpay(options);
         razorpay.open()


    } catch(error){

    }
  }
  
    return (
    <AnimatePresence>
        {open && <>  <motion.div 
        initial={{opacity:0}}
        animate={{opacity:0.5}}
        exit={{opacity:0}}
        onClick={onClose}
        className='fixed inset-0 bg-black z-40'/>

    <motion.div 
    initial={{x:"100%"}}
    animate={{x:0}}
    exit={{x:"100%"}}
    transition={{duration:.25}}
    className='fixed right-0 top-0 z-50 h-screen w-95 bg-[#0f1117] border-l border-white/10 shadow-2xl flex flex-col'>
        <div className='flex items-center justify-between p-5 border-b border-white/10'>
             <div className=''>
                <div className='text-white text-lg font-semibold'>
                Billing
            </div>  
            <div className='text-slate-400 text-sm'>
                Plan & credits
            </div>  
            </div>   
            <button onClick={onClose} className='w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center'>
            <X size={18} className='text-slate-300'/>
           </button>    
        </div>

        <div className='p-5'>
            <div className='rounded-xl bg-white/4 border border-white/10 p-4 '>
                <div className='flex justify-between items-center'>
                    <div>
                        <p className='text-slate-400 text-sm'>
                        Current Plan
                        </p>
                        <h3 className='text-white text-xl font-bold'>
                            {userData?.plan || "free"}
                        </h3>
                    </div>
                    <Crown size={22} className='text-yellow-400'/>
                </div>

                <div className='mt-5'>
                    <div className='flex justify-between text-xs text-slate-400 mb-2'>
                        <span>
                            Credits
                        </span>
                        <span>{userData?.credits|| 0}/{userData?.totalCredits || "100"}</span>
                    </div>
                    <div className='h-2 rounded-full bg-white/10 overflow-hidden'>
                        <div className='h-full bg-indigo-500 transition-all duration-500'
                        style={{
                            width:`${((userData?.credits || 0)/(userData?.totalCredits || 100))*100}%`
                        }}>

                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div className='px-5 flex-1 overflow-auto space-y-4'>
             <div className='rounded-xl border border-white/10 p-4'>
               <h3 className='text-white font-semibold '>Starter Pack</h3>
               <p className='text-indigo-400 text-2xl font-bold mt-2'>₹199</p>
               <p className='text-slate-400 text-sm mt-1'>500 Credits</p>
               <button className='mt-4 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 py-2 text-white' onClick={()=>handleUpgrade("starter")}>
                Upgrade
               </button>
             </div>    
             <div className='rounded-xl border border-white/10 p-4'>
               <h3 className='text-white font-semibold '>Pro Plan</h3>
               <p className='text-indigo-400 text-2xl font-bold mt-2'>499</p>
               <p className='text-slate-400 text-sm mt-1'>1000 Credits</p>
               <button className='mt-4 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 py-2 text-white' onClick={()=>handleUpgrade("pro")}>
                Upgrade
               </button>
             </div>        
        </div>

    </motion.div> 
    </> }
    
    </AnimatePresence>
  )
}

export default BillingDrawer