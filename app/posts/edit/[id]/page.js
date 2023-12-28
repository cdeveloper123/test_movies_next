"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import Image from "next/image";
import { useParams } from "next/navigation";
import { edit, get } from "@/app/components/method";
import { toaster } from "@/app/components/toaster";

const PostID = () => {
  const router = useRouter();

  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const send_token = cookies.token;
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [MoviesData, setMoviesData] = useState("");
  const [poster, setPoster] = useState(null);

  const [posterError, setPosterError] = useState("");
  const [title, setTitle] = useState(MoviesData.title ?? "");
  const [publishingYear, setPublishingYear] = useState(
    MoviesData.publishing_year ?? ""
  );
  const [titleError, setTitleError] = useState("");
  const [publishingYearError, setPublishingYearError] = useState("");

  useEffect(() => {

    setTitle(MoviesData.title);
    setPublishingYear(MoviesData.publishing_year);
  }, [MoviesData]);

  const params = useParams();

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

  const postId = params.id;

  const validatePoster = () => {
    if (poster == "") {
      setPosterError("poster must not be blank");
      return false;
    }
    return true;
  };

  const validateTitle = () => {
    if (title == "") {
      validatePublishingYear();
      setTitleError("Title must not be blank");
      return false;
    }
    return true;
  };

  const validatePublishingYear = () => {
    if (publishingYear > 2028) {
      setPublishingYearError(
        "Publishing year must be less than or equal to 2028"
      );
      return false;
    } else if (publishingYear == "") {
      setPublishingYearError("Publishing year must not be blank");
      return false;
    }
    return true;
  };

  const validateForm = () => {
    return validatePoster() && validateTitle() && validatePublishingYear();
  };

  const handleSubmit = async () => {
    try {
      setPosterError("");
      setTitleError("");
      setPublishingYearError("");

      if (!validateForm()) {
        return;
      }

      // Continue processing if no errors

      const movie = {
        title: title,
        publishing_year: publishingYear,
      };

      if (poster) {
        movie.poster = poster;
      }

      const response = await edit(send_token, postId, movie);

      if (response.status === 200) {
        toaster("Movie edit successfully");
      }
    } catch (error) {
  
    }
  };

  const getMovies = async () => {
    try {
      const response = await get(send_token, postId);

      setMoviesData(response.data.attributes);
    } catch (error) {
    
    }
  };

  useEffect(() => {
    getMovies();
  }, [cookies]);

  return (
    <>
      <div className="mx-auto px-4 sm:px-6 lg:px-64 py-8">
        <div className="flex justify-between flex-wrap my-16">
          <div className="flex items-center">
            <h2 className="text-white text-center text-5xl font-semibold leading-[56px]">
              Edit
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-16 p-0 mb-12">
          <div className="visible sm:hidden xs:block">
            <input
              value={title}
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              name="Title"
              placeholder="Title"
              className={`w-full lg:w-[362px] h-45 flex-shrink-0 p-2 pl-4 mb-2 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                titleError ? "border border-[#EB5757] caret-[#EB5757]" : ""
              }`}
              autoComplete="on"
            />
            <p className="text-[#EB5757] text-sm">{titleError ?? ""}</p>
            <br />
            <input
              value={publishingYear}
              type="number"
              onChange={(e) => {
                setPublishingYear(e.target.value);
              }}
              name="Publishing year"
              placeholder="Publishing year"
              className={`w-full lg:w-[216px] h-45 flex-shrink-0 p-2 pl-4 mb-2 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                publishingYearError
                  ? "border border-[#EB5757] caret-[#EB5757]"
                  : ""
              }`}
              autoComplete="on"
            />
            <p className="text-[#EB5757] text-sm">
              {publishingYearError ?? ""}
            </p>
          </div>

          <div
            className="w-full flex cursor-pointer h-[504px] p-2 space-y-4 flex-col items-center justify-center flex-shrink-0 rounded-[10px] border-2 border-dashed border-white bg-[#224957] z-10"
            onDrop={handleDrop}
            onClick={handleDivClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/png, image/gif, image/jpeg"
              onChange={(e) => {
                handleFileChange(e.target.files[0]);
                setPoster(e.target.files[0]);
              }}
              className={`${posterError ? "border border-[#EB5757]" : ""}`}
            />
            <div className="text-center">
              {file || MoviesData.poster_url ? (
                <Image
                  src={file || MoviesData?.poster_url}
                  width={400}
                  height={350}
                  alt="preview"
                  className="max-w-full max-h-full"
                  style={{ height: "400px" }}
                  priority={true}
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
                    {file ? "Image uploaded!" : "Drop other image here"}
                  </p>
                </>
              )}
            </div>
            <p className="text-[#EB5757] text-sm">{posterError ?? ""}</p>
          </div>

          <div className="w-full flex cursor-pointer h-[504px] p-2 space-y-4 flex-col items-center z-10">
            <div className="hidden sm:block sm:mr-2">
              <input
                value={title}
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                name="Title"
                placeholder="Title"
                className={`w-[362px] h-45 flex-shrink-0 p-2 pl-4 mb-2 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                  titleError ? "border border-[#EB5757] caret-[#EB5757]" : ""
                }`}
                autoComplete="on"
              />
              <p className="text-[#EB5757] text-sm">{titleError ?? ""}</p>
              <br />
              <input
                value={publishingYear}
                type="number"
                onChange={(e) => {
                  setPublishingYear(e.target.value);
                }}
                name="Publishing year"
                placeholder="Publishing year"
                className={`w-full lg:w-[216px] h-45 flex-shrink-0 p-2 pl-4 mb-2 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                  publishingYearError
                    ? "border border-[#EB5757] caret-[#EB5757]"
                    : ""
                }`}
                autoComplete="on"
              />
              <p className="text-[#EB5757] text-sm">
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
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostID;
