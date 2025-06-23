import React from "react";

export const ContactHeader: React.FC = () => {
  return (
    <>
      <h1 className="text-txt-black-600 font-semibold text-3xl font-[inter] mb-2.5">
        How can customers contact you?
      </h1>
      <span className="text-lg text-txt-secondary-500 max-w-[720px]">
        Provide the contact details you'd like to display on your website, so
        customers can easily reach you.
      </span>
    </>
  );
};
