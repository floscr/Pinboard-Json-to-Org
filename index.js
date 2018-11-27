const R = require('ramda');
const fs = require('fs');

const data = require('./data/pinboard_export.json');

const formatTags = R.when(
  x => x !== "",
  R.pipe(
    R.replace(/\s/g, ":"),
    R.replace(/[-.]/g, "_"),
    R.toUpper,
    x => `:${x}:`,
  ),
)

const formatDescription = R.pipe(
  // Brackets dont play well with the org urls
  R.replace(/\[/g, "("),
  R.replace(/\]/g, ")"),
  // Remove freaking emojis
  R.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, ""),
)

const main = function() {
  const entries = data.entries.map(function(x) {
    return `
** [[${x.href}][${formatDescription(x.description)}]] ${formatTags(x.tags)}
:PROPERTIES:
:time: ${x.time}
:END:
${x.extended}`
  });
  fs.writeFile("entries.org", entries, function(err) {
    if (err) return console.log(err);
    console.log("The file was saved!");
  });
}

main();
