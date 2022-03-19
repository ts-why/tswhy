# tswhy

A community effort to enrich TypeScript diagnostics.

## Usage

The application is intended to be used with
[Deno Deploy](https://deno.com/deploy). Developing locally requires the usage of
[Deno CLI](https://deno.land). The local server is started using:

```
deno task start
```

You should get something like the following output:

```
Task start deno run --allow-read --allow-net --allow-env --allow-hrtime main.ts
Listening on: http://0.0.0.0:8080/
```

And the development server should be available on localhost on port 8080.

---

MIT License

Copyright 2022 the TSWhy Authors. All rights reserved.
