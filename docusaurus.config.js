// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github")
const darkCodeTheme = require("prism-react-renderer/themes/dracula")

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "My Site",
  tagline: "Dinosaurs are cool",
  url: "https://gao-hongxiang.github.io/",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "facebook", // Usually your GitHub org/user name.
  projectName: "docusaurus", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "test1",
        path: "test1",
        routeBasePath: "test1",
        sidebarPath: require.resolve("./test1.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "typescript",
        path: "typescript",
        routeBasePath: "typescript",
        sidebarPath: require.resolve("./typescript.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "design",
        path: "design",
        routeBasePath: "design",
        sidebarPath: require.resolve("./design.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "leetcode",
        path: "leetcode",
        routeBasePath: "leetcode",
        sidebarPath: require.resolve("./leetcode.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "react",
        path: "react",
        routeBasePath: "react",
        sidebarPath: require.resolve("./react.js"),
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "My Site",
        logo: {
          alt: "My Site Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            label: "test1",
            to: "test1/intro",
            position: "left",
          },
          {
            label: "TypeScript",
            to: "typescript/intro",
            position: "left",
          },
          {
            label: "React",
            to: "react/intro",
            position: "left",
          },
          {
            label: "Leectode",
            to: "leetcode/intro",
            position: "left",
          },
          {
            label: "Design",
            to: "design/intro",
            position: "left",
          },
          {
            type: "doc",
            position: "left",
            docId: "intro",
            label: "Docs",
          },
          {
            to: "https://gao-hongxiang.github.io/blog/",
            label: "Blog",
            position: "right",
          },
          {
            href: "https://github.com/Gao-Hongxiang",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Tutorial",
                to: "/docs/intro",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Stack Overflow",
                href: "https://stackoverflow.com/questions/tagged/docusaurus",
              },
              {
                label: "Discord",
                href: "https://discordapp.com/invite/docusaurus",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/docusaurus",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "/blog",
              },
              {
                label: "GitHub",
                href: "https://github.com/facebook/docusaurus",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
}

module.exports = config
