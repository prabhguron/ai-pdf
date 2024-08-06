import Link from "next/link";
import MobileSidebarDashboardMain from "./mobile-sidebar-dashboard/MobileSidebarDashboardMain";
import Image from "next/image";

const MobileMenuDashboard = () => {
    return (
        // <!-- Main Header-->
        <header className="main-header main-header-mobile">
            <div className="auto-container">
                {/* <!-- Main box --> */}
                <div className="inner-box">
                    <div className="nav-outer">
                        <div className="logo-box">
                            <div className="my-2">
                                <Link href="/">
                                    <Image src="/img/logo1.png" width={200} height={200}  alt="brand" />
                                </Link>
                            </div>
                        </div>
                        {/* End .logo-box */}

                        <MobileSidebarDashboardMain />
                        {/* <!-- Main Menu End--> */}
                    </div>
                    {/* End .nav-outer */}

                    <div className="outer-box">
                        <a
                            href="#"
                            className="mobile-nav-toggler"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasMenu"
                            aria-label="Toggle sidebar"
                        >
                            <span className="flaticon-menu-1"></span>
                        </a>
                        {/* right humberger menu */}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default MobileMenuDashboard;
