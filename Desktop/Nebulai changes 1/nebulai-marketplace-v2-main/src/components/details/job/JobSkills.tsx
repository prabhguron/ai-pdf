import { skills } from "@/utils/helper";

const JobSkills = ({skillsInfo=[]}:{skillsInfo: string[]}) => {
  return (
    <ul className="job-skills">
      {skillsInfo.map((skill, i) => (
        <li key={i}>
          <span className="skill-category">{skills.find(s => s.value === skill)?.label ?? skill}</span>
        </li>
      ))}
    </ul>
  );
};

export default JobSkills;
