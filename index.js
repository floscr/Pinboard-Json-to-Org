const R = require('ramda');
const D = require('date-fns');
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
)

const orgPrintEntry = function(x) {
  return `** [[${x.href}][${formatDescription(x.description)}]] ${formatTags(x.tags)}
:PROPERTIES:
:time: ${x.time}
:END:
${x.extended}
`;
}

const buildEntries = R.pipe(
  R.map(R.over(
    R.lensProp('time'),
    R.pipe(
      x => D.parse(x),
      x => D.format(x, 'YYYY-MM-DD ddd hh:mm'),
      x => `[${x}]`,
    ),
  )),
  R.sortBy(R.prop('time')),
  R.map(orgPrintEntry),
  R.join(""),
  x => `* Entries\n${x}`,
)

const main = function() {
  const entries = buildEntries(data.entries)
  fs.writeFile("entries.org", entries, function(err) {
    if (err) return console.log(err);
    console.log("The file was saved!");
  });
}

main();
