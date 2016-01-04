# virtual-select
This component aims to work well in rare scenarios in which `select2` or `selectize` don't cut it. Not because they are bad (which they are definitely not!), but because of horrible, horrible constraints of the project environment. Like being forced to pre-load and display all entries in the dropdown at once, because the backend request is incredibly slow. When we're talking about a couple thousand entries, this can become very slow and inefficient.

virtual-select is designed to minimize DOM manipulations and memory consumption, in order to deal with large amounts of data.
