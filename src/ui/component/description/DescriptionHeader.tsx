import React from "react";

interface DescriptionHeaderProps {
  businessName: string;
}

const DescriptionHeader: React.FC<DescriptionHeaderProps> = ({
  businessName,
}) => {
  return (
    <div className="flex flex-col">
      <h1 className="text-txt-black-600 font-semibold text-3xl font-[inter]">
        What is {businessName}? Tell us more about it.
      </h1>
      <span className="mt-2.5 text-lg leading-6 text-txt-secondary-400 max-w-[617px]">
        Let's get to know your Business! The more details you share, the better
        we can tailor your website.
      </span>
    </div>
  );
};

export default DescriptionHeader;
