import moment from "moment";
import { compensationRangeOptions, contractTypeOptions, experienceLevelOptions } from "./formConstants";
import { SMALL_MOBILE_MAX_WIDTH } from "./constants";

// rating is returned on scale of 1-10
// we need scale of 1-5 stars including half stars
// convertRating will divide rating by 2
// with options to return a number or a string with one decimal place
export function convertRating(num: number, returnType = "number") {
  if (returnType === "string") {
    return (num / 2).toFixed(1);
  }
  return num / 2;
}

// screen size is at or under mobile breakpoint
export const screenIsMobileSize = (screenWidth: number) => {
  return screenWidth <= SMALL_MOBILE_MAX_WIDTH;
};

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getLastSegment = (str : string) => {
  const pathSegments = str.split('/'); // Split the str or path by '/'
  const lastSegment = pathSegments[pathSegments.length - 1];
  return lastSegment;
}

export const getFormData = (formInfo: any, imageKey: string) => {
  const formData = new FormData();
  for (let key in formInfo) {
    if(key === imageKey && formInfo[key]?.length){
      formInfo[key].forEach((i: any) => {
        formData.append(key, i);
      });
    }else{
      let value = formInfo[key];
      formData.append(key, value);
    } 
  }
  return formData;
}

export const getFormDataNew = (formInfo: any, arrayFields: any) => {
  const formData = new FormData();
  for (let key in formInfo) {
    if(arrayFields.includes(key) && formInfo[key]?.length){
      formInfo[key].forEach((i: any) => {
        formData.append(key, i);
      });
    }else{
      let value = formInfo[key];
      formData.append(key, value);
    } 
  }
  return formData;
}

export const skills = [
  { value: "web development", label: "Web Development" },
  { value: "mobile development", label: "Mobile Development" },
  {
    value: "database design and management",
    label: "Database Design and Management",
  },
  { value: "cloud computing", label: "Cloud Computing" },
  { value: "project management", label: "Project Management" },
  { value: "data analysis", label: "Data Analysis" },
  { value: "data visualization", label: "Data Visualization" },
  {
    value: "artificial intelligence and machine learning",
    label: "Artificial Intelligence and Machine Learning",
  },
  { value: "blockchain development", label: "Blockchain Development" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "ui/ux design", label: "UI/UX Design" },
  { value: "graphic design", label: "Graphic Design" },
  { value: "video editing", label: "Video Editing" },
  { value: "copywriting", label: "Copywriting" },
  { value: "social media marketing", label: "Social Media Marketing" },
  { value: "javascript", label: "JavaScript" },
  { value: "php", label: "PHP" },
  { value: "java", label: "Java" },
  { value: "python", label: "Python" },
  { value: "solidity", label: "Solidity" },
  { value: "rust", label: "Rust" },
];

export const jobDescriptionTemplate = `<h4 style="text-align:start;"><span style="color: rgb(32,33,36);background-color: rgb(255,255,255);font-size: 18px;font-family: Jost, sans-serif;">Job Description</span></h4>
<p style="text-align:start;"><span style="color: dimgray;background-color: rgb(255,255,255);font-size: 15px;font-family: Jost, sans-serif;">Job description here.</span></p>
<h4 style="text-align:start;"><span style="color: rgb(32,33,36);background-color: rgb(255,255,255);font-size: 18px;font-family: Jost, sans-serif;">Key Responsibilities</span></h4>
<ul>
<li style="margin-left:1.5em;"><span style="color: dimgray;background-color: rgb(255,255,255);font-size: 15px;font-family: Jost, sans-serif;">Your points related to key responsibilities</span></li>
</ul>
<h4 style="text-align:start;"><span style="color: rgb(32,33,36);background-color: rgb(255,255,255);font-size: 18px;font-family: Jost, sans-serif;">Skill &amp; Experience</span></h4>
<ul>
<li style="margin-left:0px;"><span style="color: dimgray;background-color: rgb(255,255,255);font-size: 15px;font-family: Jost, sans-serif;">Your points related to skills and experience</span></li>
</ul>`

export const formatToLblValObj = (data: any) => {
  if(data[0] && data[0].value) return data;
  return data.map((v: string) => ({
    value: v,
    label: v,
  }));
}

export const formatToArray = (data: any) => {
  return data.map((v:{value: string}) => v.value);
}

interface Opt{
  value: string
}
export const returnOptionLabel = (options: any, value: any) => {
  return options.find((opt: Opt) => opt.value === value)?.label ?? value;
}

export const shortAddress = (ethAddress:string): string => {
  if(!ethAddress) return '';
  return `${ethAddress.slice(0, 4)}...${ethAddress.slice(38)}`;
};


export const createDummyFileObject = (fileName: string, dummyType = 'application/octet-stream') => {
  const blob:any = new Blob([''], { type: dummyType });
  blob.name = fileName;

  const file = new File([blob], fileName, { type:  dummyType});

  return file;
}

const units = ['k', 'm', 'b', 't'];

