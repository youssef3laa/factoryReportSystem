export function required(v) {
  if (Array.isArray(v)) return !!(v && v.length) || "Field is required";
  return !!v || "Field is required";
}
export function email(v) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(v) || "E-mail must be valid";
}
export function arabic(v) {
  return (
    /^[\u0621-\u064A0-9-_&/ ]+$/.test(v) || "Field accepts Arabic letters only"
  );
}
export function english(v) {
  return (
    /^[a-zA-Z 0-9-_&/ ]+$/g.test(v) || "Field accepts English letters only"
  );
}
export function number(v) {
  return !isNaN(v) || "Field accepts numbers only";
}
export function dateRangeOrEmpty(v) {
  return (
    !v || (Array.isArray(v) && v.length > 1) || "Field accepts date ranges only"
  );
}
export function numberArray(v) {
  return (
    (Array.isArray(v) && v.every((n) => !isNaN(n))) ||
    "Field accepts numbers only"
  );
}
