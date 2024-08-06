"use client";
import PostJobSteps from "./PostJobSteps";
import PostBoxForm from "./PostBoxForm";
import BreadCrumb from "@/components/common/BreadCrumb";
import CompleteOnBoarding from "@/components/common/CompleteOnBoarding";


const PostJob = () => {
  return (
    <>
      <BreadCrumb title="Post a New Job!" />
      {/* breadCrumb */}

      <div className="row">
        <div className="col-lg-12">
          {/* <!-- Ls widget --> */}
          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title">
              </div>

              <div className="widget-content">
                <CompleteOnBoarding>
                  <PostJobSteps />
                  <PostBoxForm />
                </CompleteOnBoarding>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End .row */}
    </>
  );
};

export default PostJob;
