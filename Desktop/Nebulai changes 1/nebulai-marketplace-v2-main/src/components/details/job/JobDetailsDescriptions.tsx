import DOMPurify from "dompurify";

const JobDetailsDescriptions = ({jobDescription}:{jobDescription: string}) => {
  function createMarkup(html: string) {
    return {
      __html: DOMPurify.sanitize(html)
    }
  }

  return (
    <div
      className="job-detail job-desc mt-2"
      dangerouslySetInnerHTML={createMarkup(jobDescription)}>
    </div>
  );
};

export default JobDetailsDescriptions;
