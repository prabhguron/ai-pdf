import NebConnectButton from "@/components/wallet/NebConnectButton";
import { disconnect } from '@wagmi/core'
import NebulaiApi from "@/neb-api/NebulaiApi";
import Link from "next/link";
import { useRouter } from 'next/navigation'


const SidebarFooter = () => {
  const router = useRouter();
  const {logoutUser} = NebulaiApi();

  const socialContent = [
    { id: 1, icon: "fa-facebook-f", link: "https://www.facebook.com/nebulaidigitalsolutions" },
    { id: 2, icon: "fa-twitter", link: "https://twitter.com/nebulaidigital" },
    { id: 3, icon: "fa-linkedin-in", link: "https://www.linkedin.com/in/company/nebulaidigital/" },
  ];

  const logoutHandler = async() => {
    await logoutUser();
    await disconnect();
    router.push('/')
  }

  return (
    <div className="mm-add-listing mm-listitem pro-footer">
 
      <NebConnectButton btnLbl={"Connect Wallet"}/>

      <Link href="#" className="mt-4" onClick={logoutHandler}>
        <i className={`la la-sign-out mt-4`}></i> SignOut
      </Link>

      {/* job post btn */}

      <div className="mm-listitem__text d-none">
        <div className="contact-info">
          <span className="phone-num">
            <span>Call us</span>
            <a href="tel:9548241488">(954) 824-1488</a>
          </span>
          <span className="address">
          66 W Flagler St suite 900, <br />
          Miami, FL 33130
          </span>
          <a href="mailto:support@nebulai.com" className="email">
            support@nebulai.com
          </a>
        </div>
        {/* End .contact-info */}

        <div className="social-links">
          {socialContent.map((item) => (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              key={item.id}
            >
              <i className={`fab ${item.icon}`}></i>
            </a>
          ))}
        </div>
        {/* End social-links */}
      </div>
      {/* End .mm-listitem__text */}
    </div>
  );
};

export default SidebarFooter;
