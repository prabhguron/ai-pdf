"use client";
const BreadCrumb = ({ title = "" }) => {
  return (
    <div className="upper-title-box mt-3 mb-4">
      <h3>{title}</h3>
      <div className="text d-none">Ready to jump back in?</div>
    </div>
  );
};

export default BreadCrumb;
