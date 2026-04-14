// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */

const config = {
  title: 'NetherLink — Connect Any Minecraft Bedrock Server to Console',
  tagline: 'NetherLink Documentation',
  favicon: 'img/favicon.ico',

  plugins: ["./src/plugins/tailwind-config.js"],

  future: { v4: true },

  url: 'https://netherdevmc.github.io',    // ← Base repo URL voor GitHub Pages
  baseUrl: '/',                       // ← Subpath van je GitHub Pages (laat zo als je hierop publiceert)

  organizationName: 'NetherDevMc',
  projectName: 'NetherLinkWebsite',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs',  // ← HIER! Docs staan nu op /docs/
          editUrl: 'https://github.com/NetherDevMc/NetherLinkWebsite/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'NetherLink Docs',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/NetherDevMc/NetherLinkWebsite',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} NetherLink. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.dracula,
        darkTheme: prismThemes.dracula,
      },
      metadata: [
        { name: "description", content: "NetherLink lets you connect any Minecraft Bedrock server to PlayStation, Xbox, and Nintendo Switch via LAN — no port forwarding needed. Available on Windows, macOS, Android and iOS." },
        { name: "keywords", content: "NetherLink, Minecraft Bedrock, console server, PlayStation Minecraft, Xbox Minecraft, Nintendo Switch Minecraft, LAN proxy, no port forwarding" },
        { name: "author", content: "Jens-Co" },
        { name: "theme-color", content: "#0a0a0f" },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://netherlink.net" },
        { property: "og:site_name", content: "NetherLink" },
        { property: "og:title", content: "NetherLink — Connect Any Minecraft Bedrock Server to Console" },
        { property: "og:description", content: "One-tap connection to any Bedrock server on PlayStation, Xbox and Nintendo Switch. No port forwarding, zero config. Just play." },
        { property: "og:locale", content: "en_US" }
      ],
    }),
};

export default config;