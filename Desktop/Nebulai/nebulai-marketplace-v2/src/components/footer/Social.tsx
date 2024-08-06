"use client"
interface SocialNetwork {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  discord?: string;
  website?: string;
}
const Social = ({socials}:{socials:SocialNetwork}) => {
  const {facebook, twitter, linkedin, discord} = socials;
  const socialContent = [
    { id: 1, icon: "fa-facebook-f", link: facebook ?? null },
    { id: 2, icon: "fa-twitter", link: twitter ?? null },
    { id: 3, icon: "fa-linkedin-in", link: linkedin ?? null },
    { id: 4, icon: "fa-discord", link: discord ?? null },
  ];
  return (
    <>
      {socialContent.map((item) => {
        return (item?.link && item?.link.length) && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              key={item.id}
            >
              <i className={`fab ${item.icon}`}></i>
            </a>
          )
      })}
    </>
  );
};

export default Social;
