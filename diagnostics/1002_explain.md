Occurs when there is an unterminated string literal somewhere. String literals
must be enclosed by single (`'`) or double (`"`) quotes.

Often, it caused by an attempt to use a string literal over multiple lines:

```js
const str = "Here is some text
  that I want to break
  across multiple lines.";
```
