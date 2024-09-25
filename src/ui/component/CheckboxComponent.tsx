import React from "react";

const CheckboxComponent = ({ page, onPageChange }) => {
  const handlePageClick = () => {
    // Toggle the selected state
    const newSelectedValue = !page.selected;
    // Update the selected state in the parent
    onPageChange(page.slug, newSelectedValue);
  };

  return (
    <div className="custom-checkbox">
      <label htmlFor={`checkbox-${page.slug}`}>
        <input
          id={`checkbox-${page.slug}`}
          type="checkbox"
          className="mr-2"
          checked={page.selected}
          onChange={handlePageClick}
          disabled={page.status === ""}
        />
        {page.name}
      </label>
    </div>
  );
};

export default CheckboxComponent;
