// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github")
const darkCodeTheme = require("prism-react-renderer/themes/dracula")

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "我的前端知识库",
  tagline: "探索前端世界的每一个角落",
  url: "https://ghx9908.github.io",
  deploymentBranch: "gh-pages",
  baseUrl: "/website/",
  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        language: ["en", "zh"],
        docsRouteBasePath: ["./design", "/leetcode", "/node", "/interview"],
      },
    ],
  ],
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "ghx9908", // Usually your GitHub org/user name.
  projectName: "website", // Usually your repo name.

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
        id: "engineering",
        path: "engineering",
        routeBasePath: "engineering",
        sidebarPath: require.resolve("./engineering.js"),
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
        id: "node",
        path: "node",
        routeBasePath: "node",
        sidebarPath: require.resolve("./node.js"),
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
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "vue",
        path: "vue",
        routeBasePath: "vue",
        sidebarPath: require.resolve("./vue.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "interview",
        path: "interview",
        routeBasePath: "interview",
        sidebarPath: require.resolve("./interview.js"),
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "我的前端知识库",
        logo: {
          alt: "My Site Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            label: "前端工程化",
            to: "engineering/intro",
            position: "left",
            activeBaseRegex: "/engineering/",
          },
          {
            label: "Node核心",
            to: "node/intro",
            position: "left",
            activeBaseRegex: "/node/",
          },
          {
            label: "React",
            to: "react/intro",
            position: "left",
            activeBaseRegex: "/react/",
          },
          {
            label: "Vue",
            to: "vue/intro",
            position: "left",
            activeBaseRegex: "/vue/",
          },
          {
            label: "Leectode",
            to: "leetcode/intro",
            position: "left",
            activeBaseRegex: "/leetcode/",
          },
          {
            label: "Design",
            to: "design/intro",
            position: "left",
            activeBaseRegex: "/design/",
          },
          {
            label: "Interview",
            to: "interview/intro",
            position: "left",
            activeBaseRegex: "/interview/",
          },
          {
            to: "https://ghx9908.github.io/",
            label: "Blog",
            position: "right",
          },
          {
            href: "https://github.com/ghx9908",
            label: "GitHub",
            position: "right",
          },
          {
            type: "dropdown",
            label: "更多",
            position: "right",
            items: [
              {
                label: "大数据可视化",
                to: "https://ghx9908.github.io/large-data-visualization/",
              },
            ],
          },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Gao HongXiang.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
}

module.exports = config
