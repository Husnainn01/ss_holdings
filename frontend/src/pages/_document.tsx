import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          {/* Add a script to provide window.location polyfill for SSR */}
          <script dangerouslySetInnerHTML={{
            __html: `
              // Polyfill window.location for SSR
              if (typeof window !== 'undefined' && window.location) {
                // window.location exists, do nothing
              } else {
                // Create a minimal polyfill for window.location
                if (typeof window !== 'undefined') {
                  window.location = window.location || {
                    protocol: 'https:',
                    host: 'example.com',
                    hostname: 'example.com',
                    port: '',
                    pathname: '/',
                    search: '',
                    hash: '',
                    href: 'https://example.com/',
                    origin: 'https://example.com',
                    assign: function() {},
                    replace: function() {},
                    reload: function() {},
                    toString: function() { return this.href; }
                  };
                }
              }
            `
          }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
