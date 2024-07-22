import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import "./styles/round-container.css";

interface IRoundContainer {
  color: string;
  icon?: IconDefinition;
  imageSrc?: string;
  fontColor?: string;
  onClick?: () => void;
  tooltipText?: string;
}

export default function RoundContainer(props: IRoundContainer) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div
      className="round-container"
      style={{
        height: "40px",
        width: "40px",
        background: props.color,
        color: props.fontColor ? props.fontColor : "black",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={props.onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {props.icon && <FontAwesomeIcon icon={props.icon} />}
      {props.imageSrc && (
        <img
          src={props.imageSrc}
          alt="Profile"
          style={{
            width: "calc(100% - 4px)",
            height: "calc(100% - 4px)",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      )}
      {/* Tooltip */}
      {props.tooltipText && (
        <div
          // className="tooltip"
          style={{
            position: "absolute",
            top: "calc(100% + 5px)",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: isHovered ? '1' : '0',
            transition: 'opacity 0.4s ease-in-out',
            marginTop:'0.5rem',
          }}
        >
          <span
            style={{
              display: "block",
              background: "rgba(8, 7, 7, 0.25)",
              boxShadow: "0 2px 8px 0 rgba(31, 38, 135, 0.37)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              color: "white",
              borderRadius: "4px",
              padding: "8px 10px",
              zIndex:4
            }}
          >
            {props.tooltipText}
          </span>
        </div>
      )}
    </div>
  );
}
