import Image from "next/image";
import React from "react";

interface RoleSelectProps {
  step: number;
  nextStep?: () => void;
  role: Role;
  updateRole: (r: Role) => void;
}

const RoleSelect = ({ nextStep, role, updateRole }: RoleSelectProps) => {
  return (
    <section className="banner-section -type-14">
      <div className="auto-container">
        <div className="row">
          <div className="content-column col-lg-4 col-md-4 col-sm-12">
            <div
              className="inner-column z-3"
              data-aos="fade-up"
              data-aos-delay="50"
            >
              <div className="row">
                <div className="col-lg-10">
                  <span className="nebulai-purple fw-bold">
                    Welcome To Nebulai!
                  </span>
                  <div className="title-box mb-3">
                    <h1 className="fw-bolder">SELECT YOUR ROLE</h1>
                  </div>
                  <span className="fw-bolder nebulai-purple text-nowrap mb-3 d-none d-md-block d-none-599">
                    Let&apos;s start by selecting your account type.{" "}
                  </span>
                  <span className="fw-bold text-wrap d-none d-md-block d-none-599">
                    Choose &apos;Organization&apos; if you&apos;re signing up on
                    behalf of your company. This will customize your
                    registration process to better suit your business needs.
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* End .col */}

          <div className="col-lg-8 col-md-8 d-flex justify-content-center align-items-center mb-5 mt-sm-0">
            <div className="mt-4 container text-center ">
              <div className="row row-cols-1 row-cols-md-2">
                <div className="col mb-4 col-6 col-sm-6">
                  <div
                    className={`card h-350px roleCard ${
                      role === "company" && "roleCardActive"
                    }`}
                    onClick={() => {
                      updateRole("company");
                      nextStep?.();
                    }}
                  >
                    <div className="card-body d-flex justify-content-center align-items-center">
                      <h1 className="card-title">
                        {/* <FaRegBuilding size={90} /> */}
                        <Image
                          src="/img/resource/registration/org.jpg"
                          width={250}
                          height={250}
                          alt="ORGANIZATION"
                          loading="lazy"
                        />
                      </h1>
                    </div>
                    <div className="card-body">
                      <h2 className="fw-bold regOrgCard d-none d-sm-block">
                        I am an Organization
                      </h2>
                      <h2 className="fw-bold regOrgCard d-block d-sm-none text-nowrap">
                        Organization
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="col mb-4 col-6 col-sm-6">
                  <div
                    className={`card h-350px roleCard ${
                      role === "talent" && "roleCardActive"
                    }`}
                    onClick={() => {
                      updateRole("talent");
                      nextStep?.();
                    }}
                  >
                    <div className="card-body d-flex justify-content-center align-items-center">
                      <h1 className="card-title">
                        {/* <FaRegUser size={90} /> */}
                        <Image
                          src="/img/resource/registration/talent.png"
                          width={300}
                          height={300}
                          alt="TALENT"
                          loading="lazy"
                        />
                      </h1>
                    </div>
                    <div className="card-body">
                      <h2 className="fw-bold regTalentCard d-none d-sm-block">
                        I am a Talent
                      </h2>
                      <h2 className="fw-bold regOrgCard d-block d-sm-none">
                        Talent
                      </h2>
                    </div>
                  </div>
                </div>

                {/* <div className="col mb-4">
                  <div className="card h-350px roleCard d-none">
                    <div className="card-body d-flex justify-content-center align-items-center">
                      <h1 className="card-title">
                        <FaCubes size={90} />
                      </h1>
                    </div>
                    <div className="card-body">
                      <h2 className="fw-bold">I am a Solution Provider</h2>
                    </div>
                  </div>
                </div>
                <div className="col mb-4">
                  <div className="card h-350px roleCard d-none">
                    <div className="card-body d-flex justify-content-center align-items-center">
                      <h1 className="card-title">
                        <FaRegMoneyBillAlt size={90} />
                      </h1>
                    </div>
                    <div className="card-body">
                      <h2 className="fw-bold">I am a Investor</h2>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoleSelect;