export function toPrecision(number: number, precision: number = 1) {
  return number
    .toString()
    .replace(new RegExp(`(.+\\.\\d{${precision}})\\d+`), '$1')
    .replace(/(\.[1-9]*)0+$/, '$1')
    .replace(/\.$/, '');
}

export function formatETHbalance(number: any): string {
  if (number < 1) return toPrecision(number, 3);
  if (number < 10 ** 2) return toPrecision(number, 2);
  if (number < 10 ** 4)
    return new Intl.NumberFormat().format(parseFloat(toPrecision(number, 1)));

  const decimalsDivisor = 10 ** 1; // 1 decimal place

  let result = String(number);

  for (let i = units.length - 1; i >= 0; i--) {
    const size = 10 ** ((i + 1) * 3);

    if (size <= number) {
      number = (number * decimalsDivisor) / size / decimalsDivisor;

      result = toPrecision(number, 1) + units[i];

      break;
    }
  }
  return result;
}

export const shortStr = (str: string): string => {
  if(!str?.length) return str;
  return `${str.slice(0, 10)}...${str.slice(str.length - 5)}`;
};

export const responsiveShortUrl = (
  str: string,
  screenWidth: number,
): string => {
  if (!str?.length) return str;

  let leftChars = 10;
  let newStr = "";

  const breakpoints = {
    xxs: 320,
    xs: 400,
    sm: 576,
    md: 768,
    lg: 992,
    llg: 1024,
    xl: 1200,
    xxl: 1400,
  };

  if (str.toLowerCase().includes("http://")) newStr = str.slice(7, str.length);
  if (str.toLowerCase().includes("https://")) newStr = str.slice(8, str.length);

  if (screenWidth >= breakpoints.xxl) {
    leftChars = 33;
  } else if (screenWidth >= breakpoints.xl) {
    leftChars = 21;
  } else if (screenWidth >= breakpoints.llg) {
    leftChars = 10;
  } else if (screenWidth >= breakpoints.lg) {
    leftChars = 25;
  } else if (screenWidth >= breakpoints.md) {
    leftChars = 20;
  } else if (screenWidth >= breakpoints.sm) {
    leftChars = 45;
  } else if (screenWidth >= breakpoints.xs) {
    leftChars = 25;
  } else if (screenWidth >= breakpoints.xxs) {
    leftChars = 13;
  } else {
    leftChars = 10;
  }

  if (newStr.length <= leftChars) return newStr;

  return `${newStr.slice(0, leftChars)}...`;
};

export const getTelegramURI = (telegramUsername: string): string => {
  if (telegramUsername.indexOf("@") !== -1) {
    telegramUsername = telegramUsername?.split("@")[1] ?? "";
  }
  return `https://t.me/${telegramUsername}`;
}

export const getInitials = (name: string): string => {
  const names = name.split(' ');
  const initials = names.map((part) => part.charAt(0).toUpperCase()).join('');
  return initials.length > 1 ? initials : name.substring(0, 2).toUpperCase();
}

export const getJobData = (jobData: Job) => {
  let companyName, companyId = '';
  let {
    companyImage,
    jobTitle,
    location,
    companyProfileId,
    userId,
    postedOn,
    postedOnRaw,
    compensation,
    currencyType,
    contractType,
    experienceLevel,
    jobDescriptionFormatted,
    skillsRequired,
    applicationDeadline,
    alreadyApplied,
    isActive
  }: Job = jobData;

  contractType = returnOptionLabel(contractTypeOptions, contractType);
  experienceLevel = returnOptionLabel(experienceLevelOptions, experienceLevel);
  compensation = returnOptionLabel(compensationRangeOptions, compensation);
  postedOnRaw = moment(postedOnRaw).fromNow() ?? postedOn;
  let applicationDeadlineFormatted = moment(
    applicationDeadline,
    "MM/DD/YYYY"
  ).format("MMM Do, YYYY");

  if(companyProfileId?.companyName){
    companyName = companyProfileId?.companyName
  }

  if(userId?._id){
    companyId = userId?._id
  }

  let companyTelegram = '';
  if(userId?.telegramUsername){
    companyTelegram = getTelegramURI(userId?.telegramUsername)
  }

  return {
    companyTelegram,
    companyName,
    companyId,
    companyImage,
    jobTitle,
    location,
    companyProfileId,
    userId,
    postedOn,
    postedOnRaw,
    compensation,
    currencyType,
    contractType,
    experienceLevel,
    jobDescriptionFormatted,
    applicationDeadlineFormatted,
    skillsRequired,
    applicationDeadline,
    alreadyApplied,
    isActive
  }
}

export const formatIpfsURI = (ipfsUriHash: string) => {
  if (ipfsUriHash) {
    const ipfs = ipfsUriHash.split("/");
    if(ipfs?.[2]){
      const url = `https://ipfs.io/ipfs/${ipfs[2]}`;
      return url;
    };
  }
  return ipfsUriHash;
}