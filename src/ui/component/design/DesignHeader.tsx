import React from "react";

const DesignHeader: React.FC = () => {
  return (
    <>
      <h1 className="text-3xl font-semibold">
        Pick a template for your website
      </h1>
      <p className="mt-3 text-base font-normal leading-6 text-app-text text-txt-secondary-500">
        Choose the design that best fits your website's purpose. You can always
        customize it later!
      </p>
    </>
  );
};

export default DesignHeader;
