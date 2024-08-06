export {};

declare global {
  interface Window {
    $: any;
    Buffer: any;
    jQuery: any;
    Popper: any;
  }
}
