# Logseq Classy Plugin

Facilitates otherwise impossible custom stylesheets by applying classes to blocks identified in custom queries.  A great complement to [Style Carousel](https://github.com/mlanza/logseq-style-carousel).

## Settings

The queries settings can be use to complement toggle buttons or independently to facilitate otherwise impossible stylesheet effects.  Matching blocks are dynamically marked with class names in the DOM.

* `query` — Datalog query which returns blocks.  Query inputs, if used, are positionally noted with placeholders (e.g.  `{0}`, `{1}`).
* `inputs` — Optional query input(s).
* `matches` — Optional regular expression(s) expressed as strings for further filtering blocks by their content text.
* `classname` — Class name to apply to matching block elements found in the DOM.
* `refreshRate` — Seconds until query runs and refreshes on-screen classes.  The Logseq plugin api currently lacks a document or block update callback.  Without this, polling is the only viable alternative.

The following settings example demonstrates how to mark the DOM with the `overdue-task` and `future-task` classes:

```json
{
  "disabled": false,
  "queries": [
    {
      "query": "[:find (pull ?block [*]) :where [?block :block/marker ?marker] [(contains? #{\"TODO\",\"DOING\"} ?marker)] (or [?block :block/scheduled ?d] [?block :block/deadline ?d]) [(< ?d {0})]]",
      "inputs": [
        "today 0"
      ],
      "classname": "overdue",
      "matches": [],
      "disabled": false,
      "refreshRate": 10
    },
    {
      "query": "[:find (pull ?block [*]) :where [?block :block/marker ?marker] [(contains? #{\"TODO\",\"DOING\"} ?marker)] (or [?block :block/scheduled ?d] [?block :block/deadline ?d]) [(> ?d {0})]]",
      "inputs": [
        "today 0"
      ],
      "classname": "future",
      "matches": [],
      "disabled": false,
      "refreshRate": 10
    },
    {
      "query": "[:find (pull ?block [*]) :where [?block :block/marker ?marker] [(contains? #{\"TODO\",\"DOING\"} ?marker)] (or [?block :block/scheduled ?d] [?block :block/deadline ?d]) [(> ?d {0})]]",
      "inputs": [
        "today 90"
      ],
      "classname": "distant-future",
      "matches": [],
      "disabled": false,
      "refreshRate": 10
    }
  ]
}
```
Then in your `custom.css`:

```css
.distant-future {
  opacity: .5;
  transition: all .6s ease-in-out;
  cursor: pointer;
}
.distant-future:hover {
  opacity: 1;
  transition: all .6s ease-in-out;
}
.distant-future a.TODO::after,
.distant-future a.DOING::after,
.distant-future a.WAITING::after {
  content: " 🔮" !important;
}
.overdue a.TODO::after,
.overdue a.DOING::after,
.overdue a.WAITING::after {
  content: " ⌛" !important;
}
```

What is illustrated is an example.  Add whatever custom styles you like.

## Queries
Queries are global and do not only target the current page blocks.  The dynamically-added classes do, however.  When a block is edited any resulting class changes to the DOM will not take effect until the next query refresh.

### Calculations
Logseq calculates relative values but [it does not expose them in a manner plugins can utilize](https://discuss.logseq.com/t/support-relative-values-e-g-resolve-input-in-plugin-queries/6010).  This plugin, therefore, currently only implements one calculation: `today`.  It accepts a single argument, an offset from today.  Thus, 0 is today, -1 yesterday, 1 tomorrow, etc.  More calculations can be added as needs arise.

Calculations (like Logseq's `resolve-input`) target both query `inputs` and regex `matches`.  However, there are currently no calculations suitable for generating regular expressions (that is, `matches` use).  Those too can be added as needs arise.

## License
[MIT](./LICENSE.md)
