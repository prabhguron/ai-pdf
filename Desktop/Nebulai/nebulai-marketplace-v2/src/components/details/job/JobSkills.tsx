import { skills } from "@/utils/helper";

const JobSkills = ({skillsInfo=[]}:{skillsInfo: string[]}) => {
  return (
    <ul className="job-skills">
      {skillsInfo.map((skill, i) => (
        <li key={i}>
          <a href="#">{skills.find(s => s.value === skill)?.label ?? skill}</a>
        </li>
      ))}
    </ul>
  );
};

export default JobSkills;
