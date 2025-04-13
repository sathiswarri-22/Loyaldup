"use client"
import { useState , useEffect } from "react";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Getservicedetails = () => {
  const [serviceData, setServiceData] = useState([]);
  const token = localStorage.getItem("admintokens");
  const Eid = localStorage.getItem("idstore");
  const role = localStorage.getItem("role");
  const router = useRouter();

   const getservicedetails = () =>{
     try{
       const response = axios.get(``)
     }catch(err){
        console.error(err);
      setError(err.response?.data?.message || "Failed to fetch data from server.");
     }
   }
  return (
    <div>
      <table>
         <thead>
            <th>Customerinward</th>
            <th>clientName</th>
            <th>quantity</th>
            <th>servicestartdate</th>
            <th>Employeeid</th>
            <th>Material</th>
            <th>Model</th>
            <th>SerialNo</th>
            <th>powerconsumption</th>
            <th>serviceStatus</th>
            <th>serviceenddate</th>
            <th>BillingStatus</th>
         </thead>
         <tbody>
            <tr>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
                <td>{}</td>
            </tr>
         </tbody>
      </table>
    </div>
  );
};
 export default Getservicedetails;