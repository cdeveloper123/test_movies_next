"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import Image from "next/image";
import EmptyPosts from "../EmptyPosts";
import { logout, movies } from "../method";
import { toaster, toasterError } from "../toaster";

const Posts = () => {
  const [postData, setPostData] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const router = useRouter();

  const send_token = cookies.token;

  const movieData = async (pageNumber) => {
    if (!cookies.token) {
      return;
    }
    const queryPageNumber = `?page=${pageNumber}`;

    await movies(send_token, queryPageNumber)
      .then((response) => {
        setPostData(response.data);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          removeCookie("token");
          router.push("/login");
        }
      });
  };

  const logoutUser = async () => {
    try {
      const response = await logout(send_token);

      if (response.data.status === 200) {
        toaster(response.data.message);
        removeCookie("token");
        router.push("/login");
      } else {
        toasterError(response.data.error);
      }
    } catch (error) {
      toasterError("Something went wrong");
      console.error("Error:", error.message);
    }
  };

  const pages = [];
  for (let i = 1; i <= postData?.meta?.total_pages; i++) {
    pages.push(i);
  }

  useEffect(() => {
    movieData(selectedPage);
  }, [selectedPage, cookies]);

  return (
    <>
      {postData?.items?.length > 0 ? (
        <div className="mx-auto px-4 sm:px-6 lg:px-64 py-8">
          <div className="flex justify-between flex-wrap my-16">
            <div className="flex items-center">
              <h2 className="text-white text-center text-2xl lg:text-5xl font-semibold leading-[56px]">
                My movies
              </h2>
              <Image
                src="/add_circle_outline_black.svg"
                width={28}
                height={28}
                className="ml-2 lg:mt-2 cursor-pointer"
                alt="add"
                onClick={() => {
                  router.push("/posts/create");
                }}
              />
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => logoutUser()}
            >
              <h2 className="text-white text-center text-base font-bold mt-0.5 hidden sm:block">
                Logout
              </h2>

              <Image
                src="/logout_back.svg"
                width={28}
                height={28}
                className="ml-2 cursor-pointer"
                alt="logout"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 p-0 mb-12">
            {postData?.items?.map((items, index) => {
              return (
                <div
                  key={index}
                  className="w-full flex cursor-pointer h-[334px] lg:h-[504px] p-0 lg:p-2 space-y-4 flex-col items-start flex-shrink-0 rounded-xl bg-[#092C39] hover:bg-[#1E414E] backdrop-filter backdrop-blur-[100px] z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/posts/edit/${items.id}`);
                  }}
                >
                  <div>
                    <Image
                      src={items.attributes.poster_url}
                      alt="post"
                      width={0}
                      height={0}
                      sizes="100vw"
                      priority={true}
                      className="w-[400px] rounded-t-lg lg:rounded-xl h-[246px] lg:h-[400px]"
                    />
                    <h2 className="py-1 p-2 lg:p-2 lg:py-3 font-medium text-white text-base lg:text-xl leading-8">
                      {items.attributes.title}
                    </h2>
                    <p className="text-white font-normal text-sm leading-6 p-2 lg:p-2">
                      {items.attributes.publishing_year}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <EmptyPosts />
      )}
      {postData?.meta?.total_pages > 1 && (
        <div className=" text-white flex justify-center py-16 z-100 mb-32 static	">
          <div className="flex gap-4">
            {selectedPage != 1 && (
              <button
                onClick={() => setSelectedPage(selectedPage - 1)}
                className="font-mono leading-6	text-base	font-bold rounded w-10 h-8"
              >
                Prev
              </button>
            )}
            {pages.map((items, index) => {
              return (
                <button
                  key={index}
                  onClick={() => setSelectedPage(index + 1)}
                  aria-current="page"
                  className={`bg-[#092C39] font-mono leading-6	text-base	font-bold	rounded w-8 h-8 ${
                    selectedPage == index + 1 &&
                    "bg-[#2BD17E] font-mono leading-6	text-base	font-bold	rounded w-8 h-8"
                  }`}
                >
                  {items}
                </button>
              );
            })}
            {postData?.meta?.total_pages > selectedPage && (
              <button
                onClick={() => setSelectedPage(selectedPage + 1)}
                className="font-mono leading-6	text-base	font-bold rounded w-8 h-8"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Posts;
