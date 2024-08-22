export const COMPANY_INDUSTRY_OPTIONS = [
  {
    value: "technology",
    label: "Technology",
  },
  {
    value: "healthcare",
    label: "Healthcare",
  },
  {
    value: "finance",
    label: "Finance",
  },
  {
    value: "manufacturing",
    label: "Manufacturing",
  },
  {
    value: "education",
    label: "Education",
  },
  {
    value: "retail",
    label: "Retail",
  },
  {
    value: "transportation",
    label: "Transportation",
  },
  {
    value: "energy",
    label: "Energy",
  },
  {
    value: "government",
    label: "Government",
  },
  {
    value: "media",
    label: "Media",
  },
  {
    value: "other",
    label: "Other",
  },
];

export const COMPANY_SIZE_OPTIONS = [
  {
    value: 1,
    label: "1-10 employees",
  },
  {
    value: 2,
    label: "11-50 employees",
  },
  {
    value: 3,
    label: "51-200 employees",
  },
  {
    value: 4,
    label: "201-500 employees",
  },
  {
    value: 5,
    label: "501-1000 employees",
  },
  {
    value: 6,
    label: "1001-5000 employees",
  },
  {
    value: 7,
    label: "5001-10,000 employees",
  },
  {
    value: 8,
    label: "10,000+ employees",
  },
];

export const COMPANY_LOCATION_OPTIONS = [
  {
    value: "united states",
    label: "United States",
  },
  {
    value: "canada",
    label: "Canada",
  },
  {
    value: "united kingdom",
    label: "United Kingdom",
  },
  {
    value: "germany",
    label: "Germany",
  },
  {
    value: "france",
    label: "France",
  },
  {
    value: "japan",
    label: "Japan",
  },
  {
    value: "china",
    label: "China",
  },
  {
    value: "india",
    label: "India",
  },
  {
    value: "brazil",
    label: "Brazil",
  },
  {
    value: "australia",
    label: "Australia",
  },
  {
    value: "other",
    label: "Other",
  },
];

export const ROLE_IN_COMPANY_OPTIONS = [
  {
    value: "ceo/president",
    label: "CEO/President",
  },
  {
    value: "cto/cio",
    label: "CTO/CIO",
  },
  {
    value: "cfo",
    label: "CFO",
  },
  {
    value: "head of purchasing",
    label: "Head of Purchasing",
  },
  {
    value: "head of it",
    label: "Head of IT",
  },
  {
    value: "marketing director",
    label: "Marketing Director",
  },
  {
    value: "other",
    label: "Other",
  },
];

export const experienceLevelOptions = [
  { value: "junior", label: "Junior" },
  { value: "mid-level", label: "Mid-Level" },
  { value: "senior", label: "Senior" },
];

export const contractTypeOptions = [
  { value: "permanent", label: "Permanent" },
  { value: "part-time", label: "Part-Time" },
];

export const compensationRangeOptions = [
  { label: "$0 - $30,000/yr", value: "0-30000" },
  { label: "$30,000 - $50,000/yr", value: "30000-50000" },
  { label: "$50,000 - $70,000/yr", value: "50000-70000" },
  { label: "$70,000 - $100,000/yr", value: "70000-100000" },
  { label: "$100,000+/yr", value: "100000+" },
];

export const technologyOptions = [
  { value: "web development", label: "Web Development" },
  { value: "mobile development", label: "Mobile Development" },
  { value: "ai and machine learning", label: "AI and Machine Learning" },
  { value: "cybersecurity", label: "Cybersecurity" },
];

export const overAllWorkExperienceOptions = [
  { value: "0", label: "0-5" },
  { value: "1", label: "10-15" },
  { value: "2", label: "15-20" },
  { value: "3", label: "20-25" },
  { value: "4", label: "25-30" },
  { value: "5", label: "30+" },
];

export const profileTagOptions = [
  { value: "Web", label: "Web" },
  { value: "Mobile", label: "Mobile" },
  { value: "UI/UX", label: "UI/UX" },
  { value: "Frontend", label: "Frontend" },
  { value: "Backend", label: "Backend" },
  { value: "Full Stack", label: "Full Stack" },
  { value: "Data Science", label: "Data Science" },
  { value: "Machine Learning", label: "Machine Learning" },
  { value: "Artificial Intelligence", label: "Artificial Intelligence" },
  { value: "Cloud Computing", label: "Cloud Computing" },
  { value: "Cybersecurity", label: "Cybersecurity" },
  { value: "Product Management", label: "Product Management" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "Customer Support", label: "Customer Support" },
];

export const currencyTypeOptions:{
  value: string;
  label: string;
}[] = [
  //{ value: "usdt", label: "USDT" },
  { value: "nebtt", label: "Nebulai Test Token" },
  { value: "matic", label: "Matic" }
];

export const currencyImgMap:{
  [key: string]: string;
} = {
  'usdt' : '/img/resource/crypto/usdt-48.png',
  'usdc' : '/img/resource/crypto/usdc-48.png',
  'default' : '/img/resource/crypto/default.png',
  'nebtt' : '/img/logo.png',
  'matic' : '/img/resource/crypto/polygon-48.png',
}

// { value: "usdt", label: (
//   <div>
//     USDT {" "}
//     <img src={'/img/resource/crypto/usdt-48.png'} width={30} height={30} alt="USDT"/>
//   </div>
// ) },



export const currencyTypeOptionsNew = [
  {
    value: "nebtt",
    label: "NEB TEST TOKEN",
    imgSrc: "/img/logo.png",
    imgAlt: "Nebulai Test Token"
  },
  {
    value: "matic",
    label: "MATIC",
    imgSrc: "/img/resource/crypto/polygon-48.png",
    imgAlt: "MATIC"
  }
];