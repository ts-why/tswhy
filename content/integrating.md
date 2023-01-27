# Integrating

## APIs

There is a RESTful API available to obtain information about TypeScript
diagnostics. The API specification is available as an OpenAPI specification at
[`/tswhy-1.0.0.yml`](/tswhy-1.0.0.yml) and can be
[rendered as documentation](https://redocly.github.io/redoc/?url=https://tswhy.deno.dev/tswhy-1.0.0.yml).

## Linking

When linking to a diagnostic documentation page, and the diagnostic text
contains template parameters (e.g. `{0}` or `{1}`), they can be supplied and
will be interpolated with the rendered text. These can either be supplied as
query parameters in a `GET` request, or as form data in a `POST` request, where
the key is the number in the description template and the value is what gets
substituted.

An example of generating a _TS1005: ';' expected._ as a `GET` request:

```
curl --request POST \
  --url 'http://tswhy.deno.dev/ts1005?0=%3B' \
  --header 'Content-Type: application/x-www-form-urlencoded'
```

And as a `POST` request:

```
curl --request POST \
  --url http://tswhy.deno.dev/ts1005 \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data '0=;'
```
