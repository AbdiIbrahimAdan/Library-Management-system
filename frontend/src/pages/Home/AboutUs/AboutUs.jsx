import React from 'react'
import './AboutUs.css'
import aboutHome from './../../../assets/book2.jpeg';
const AboutUs = () => {
  return (
    <section className='about-us'>
        <div className="container">
            <div className="about-content">
                <div className="about-text">
                    <h2>About Us</h2>

                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta, reiciendis illum quae, modi quo sapiente ab deleniti recusandae totam velit laboriosam esse tenetur alias placeat, quis laudantium provident harum neque?</p>

                </div>
                <div className="about-image">
                 <img src={aboutHome} alt="About Us" />
                </div>
            </div>
        </div>
    </section>
  );
};

export default AboutUs;
