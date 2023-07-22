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
async function createPost(html, title, postCategoryId, wordPressUrl) {
  try {
    console.log("inside create post", wordPressUrl);
    const token = await getWordPressToken();
    // console.log(token, "token");
    const wordPressPost = await axios.post(
      `${wordPressUrl}/wp-json/wp/v2/posts`,
      {
        content: html,
        title: title,
        categories: [postCategoryId],
        status: "publish",
      },
      {
        headers: {
          Authorization: `Bearer ${token["data"]["jwt_token"]}`,
        },
      }
    );
    console.log(wordPressPost, "wordpresspost");
    return {
      wordPressPostLink: wordPressPost.data.link,
      wordPressPostId: wordPressPost.data.id,
    };
    // return wordPressPost.data.link;
  } catch (err) {
    console.log(err);
    // return res.status(400).json({ error: true, msg: err });
  }
}

async function getPostCategoriesId(speakerCountry, wordPressUrl) {
  console.log("inside getPostCategories", wordPressUrl);
  const slug = speakerCountry.toLowerCase();
  try {
    const token = await getWordPressToken();
    const { data } = await axios.get(
      `${wordPressUrl}/wp-json/wp/v2/categories/?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${token["data"]["jwt_token"]}`,
        },
      }
    );

    // If a category is found, return the category ID
    for (let i = 0; i < data.length; i++) {
      if (data[i].name === speakerCountry) {
        // console.log("Country existed");
        return data[i].id;
      }
    }

    // If no category matches, create a new category and return the category ID
    const catergory = await axios.post(
      `${wordPressUrl}/wp-json/wp/v2/categories`,
      {
        name: speakerCountry,
        slug: slug,
      },
      {
        headers: {
          Authorization: `Bearer ${token["data"]["jwt_token"]}`,
        },
      }
    );

    return catergory.data.id;
  } catch (err) {
    console.log(err);
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
async function createPage(html) {
  try {
    const token = await getWordPressToken();
    // console.log(token, "token");
    const wordPressPost = await axios.post(
      "https://hweitian.com/wp-json/wp/v2/pages",
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
    return {
      wordpressLink: wordPressPost.data.link,
      wordpressId: wordPressPost.data.id,
    };
  } catch (err) {
    console.log(err);
    // return res.status(400).json({ error: true, msg: err });
  }
}
async function deletePost(id) {
  try {
    const token = await getWordPressToken();
    const wordPressPost = await axios.delete(
      `https://hweitian.com/wp-json/wp/v2/posts/${id}`,
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

async function updateOnePost(postId, data) {
  try {
    const token = await getWordPressToken();
    console.log("At updateOnePost utils");
    // console.log(data);
    // const data = `<p>This is the updated post</p>`;
    const wordPressPost = await axios.post(
      `https://hweitian.com/wp-json/wp/v2/posts/${postId}`,
      {
        content: data,
        status: "publish",
      },
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
  }
}

async function createPage(html, title, sessionCode) {
  try {
    const token = await getWordPressToken();
    // console.log(token, "token");
    const wordPressPost = await axios.post(
      "https://hweitian.com/wp-json/wp/v2/pages",
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
    // console.log(wordPressPost, "wordpresspost");
    return wordPressPost.data.link;
  } catch (err) {
    console.log(err);
    // return res.status(400).json({ error: true, msg: err });
  }
}

module.exports = {
  getWordPressToken,
  getAllWordPressPost,
  createPage,
  updateOnePage,
  createPost,
  getPostCategoriesId,
  deletePost,
  updateOnePost,
  createPage,
};
