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
