# tswhy

A community effort to enrich TypeScript diagnostics.

## Development Server

Start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.

## Building

The repository contains a build script, `deno task build` which provides two
subcommands:

### `deno task build docs`

This processes the diagnostic documentation in `/docs` and generates the
information in `/db` which is used to power the site.

### `deno task build scaffold`

This retrieves the main branch version of TypeScript diagnostic messages and
scaffolds out any diagnostics that are missing from the `/docs` path.

---

Copyright 2022 - 2023 the tswhy? authors

Licensed under
[CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1)
<img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" height="16" width="16" alt="Create Commons Logo" />
<img src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" height="16" width="16" alt="Creative Commons Attribution Logo" />
<img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1" height="16" width="16" alt="Creative Commons Share Alike Logo" />
