import Link from "next/link";

const FooterContent = () => {
  const footerContent = [
    // {
    //   id: 1,
    //   title: "For Candidates",
    //   menuList: [
    //     { name: "Browse Jobs", route: "/job-list-v11" },
    //     { name: "Browse Categories", route: "/job-list-v3" },
    //     { name: "Candidate Dashboard", route: "/candidates-dashboard/dashboard" },
    //     { name: "Job Alerts", route: "/candidates-dashboard/job-alerts" },
    //     {
    //       name: "My Bookmarks",
    //       route: "/candidates-dashboard/short-listed-jobs",
    //     },
    //   ],
    // },
    // {
    //   id: 2,
    //   title: "For Employers",
    //   menuList: [
    //     { name: "Browse Candidates", route: "/candidates-list-v1" },
    //     { name: "Employer Dashboard", route: "/employers-dashboard/dashboard" },
    //     { name: "Add Job", route: "/employers-dashboard/post-jobs" },
    //     { name: "Job Packages", route: "/employers-dashboard/packages" },
    //   ],
    // },
    // {
    //   id: 3,
    //   title: "About Us",
    //   menuList: [
    //     { name: "About Us", route: "/about" },
    //     { name: "Job Page Invoice", route: "/invoice" },
    //     { name: "Terms Page", route: "/terms" },
    //     { name: "Blog", route: "/blog-list-v1" },
    //     { name: "Contact", route: "/contact" },
    //   ],
    // },
    {
      id: 1,
      title: "Helpful Resources",
      menuList: [
        { name: "FAQ", route: "/faq" },
        // { name: "Terms of Use", route: "/terms" },
        // { name: "Privacy Center", route: "/" },
        // { name: "Security Center", route: "/" },
        // { name: "Accessibility Center", route: "/" },
      ],
    },
  ];
  
  return (
    <>
      {footerContent.map((item) => (
        <div
          className="footer-column col-lg-3 col-md-6 col-sm-12"
          key={item.id}
        >
          <div className="footer-widget links-widget">
            <h4 className="widget-title">{item.title}</h4>
            <div className="widget-content">
              <ul className="list">
                {item?.menuList?.map((menu, i) => (
                  <li key={i}>
                    <Link href={menu.route}>{menu.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FooterContent;
