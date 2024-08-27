import React from "react";
import Skeleton from "@mui/material/Skeleton";

const PlumberPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-5 w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-40 px-10 mt-10">
        <Skeleton variant="text" width={150} height={40} className="mb-2" />{" "}
        <div className="flex gap-10 justify-evenly">
          <Skeleton variant="text" width={70} height={30} className="mb-2" />{" "}
          <Skeleton variant="text" width={100} height={30} className="mb-2" />{" "}
          <Skeleton variant="text" width={70} height={30} className="mb-2" />{" "}
          <Skeleton variant="text" width={70} height={30} className="mb-2" />{" "}
          <Skeleton variant="text" width={100} height={30} className="mb-2" />{" "}
        </div>
        <div className="flex gap-5">
          <Skeleton
            variant="rectangular"
            width={140}
            height={40}
            className="mb-2"
          />{" "}
          {/* Call to Action */}
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex justify-between items-center px-10 mt-30">
        <div className="flex-1 pr-8">
          <Skeleton variant="text" width="80%" height={60} className="mb-1" />{" "}
          {/* Title 1 */}
          <Skeleton
            variant="text"
            width="80%"
            height={60}
            className="mb-"
          />{" "}
          <div className="mt-2">
            {/* Subtext */}
            <Skeleton
              variant="text"
              width="75%"
              height={20}
              className="mb-5 mt-60"
            />
            <Skeleton
              variant="text"
              width="75%"
              height={20}
              className="mb-5 mt-60"
            />
            <Skeleton
              variant="text"
              width="75%"
              height={20}
              className="mb-5 mt-60"
            />
            <Skeleton
              variant="text"
              width="75%"
              height={20}
              className="mb-5 mt-60"
            />{" "}
          </div>
          <Skeleton
            variant="rectangular"
            width={160}
            height={50}
            className="mt-5"
          />{" "}
          {/* Call to Action Button */}
        </div>
        <div className="flex-1">
          <Skeleton
            variant="rectangular"
            width="80%"
            height={300}
            className="rounded-lg"
          />{" "}
          {/* Image with rounded corners */}
        </div>
      </div>
    </div>
  );
};

export default PlumberPageSkeleton;
