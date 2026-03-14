import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

const RTL_LOCALES = ['ar', 'ary'];

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    // router.locale is available in __NEXT_DATA__
    const { locale } = this.props.__NEXT_DATA__;
    const dir = RTL_LOCALES.includes(locale || '') ? 'rtl' : 'ltr';

    return (
      <Html lang={locale} dir={dir}>
        <Head>
          {/* Metadata can stay here */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Tajawal:wght@200;300;400;500;700;800;900&family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </Head>
        <body className="antialiased text-neutral-900 bg-white selection:bg-primary-light selection:text-primary">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
