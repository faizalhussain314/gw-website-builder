import React, { useState, useEffect } from "react";
import GravityWriteLogo from "../assets/logo.svg";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFont, setColor } from "../Slice/activeStepSlice";

type Font = {
  family: string;
};

type SelectedColor = {
  primary: string;
  secondary: string;
};

type initialStyle = {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
};

const CustomizeSidebar: React.FC = () => {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [_selectedFont, setSelectedFont] = useState<string>("Roboto");
  const [selectedColor, setSelectedColor] = useState<SelectedColor>({
    primary: "",
    secondary: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchGoogleFonts = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyC7Pgm6Bf7aiTG8Qs92Qx0M8c2p1kOTOMc`
        );
        const data = await response.json();
        setFonts(data.items);
      } catch (error) {
        console.error("Error fetching Google Fonts:", error);
      }
    };

    fetchGoogleFonts();
  }, []);

  const handleFontChange = (
    _event: React.SyntheticEvent,
    value: string | null
  ) => {
    if (value) {
      setSelectedFont(value);
      dispatch(setFont(value));
      // Send message to iframe to change the font
      const iframes = document.getElementsByTagName("iframe");
      for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];
        iframe?.contentWindow?.postMessage(
          { type: "changeFont", font: value },
          "*"
        );
      }
    }
  };

  const handleColorChange = (color: SelectedColor) => {
    setSelectedColor(color);
    dispatch(setColor(color));

    const primaryColor = color.primary; // Example: primary color
    const secondaryColor = color.secondary;

    // Send message to iframe to change the global colors
    const iframes = document.getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      iframe?.contentWindow?.postMessage(
        { type: "changeGlobalColors", primaryColor, secondaryColor },
        "*"
      );
    }
  };

  const nextPage = () => {
    navigate("/final-preview");
  };

  const [initialStyles, setInitialStyles] = useState<initialStyle>({
    primaryColor: "",
    secondaryColor: "",
    fontFamily: "",
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "initialStyles") {
        console.log("data from iframe inital load", event.data);
        setInitialStyles({
          primaryColor: event.data.primaryColor,
          secondaryColor: event.data.secondaryColor,
          fontFamily: event.data.fontFamily,
        });
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const resetStyles = () => {
    // Dispatch default font to Redux store if necessary
    dispatch(setFont(initialStyles.fontFamily));

    // Send message to iframe to reset the styles
    const iframes = document.getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      iframe?.contentWindow?.postMessage(
        {
          type: "resetStyles",
          primaryColor: initialStyles.primaryColor,
          secondaryColor: initialStyles.secondaryColor,
          fontFamily: initialStyles.fontFamily,
        },
        "*"
      );
    }
  };

  return (
    <div className="bg-white min-h-screen h-screen z-10 border-2">
      <div className="flex items-center justify-between p-4">
        <img
          src={GravityWriteLogo}
          alt="Gravity Write Logo"
          className="h-10 cursor-pointer w-44"
        />
      </div>
      <div className={`p-4 block lg:block`}>
        <h2 className="text-xl font-bold">Customize</h2>
        <p className="text-sm text-gray-500">
          Add your own Logo, Changes Color and Fonts
        </p>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Site Logo</label>
          <input type="file" className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div className="mt-6">
          <div className="flex w-full justify-between">
            {" "}
            <label className="block text-base font-medium mb-2">
              Font
            </label>{" "}
            <span
              onClick={resetStyles}
              className="text-gray-400 text-base font-medium leading-5 cursor-pointer"
            >
              Reset
            </span>
          </div>
          <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={fonts.map((option) => option.family)}
            renderInput={(params) => (
              <TextField {...params} label="Choose Your Font" />
            )}
            onChange={handleFontChange}
            className="bg-white rounded-md mt-1 active:border-palatinate-blue-500 focus:border-palatinate-blue-500"
            aria-required="true"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Color</label>
          <div className="border-2 border-[#DFEAF6] p-3 rounded-md">
            <div className="grid grid-cols-5 gap-4">
              {[
                { primary: "#FF2F86", secondary: "#FDF4FF" },
                { primary: "#7F27FF", secondary: "#F5F3FF" },
                { primary: "#5755FE", secondary: "#F2F2FE" },
                { primary: "#E421F4", secondary: "#FEF6FF" },
                { primary: "#16A34A", secondary: "#F0FDF4" },
                { primary: "#3D065A", secondary: "#F9ECFF" },
                { primary: "#FF8329", secondary: "#FFF7ED" },
                { primary: "#0E17FB", secondary: "#F6F6FF" },
                { primary: "#009FF1", secondary: "#F0F9FF" },
                { primary: "#FF5151", secondary: "#FEF2F2" },
              ].map((color) => (
                <div
                  key={color.primary}
                  className={`${
                    selectedColor.primary === color.primary
                      ? "border-2 border-palatinate-blue-500 rounded-md"
                      : ""
                  } flex items-center justify-center p-1`}
                >
                  <button
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: color.primary }}
                    onClick={() => handleColorChange(color)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 max-w-[18%] flex absolute bottom-0 justify-between">
          <div className="mb-4 w-full flex justify-between gap-2">
            <button className="border previous-btn flex px-4 py-3 text-base sm:text-sm text-white mt-8 sm:mt-2 rounded-md gap-3 justify-center">
              <ArrowBackIcon /> Previous
            </button>
            <button
              onClick={nextPage}
              className="px-6 py-3 bg-blue-500 text-white rounded-md tertiary text-lg sm:text-sm mt-8 sm:mt-2"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeSidebar;
