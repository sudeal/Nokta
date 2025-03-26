import React from "react";
import image from '../assets/takvim.jpg'; 

const Home = () => {
  return (
    <div>
      <h2 style={{
        fontSize: '3rem',  
        textAlign: 'center',
        marginTop: '-40px',   
        fontWeight: 'bold',
        color: '#FFD700',
      }}>
        WELCOME
      </h2>
      <h1 style={{
        textAlign: 'center', 
        marginTop: '-20px',
        color: '#FFD700',
      }}>
        All Your Needs at Your Fingertips with the Appointment System!
      </h1>

      <p style={{
        fontSize: '1.5rem',
        textAlign: 'justify', // Yazıyı her iki kenara hizalı yapıyoruz
        fontStyle: 'italic',
        lineHeight: '1.8',
        marginTop: '-20px',
        width: '80%',         // Yazının genişliğini artırıyoruz
        margin: '0 auto',     // Yazıyı yatayda ortalıyoruz
        textOverflow: 'ellipsis', // Taşan yazıyı "..." ile gösterir
      }}>
        You can reach all the requirements and needs that are part of your life at a single point. 
        This appointment system makes it easy for you to find the most suitable services in various fields 
        such as health, education, beauty, care, and many more. By using your time efficiently, 
        you can access all the services that will make your life easier with just one step. 
        Organize your life with fast and reliable appointment solutions, everything is in one NOKTA for you!
      </p>

      <img src={image} alt="Randevu Sistemi" style={{ width: '100%', maxWidth: '600px', height: 'auto' }} />
    </div>
  );
};

export default Home;
