# Logseq Classy

This plugin queries the block database for matching blocks and applies classes to the DOM allowing improved custom stylesheets.

## Settings

The queries settings can be use to complement toggle buttons or independently to facilitate custom stylesheet effects impossible without Style Carousel.  Matching blocks are dynamically marked with class names in the DOM.

* `query` — Datalog query which returns blocks.  Inputs are noted with positional placeholders (e.g.  `{0}`, `{1}`).
* `inputs` — Optional query input(s).
* `matches` — Optional regular expression(s) expressed as strings for further filtering blocks by their content text.
* `classname` — Class name to apply to matching block elements found in the DOM.

The following settings example demonstrates how to mark the DOM with the `overdue-task` and `future-task` classes:

```json
{
  "disabled": false,
  "queries": [
    {
      "query": "[:find (pull ?block [*]) :where (?block :block/scheduled ?d) [(< ?d {0})]]",
      "inputs": [
        "today 0"
      ],
      "classname": "overdue-task",
      "matches": [],
      "disabled": false,
      "refreshRate": 30
    },{
      "query": "[:find (pull ?block [*]) :where (?block :block/scheduled ?d) [(> ?d {0})]]",
      "inputs": [
        "today 0"
      ],
      "classname": "future-task",
      "matches": [],
      "disabled": false,
      "refreshRate": 30
    }
  ]
}
```

## Queries

Queries are global and do not only target the current page blocks.  The dynamically-added classes do, however.  When the user edits a block any resulting class changes to the DOM will not take effect until the next query refresh.

### Calculations

Logseq calculates relative values but [it does not expose them in a manner plugins can utilize](https://discuss.logseq.com/t/support-relative-values-e-g-resolve-input-in-plugin-queries/6010).  This plugin, therefore, currently only implements one calculation: `today`.  It accepts a single argument, an offset from today.  Thus, 0 is today, -1 yesterday, 1 tomorrow, etc.  More calculations can be added as needs arise.

Calculations (like Logseq's `resolve-input`) target both query `inputs` and regex `matches`.  However, there are currently no calculations suitable for generating regular expressions (that is, `matches` use).  Those too can be added as needs arise.

## Manual installation
* Download this repo
* In Logseq:
  * Ensure Developer Mode is on
  * Open Plugins
  * Select `Load unpacked plugin`

## License
[MIT](./LICENSE.md)

