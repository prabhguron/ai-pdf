import React from "react";

interface YouTubePlayerProps {
  videoId: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId }) => {
  return (
    <div className="col-12 col-sm-10 col-md-8 col-lg-7">
      <div className="ratio ratio-16x9" data-aos="fade-up">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default YouTubePlayer;
