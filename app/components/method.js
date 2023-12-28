import axios from "axios";

const paths = async (path, method, token, data) => {
  return await axios({
    method: method,
    url: `${process.env.NEXT_PUBLIC_HOST}${path}`,
    data: data,
    headers: {
      Authorization: token,
      "Content-Type": "multipart/form-data",
    },
  });
};

const apiPaths = {
  login: "/login",
  signup: "/signup",
  logout: "/logout",
  movies: "/movies",
};

const login = (token, loginData) => {
  const userData = {
    user: loginData,
  };

  let response = paths(apiPaths.login, "post", token, userData);
  return response;
};

const signup = (token, signupData) => {
  const userData = {
    user: signupData,
  };

  let response = paths(apiPaths.signup, "post", token, userData);
  return response;
};

const logout = async (token) => {
  let response = await paths(apiPaths.logout, "delete", token);

  return response;
};

const movies = async (token, queryPageNumber) => {
  const moviePathname = apiPaths.movies.concat(queryPageNumber);

  let response = await paths(moviePathname, "get", token);

  return response;
};

const edit = (token, postId, movie) => {
  const createMoviePathname = `${apiPaths.movies}/${postId}`;

  const movieData = {
    movie: movie,
  };

  let response = paths(createMoviePathname, "put", token, movieData);
  return response;
};

const get = (token, postId) => {
  const createMoviePathname = `${apiPaths.movies}/${postId}`;

  let response = paths(createMoviePathname, "get", token);
  return response;
};

const create = (token, movie) => {
  const movieData = {
    movie: movie,
  };
  let response = paths(apiPaths.movies, "post", token, movieData);
  return response;
};

export { login, logout, edit, signup, movies, get, create };
