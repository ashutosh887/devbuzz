export const featureFlags = {
  SHOW_OTP_AS_TOAST: true,
};

export const postConstraints = {
  MIN_TITLE_LENGTH: 10,
  MAX_TITLE_LENGTH: 100,
  MIN_CONTENT_WORDS: 100,
};

const config = {
  appName: "DevBuzz",
  appTitle: "Where Developers Build, Share, and Grow.",
  author: {
    name: "@ashutosh887",
    url: "https://www.linkedin.com/in/ashutosh887/",
  },
  featureFlags,
  postConstraints,
};

export default config;
