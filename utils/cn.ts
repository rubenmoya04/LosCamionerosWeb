export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function cn2(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}