import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";

const BackButton: React.FunctionComponent<RouteComponentProps> = ({
  history,
}) => {
  return (
    <Button
      shape="circle"
      style={{ marginRight: 10 }}
      onClick={() => {
        history.goBack();
      }}
      icon={<ArrowLeftOutlined />}
    />
  );
};
export default withRouter(BackButton);
