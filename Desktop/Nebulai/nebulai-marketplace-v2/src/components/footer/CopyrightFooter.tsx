"use client";

import Social from "./Social";

const CopyrightFooter = ({ social = true }) => {
  return (
    <div className="footer-bottom">
      <div className="auto-container">
        <div className="outer-box">
          <div className="copyright-text">
            © {new Date().getFullYear()} Nebulai Digital Transformation
            Solutions{" "}
            <a
              href="https://nebulai.com/"
              target="_blank"
              rel="noopener noreferrer"
            ></a>
          </div>
          {social && (
            <div className="social-links">
              <Social socials={{}}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CopyrightFooter;
