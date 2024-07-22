import { useState } from "react";
import "./styles/image-slider.css";
import ArrowButton from "./arrow-button";

export default function ImageSlider({images} : any) {
  //Current
  const [currentSet, setCurrentSet] = useState(0);

  const imagesToShow = 2;
  const maxSets = Math.ceil(images.length / imagesToShow);

  //Handle Button
  const prevSet = () => {
    setCurrentSet((currentSet) => Math.max(0, currentSet - 1));
  };

  const nextSet = () => {
    setCurrentSet((currentSet) => Math.min(maxSets - 1, currentSet + 1));
  };

  const startIndex = currentSet * imagesToShow;
  const endIndex = startIndex + imagesToShow;
  const displayedImages = images.slice(startIndex, endIndex);

  return (
    <div className="slider">
      {/* Left Arrow */}
      <ArrowButton direction="arrow-left" onClick={prevSet}/>
      {/* Map Images */}
      {displayedImages.map((image : string, index : number) => (
        <div className="container-slide" key={index}>
          <img src={image} alt={`Slide ${index}`} className="slide-img" />
        </div>
      ))}
      {/* Right Arrow */}
      <ArrowButton direction="arrow-right" onClick={nextSet}/>
    </div>
  );
}
