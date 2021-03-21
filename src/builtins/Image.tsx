import React, { useContext } from "react";
import { context } from "dumi/theme";

interface ImageProps {
  name: string;
  caption?: string;
  alt?: string;
}

const Image: React.FC<ImageProps> = ({ name }) => {
  const {
    base,
    meta: { filePath },
  } = useContext(context);

  return (
    <img src={`${base}${filePath.replace("index.md", "")}${name}`} alt="" />
  );
};

export default Image;
