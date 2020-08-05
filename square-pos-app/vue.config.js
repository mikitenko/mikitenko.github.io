module.exports = {
  lintOnSave: true, // set to false to disable lint on save
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/styles/app.scss";`
      }
    }
  },
  publicPath: process.env.NODE_ENV === "production" ? "/pos/" : "/"
};
