import React from "react";
import Image from "next/image";
import heroImage from "../../../public/img/resource/job-hero/hero-nebulai-hd.png";

const JobHeroImage = () => {
  return (
    <div className="image-box">
      <figure className="main-image" data-aos="fade-in" data-aos-delay="800">
        <Image src={heroImage} alt="team graphic" priority={true} />
        {/* <img
          className="neb-hero-img"
          src="/img/resource/job-hero/hero-nebulai-hd.png"
          alt="1"
          loading="lazy"
        /> */}
      </figure>
      {/* End large image */}

      {/* <div
        className="image-part -type-1"
        data-aos="fade-in"
        data-aos-delay="900"
      >
        <img src="/img/resource/job-hero/2.png" alt="2" loading="lazy"/>
      </div>

      <div
        className="image-part -type-2 "
        data-aos="fade-in"
        data-aos-delay="1000"
      >
        <img src="/img/resource/job-hero/3.png" alt="3" loading="lazy"/>
      </div>

      <div
        className="image-part -type-3"
        data-aos="fade-in"
        data-aos-delay="1100"
      >
        <img src="/img/resource/job-hero/4.png" alt="4" loading="lazy"/>
      </div> */}
    </div>
  );
};

export default JobHeroImage;
