const axios = require("axios").default;

async function getWordPressToken() {
  const token = await axios({
    method: "POST",
    url: `${process.env.WORDPRESS_BASE_URL}/wp-json/api/v1/token `,
    data: {
      username: `${process.env.WORDPRESS_NAME}`,
      password: `${process.env.WORDPRESS_PW}`,
    },
  });
  return token;
}

async function getAllWordPressPost() {
  try {
    const token = await getWordPressToken();
    console.log(token);
    const wordPressPost = await axios.get(
      "https://hweitian.com/wp-json/wp/v2/posts",
      {
        headers: {
          Authorization: `Bearer ${token["data"]["jwt_token"]}`,
        },
      }
    );
    console.log(wordPressPost);
    return wordPressPost;
  } catch (err) {
    console.log(err);
    // return res.status(400).json({ error: true, msg: err });
  }
}
async function createPost(html, title, sessionCode) {
  try {
    const token = await getWordPressToken();
    // console.log(token, "token");
    const wordPressPost = await axios.post(
      "https://hweitian.com/wp-json/wp/v2/posts",
      {
        content: html,
        status: "publish",
      },
      {
        headers: {
          Authorization: `Bearer ${token["data"]["jwt_token"]}`,
        },
      }
    );
    console.log(wordPressPost, "wordpresspost");
    return wordPressPost.data.link;
  } catch (err) {
    console.log(err);
    // return res.status(400).json({ error: true, msg: err });
  }
}
async function updateOnePage(pageId, data) {
  try {
    const token = await getWordPressToken();
    console.log("At updateOnePage utils");
    const wordPressPost = await axios.post(
      `https://hweitian.com/wp-json/wp/v2/pages/${pageId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token["data"]["jwt_token"]}`,
        },
      }
    );
    // console.log(wordPressPost);
    return wordPressPost;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getWordPressToken,
  getAllWordPressPost,
  updateOnePage,
  createPost,
};
