# Lazy Shortcuts

Lazy Shortcuts is a Chrome Extension that allows you to create URL shortcuts for
your local browser.

For example, you can type `m` and be redirected to `https://mail.google.com` or
`https://go/lazy-shortcuts/` to `https://github.com/nitobuendia/lazy-shortcuts`.

> [!NOTE]
> These URL shortcuts are only available on your local browser. You cannot share
> the short URLs with others and expect it to work. This is intentional and by
> design. If you need to share the URL with others, use a URL shortener instead.

## Installation

1.  Download or build the Chrome Extension zip file.

1.  Uncompress the zip files content into a folder.

1.  [Load the unpacked extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)
    into Google Chrome.

## Workflows

### Development

Install [Node.js](https://nodejs.org/en). The version of Node.js should match
the `"node"` key in `package.json`.

```sh
# Install dependencies.
npm install
```

### Build

Run the following commands to generate the Chrome Extension files.

```sh
# Create extension files.
npm run build

# Create zip file extension.
npm run package
```
