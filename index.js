const R = require('ramda');
const fs = require('fs');

const data = require('./data/pinboard_export.json');

const formatTags = R.pipe(
  R.replace(/\s/g, ":"),
  R.replace(/-/g, "_"),
  R.toUpper,
  x => `:${x}:`,
);

const main = function() {
  const entries = data.entries.map(function(x) {
    return `
** [[${x.href}][${x.description}]] ${formatTags(x.tags)}
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
