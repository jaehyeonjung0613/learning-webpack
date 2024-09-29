declare module '*.png' {
  const content: string;
  export default content;
}
declare module '*.xml' {
  const content: { [key: string]: string };
  export default content;
}
declare module '*.csv' {
  const content: string[];
  export default content;
}
declare module '*.toml' {
  const content: { [key: string]: any };
  export default content;
}
declare module '*.yaml' {
  const content: { [key: string]: any };
  export default content;
}
declare module '*.json5' {
  const content: { [key: string]: any };
  export default content;
}
