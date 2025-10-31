import React from 'react';
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import RiasecGuestForm from '../../components/riasec/RiasecGuestForm';

const RiasecPage =() =>{
    return(
    <>
    <Header />
    <div class='pb-8'></div>
    <RiasecGuestForm/>
    <Footer />
    </>
    )

}
export default RiasecPage;