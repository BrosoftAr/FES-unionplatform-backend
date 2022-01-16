import React from "react";
import BackButton from "./BackButton";

interface BackCardTitleProps {
  title: string;
}

const BackCardTitle: React.FunctionComponent<BackCardTitleProps> = ({
  title,
}) => {
  return (
    <>
      <BackButton />
      <span>{title}</span>
    </>
  );
};
export default BackCardTitle;
