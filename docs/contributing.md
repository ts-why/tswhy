# Contributing

Currently, to contribute to the project, submit a pull request directly to the
[tswhy](https://github.com/ts-why/tswhy) GitHub repository. In the future, we
plan to automate this process and be able to submit and modify documentation
directly from the site.

All diagnostics are scaffolded out in the
[`/docs`](https://github.com/ts-why/tswhy/tree/main/docs) directory and are used
to build the site. The documentation for a diagnostic is located in the
`{code}.md` file for the diagnostic, where the _code_ is the number (minus the
`TS`) of the diagnostic. A fix for a diagnostic should be located in
`{code}_fix_{id}.md` where the _code_ is the diagnostic number and the _id_ is
an increment of the fix, starting with `01`.

## Diagnostic Documents

Diagnostic documents contain YAML front matter that looks like this:

```yaml
---
title: Unterminated string literal.
category: error
tags:
- syntax-error
- incomplete-code
- strings
related:
- 1003
---
```

The `title` and `category` fields are generated directly from the TypeScript
error code and should not be adjusted.

### Diagnostic Fix Documents

Diagnostic fix documents should contain YAML front matter providing the title
for the fix, followed by the documentation in markdown format.

An example of the title front-matter:

```yaml
---
title: "'=' expected with type aliases"
---
```

And an example of documentation:

````md
Unlike interfaces, type aliases must have a left hand side and right hand side
of a statement, so code like this is invalid syntax:

```ts
type Person {
  age: number;
  name: string;
}
```

Instead it should look like this:

```ts
type Person = {
  age: number;
  name: string;
};
```
````
