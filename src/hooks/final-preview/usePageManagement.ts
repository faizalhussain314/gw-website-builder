// hooks/usePageManagement.ts
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Page } from "types/page.type";
import { updateReduxPage } from "@Slice/activeStepSlice";

export const usePageManagement = (initialPages: Page[]) => {
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [selectedPage, setSelectedPage] = useState<string | null>("Home");
  const dispatch = useDispatch();

  const updatePageStatus = useCallback(
    (pageName: string, status: string, selected: boolean) => {
      setPages((prevPages) =>
        prevPages.map((page) => {
          if (page.name === pageName) {
            return { ...page, status, selected };
          }
          return page;
        })
      );
    },
    []
  );

  const handlePageNavigation = useCallback(
    (
      action: "next" | "skip" | "add",
      currentPage: string,
      currentPages: Page[]
    ) => {
      const currentPageIndex = pages.findIndex(
        (page) => page.name === currentPage
      );

      if (currentPageIndex !== -1) {
        const updatedPages = [...pages];

        if (
          action === "next" &&
          currentPage !== "Contact Us" &&
          currentPage !== "Blog"
        ) {
          updatedPages[currentPageIndex].status = "Generated";
          updatedPages[currentPageIndex].selected = true;

          dispatch(
            updateReduxPage({
              name: updatedPages[currentPageIndex].name,
              status: "Generated",
              selected: true,
            })
          );
        } else if (
          action === "next" &&
          (currentPage === "Contact Us" || currentPage === "Blog")
        ) {
          updatedPages[currentPageIndex].status = "Added";
          updatedPages[currentPageIndex].selected = true;

          dispatch(
            updateReduxPage({
              name: updatedPages[currentPageIndex].name,
              status: "Added",
              selected: true,
            })
          );
        } else if (action === "skip") {
          updatedPages[currentPageIndex].status = "Skipped";
          updatedPages[currentPageIndex].selected = false;

          dispatch(
            updateReduxPage({
              name: updatedPages[currentPageIndex].name,
              status: "Skipped",
              selected: false,
            })
          );
        } else if (action === "add") {
          if (
            updatedPages[currentPageIndex].status === "Generated" &&
            updatedPages[currentPageIndex].name !== "Home"
          ) {
            updatedPages[currentPageIndex].status = "Not Selected";
            updatedPages[currentPageIndex].selected = false;

            dispatch(
              updateReduxPage({
                name: updatedPages[currentPageIndex].name,
                status: "Generated",
                selected: true,
              })
            );
          } else if (updatedPages[currentPageIndex].status === "Not Selected") {
            updatedPages[currentPageIndex].status = "Generated";
            updatedPages[currentPageIndex].selected = true;
            dispatch(
              updateReduxPage({
                name: updatedPages[currentPageIndex].name,
                status: "Generated",
                selected: true,
              })
            );
          } else if (
            currentPages[currentPageIndex]?.status === "" ||
            currentPages[currentPageIndex]?.status === "Skipped"
          ) {
            updatedPages[currentPageIndex].status = "Added";
            updatedPages[currentPageIndex].selected = true;
            dispatch(
              updateReduxPage({
                name: updatedPages[currentPageIndex].name,
                status: "Added",
                selected: true,
              })
            );
          } else if (currentPages[currentPageIndex]?.status === "Added") {
            updatedPages[currentPageIndex].status = "";
            updatedPages[currentPageIndex].selected = false;
            dispatch(
              updateReduxPage({
                name: updatedPages[currentPageIndex].name,
                status: "",
                selected: false,
              })
            );
          }
        }

        setPages(updatedPages);
      }
    },
    [pages, dispatch]
  );

  const selectNextPage = useCallback(
    (currentPage: string) => {
      const currentPageIndex = pages.findIndex(
        (page) => page.name === currentPage
      );

      const arrayVal = rearrangeArray(pages, currentPageIndex);

      if (arrayVal?.length > 0) {
        const nextPage = arrayVal.find(
          (page: Page) =>
            page.status !== "Generated" &&
            page.status !== "Skipped" &&
            page.status !== "Added"
        );
        if (nextPage) {
          setSelectedPage(nextPage.name);
        }
      }
    },
    [pages]
  );

  const rearrangeArray = (array: Page[], startIndex: number) => {
    if (startIndex < 0 || startIndex >= array.length) {
      throw new Error("Index out of bounds");
    }

    const part1 = array.slice(startIndex);
    const part2 = array.slice(0, startIndex);
    return part1.concat(part2);
  };

  return {
    pages,
    setPages,
    selectedPage,
    setSelectedPage,
    updatePageStatus,
    handlePageNavigation,
    selectNextPage,
  };
};
