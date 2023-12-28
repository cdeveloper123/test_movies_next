"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import Image from "next/image";
import { create } from "@/app/components/method";
import { toaster } from "@/app/components/toaster";

const PostCreate = () => {
  const router = useRouter();

  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const send_token = cookies.token;

  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [poster, setPoster] = useState(null);
  const [posterError, setPosterError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [publishingYearError, setPublishingYearError] = useState("");
  const [title, setTitle] = useState("");
  const [publishingYear, setPublishingYear] = useState("");

  const handleDrop = (event) => {
    event.preventDefault();
    handleFileChange(event.dataTransfer.files[0]);
  };

  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setFile(e.target.result);
      };

      reader.readAsDataURL(selectedFile);
    } else {
      // Handle the case where the selected file is not an image
      console.error("Please select a valid image file.");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!poster) {
        setPosterError("Poster can't be blank");
      } else {
        setPosterError("");
      }
      if (title == "") {
        setTitleError("Title can't be blank");
      } else {
        setTitleError("");
      }
      if (publishingYear == "") {
        setPublishingYearError("Publishing Year can't be blank");
      } else if (publishingYear > 2028) {
        setPublishingYearError(
          "Publishing Year must be less than or equal to 2028"
        );
      } else {
        setPublishingYearError("");
      }

      // If any error is found, stop further processing
      if (posterError || titleError || publishingYearError) {
        return;
      }

      const movie = {
        title: title,
        publishing_year: publishingYear,
      };

      if (poster) {
        movie.poster = poster;
      }

      const response = await create(send_token, movie);

      if (response.status === 201) {
        toaster("Movie created successfully");
        router.push("/");
      }
    } catch (error) {
     
    }
  };

  return (
    <>
      <div className="mx-auto px-4 sm:px-6 lg:px-64 py-8">
        <div className="flex justify-between flex-wrap my-16">
          <div className="flex items-center">
            <h2 className="text-white text-center text-5xl font-semibold leading-[56px]">
              Create a new movie
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-16 p-0 mb-12">
          <div className="visible sm:hidden xs:block">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              name="Title"
              placeholder="Title"
              className={`w-full lg:w-[362px] h-45 flex-shrink-0 p-2 pl-4 mb-2 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                titleError ? "border border-[#EB5757] caret-[#EB5757]" : ""
              }`}
              autoComplete="on"
            />
            <p className="text-[#EB5757] ml-3 text-sm">{titleError ?? ""}</p>
            <br />
            <input
              type="text"
              value={publishingYear}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                setPublishingYear(numericValue);
                setPublishingYearError("");
              }}
              name="Publishing year"
              placeholder="Publishing year"
              className={`w-full lg:w-[216px] h-45 flex-shrink-0 p-2 pl-4 mb-2 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                publishingYearError
                  ? "border border-[#EB5757] caret-[#EB5757]"
                  : ""
              }`}
              autoComplete="on"
              pattern="\d*"
            />
            <p className="text-[#EB5757] ml-3 text-sm">
              {publishingYearError ?? ""}
            </p>
          </div>

          <div
            className={`w-full flex cursor-pointer h-[504px] p-2 space-y-4 flex-col items-center justify-center flex-shrink-0 rounded-[10px] border-2 border-dashed  ${
              posterError
                ? "border border-[#EB5757] caret-[#EB5757]"
                : "border-white"
            } bg-[#224957] z-10`}
            onDrop={handleDrop}
            onClick={handleDivClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/gif, image/jpeg"
              style={{ display: "none" }}
              className={`${
                posterError ? "border border-[#EB5757] caret-[#EB5757]" : ""
              }`}
              onChange={(e) => {
                handleFileChange(e.target.files[0]);
                setPoster(e.target.files[0]);
              }}
            />
            <div className="text-center">
              {file ? (
                <Image
                  src={file}
                  width={400}
                  height={350}
                  alt="preview"
                  className="max-w-full max-h-full"
                  style={{ height: "400px" }}
                />
              ) : (
                <>
                  <Image
                    src="/file_download.svg"
                    width={28}
                    height={28}
                    className="inline ml-2 mt-2"
                    alt="add"
                  />
                  <p className="text-white font-normal text-sm leading-6">
                    {file ? "Image uploaded!" : "Drop an image here"}
                  </p>
                </>
              )}
            </div>
            <p className="text-[#EB5757] ml-3 text-sm">{posterError ?? ""}</p>
          </div>

          <div className="w-full flex cursor-pointer h-[504px] p-2 space-y-4 flex-col items-center z-10">
            <div className="hidden sm:block sm:mr-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                name="Title"
                placeholder="Title"
                className={`w-[362px] h-45 flex-shrink-0 p-2 pl-4 mb-2 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                  titleError ? "border border-[#EB5757] caret-[#EB5757]" : ""
                }`}
                autoComplete="on"
              />
              <p className="text-[#EB5757] ml-3 text-sm">{titleError ?? ""}</p>
              <br />
              <input
                type="text"
                value={publishingYear}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  setPublishingYear(numericValue);
                  setPublishingYearError("");
                }}
                name="Publishing year"
                placeholder="Publishing year"
                className={`w-full lg:w-[216px] h-45 flex-shrink-0 p-2 pl-4 mb-2 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                  publishingYearError ? "border border-red-600" : ""
                }`}
                autoComplete="on"
                pattern="\d*"
              />
              <p className="text-[#EB5757] ml-3 text-sm">
                {publishingYearError ?? ""}
              </p>
            </div>
            <br />
            <div className="flex justify-between space-x-5 lg:space-x-3.5">
              <button
                onClick={() => {
                  router.push("/");
                }}
                className="w-[171px] h-14 items-center px-6 py-4 rounded-[10px] border border-white text-white font-bold text-base text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="w-[171px] h-14 items-center px-6 py-4 rounded-[10px] bg-[#2BD17E] text-white font-bold text-base text-center"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCreate;
