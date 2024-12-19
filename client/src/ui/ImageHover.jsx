import styled from "styled-components";

const ImageWrapper = styled.div`
  margin-bottom: 10px;
  display: inline-block;
`;

const HoverableImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;

  &:hover {
    /* transition-delay: 0.2s;
    transform: scale(5); */
    transition-delay: ${(props) => (props.delay ? `${props.delay}s` : "0.2s")};
    transform: scale(${(props) => props.scale ?? 5});
  }
`;

const ImageHover = ({ imageSrc, delay, scale }) => {
  if (!imageSrc) return <p>Image Not Available</p>;
  return (
    <ImageWrapper>
      <HoverableImage src={imageSrc} delay={delay} scale={scale} />
    </ImageWrapper>
  );
};

export default ImageHover;
