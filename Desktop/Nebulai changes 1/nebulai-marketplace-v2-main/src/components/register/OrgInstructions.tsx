"use client";

interface Props {
  step: number;
  handlePrevClicked?: () => void;
  handleCreateAccount: () => void;
  handleNextClicked: () => void;
  savingRegistrationInfo: boolean;
}

const OrgInstructions = ({
  step,
  handlePrevClicked,
  handleCreateAccount,
  handleNextClicked,
  savingRegistrationInfo,
}: Props) => {
  const getStepHeader = () => {
    switch (step) {
      case 2:
        return "create your account";
      case 3:
        return "tell us about your company";
      case 4:
        return "designate your primary contact";
      default:
        return "create your account";
    }
  };

  const getStepInfo = () => {
    switch (step) {
      case 2:
        return "Set up your login details to get started with Nebulai.";
      case 3:
        return "Provide some basic information about your organization to help us tailor your experience.";
      case 4:
        return "Provide the contact details of the primary liaison for your organization. This individual will manage communications between your company and Nebulai.";
      default:
        return "To get started, please fill out the following information to create your account.";
    }
  };

  return (
    <div
      key={`instructions-${step}`}
      className="inner-column z-3 h-auto d-md-flex d-lg-block justify-content-md-center"
      data-aos="fade-up"
      data-aos-delay="50"
    >
      <div className="row h-auto d-md-flex justify-content-md-center w-100">
        <div
          className={`${step === 2 ? "col-md-10" : step === 4 ? "col-md-7" : "col-md-9"} col-12  col-lg-10`}
        >
          <span className="nebulai-purple fw-bold">LET&apos;S SET YOU UP!</span>
          <div className="title-box">
            <h1 className="fw-bolder">{getStepHeader().toUpperCase()}</h1>
          </div>
          <span className="fw-bold text-wrap d-none d-md-block d-none-599">
            {getStepInfo()}
          </span>
        </div>

        <div className="col-md-2 d-none d-md-flex justify-content-md-center d-none-599">
          <h2>
            <sup>{step}</sup>/<sub>4</sub>
          </h2>
        </div>
      </div>

      {/* md and up screen size form control buttons */}
      <div className="row gap-4">
        <div className="col-lg-3 d-lg-block d-none">
          <button
            className="theme-btn btn-style-three mt-4"
            type="button"
            onClick={handlePrevClicked}
          >
            Prev
          </button>
        </div>
        <div className="col-lg-6 d-lg-block d-none">
          {step === 4 ? (
            <button
              className="theme-btn btn-style-one mt-4"
              type="button"
              onClick={handleCreateAccount}
            >
              {savingRegistrationInfo ? (
                <>
                  Saving...{" "}
                  <span
                    className="spinner-border spinner-border-sm pl-4"
                    role="status"
                    aria-hidden="true"
                  ></span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          ) : (
            <button
              className="theme-btn btn-style-one mt-4"
              type="button"
              onClick={handleNextClicked}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrgInstructions;
