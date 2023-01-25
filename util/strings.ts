/** Replace template patterns like `{0}` and `{1}` with the values in the passed
 * map of `params`, returning the interpolated string. If the key is not found
 * in the params, the template pattern is not replaced.
 */
export function interpolate(
  template: string,
  params?: Map<string, string>,
): string {
  if (!params) {
    return template;
  }
  return template.replaceAll(
    /\{(\d+)\}/g,
    (substring: string, p1: string) => params.get(p1) ?? substring,
  );
}
