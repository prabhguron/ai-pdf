"use client"
const TalentSkills = ({skills, tagStyle = false}:{skills: TalentSkill[], tagStyle?:boolean}) => {
  let skillLabels: string[] = skills.map((s) => s?.skill?.toUpperCase());
  return (
    <ul className={`${tagStyle?'post-tags': 'job-skills'}`}>
      {skillLabels.map((skill, i) => (
        <li key={i}>
          <a href="#">{skill}</a>
        </li>
      ))}
    </ul>
  );
};

export default TalentSkills;
