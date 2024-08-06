import Image from "next/image";

const HowItWorksBlock = () => {
  const blockContent = [
    {
      id: 1,
      icon: "/img/resource/job-hero/howItWorks/process-1.png",
      title: (
        <>
          Register and Ignite <br /> your Journey 
        </>
      ),
    },
    {
      id: 2,
      icon: "/img/resource/job-hero/howItWorks/process-2.png",
      title: (
        <>
          Explore over thousands <br />
          of talents
        </>
      ),
    },
    {
      id: 3,
      icon: "/img/resource/job-hero/howItWorks/process-3.png",
      title: (
        <>
          Find the most suitable <br />
          talent
        </>
      ),
    },
  ];
  return (
    <>
      {blockContent.map((item) => (
        <div className="process-block col-lg-4 col-sm-12" key={item.id}>
          <div className="icon-box">
            <Image src={item.icon} alt="how it works" width={90} height={60}/>
          </div>
          <h4>{item.title}</h4>
        </div>
      ))}
    </>
  );
};

export default HowItWorksBlock;
