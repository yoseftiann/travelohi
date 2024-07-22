import star from "../assets/icon/star.png"; // Make sure the path to your star image is correct

interface Props {
  stars: number;
}

export default function Stars({ stars }: Props) {
  // Generate the star images based on the `stars` prop
  const starImages = [];
  for (let i = 0; i < stars; i++) {
    starImages.push(
      <img
        key={i}
        src={star}
        alt="star"
        style={{ width: "1.5rem", height: "1.5rem" }}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "1rem",
        padding: "0.5rem 0",
      }}
    >
      <span
        style={{
          fontSize: "1.25rem",
        }}
      >
        {stars} / 5
      </span>
      <div>{starImages}</div>
    </div>
  );
}
