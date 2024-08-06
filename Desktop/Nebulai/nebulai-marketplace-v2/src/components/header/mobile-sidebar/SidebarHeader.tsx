import Image from "next/image";
import Link from "next/link";


const SidebarHeader = () => {
  return (
    <div className="pro-header">
      <Link href="/">
        <Image src="/img/logo1.png" alt="brand" width={150} height={150} />
      </Link>
      {/* End logo */}

      <div className="fix-icon" data-bs-dismiss="offcanvas" aria-label="Close">
        <span className="flaticon-close"></span>
      </div>
      {/* icon close */}
    </div>
  );
};

export default SidebarHeader;
