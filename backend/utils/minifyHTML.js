const { minify } = require("html-minifier-terser");
const minifyHtml = async (html) => {
  const result = await minify(html, {
    caseSensitive: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    conservativeCollapse: true,
    decodeEntities: true,
    html5: true,
    minifyCSS: true,
    quoteCharacter: "'",
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
  });
  return result;
};
// result; // '<p title=blah id=moo>foo</p>'
module.exports = { minifyHtml };
