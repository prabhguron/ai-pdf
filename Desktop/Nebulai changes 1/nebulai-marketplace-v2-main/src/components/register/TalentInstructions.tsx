"use client";

interface Props {
  handlePrevClicked?: () => void;
  handleCreateAccount: () => void;
  savingRegistrationInfo: boolean;
}

const TalentInstructions = ({
  handlePrevClicked,
  handleCreateAccount,
  savingRegistrationInfo,
}: Props) => {
  const stepHeader = "CREATE YOUR ACCOUNT";
  const stepInstructions =
    "Showcase your skills, find job opportunities, and grow your network.";

  return (
    <div className="inner-column z-3" data-aos="fade-up" data-aos-delay="50">
      <div className="row h-100">
        <div className="col-lg-9 h-100">
          <span className="nebulai-purple fw-bold">LET&apos;S SET YOU UP!</span>
          <div className="title-box">
            <h1 className="fw-bolder">{stepHeader}</h1>
          </div>
          <span className="fw-bold text-wrap d-none d-md-block d-none-599">
            {stepInstructions}
          </span>
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
        </div>
      </div>
    </div>
  );
};

export default TalentInstructions;
