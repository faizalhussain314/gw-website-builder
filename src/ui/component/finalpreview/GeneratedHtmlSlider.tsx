import React, { useState } from "react";

const GeneratedHtmlSlider: React.FC<{ htmlVersions: string[] }> = ({
  htmlVersions,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex < htmlVersions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div>
      <button onClick={prevSlide} disabled={currentIndex === 0}>
        Previous
      </button>
      <div dangerouslySetInnerHTML={{ __html: htmlVersions[currentIndex] }} />
      <button
        onClick={nextSlide}
        disabled={currentIndex === htmlVersions.length - 1}
      >
        Next
      </button>
    </div>
  );
};

export default GeneratedHtmlSlider;
