/**
 * `io-chatto` is a plain custom element (Web Component) published by
 * https://github.com/RedTurtle/poc-rag-website-kb, loaded at runtime via a
 * <script> tag rather than as an npm dependency of this addon. This
 * declaration lets JSX render the tag with its documented attributes.
 */
declare namespace JSX {
  interface IntrinsicElements {
    'io-chatto': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      'api-url'?: string;
      'contact-email'?: string;
      'widget-title'?: string;
      lang?: string;
      'welcome-message'?: string;
      'ai-disclaimer'?: string;
    };
  }
}
