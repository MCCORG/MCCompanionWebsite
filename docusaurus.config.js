// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */

const config = {
  title: 'MCCompanion — Connect Any Minecraft Bedrock Server to Console',
  tagline: 'MCCompanion Documentation',
  favicon: 'img/logo.png',

  plugins: ["./src/plugins/tailwind-config.js"],

  future: { 
    v4: true,
  },

  url: 'https://mccompanion.net',
  baseUrl: '/',

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
          routeBasePath: 'docs',
          editUrl: 'https://github.com/NetherDevMc/MCCompanionWebsite/tree/main/docs/',
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
        logo: {
          alt: 'MCCompanion Logo',
          src: 'img/logo.png',
        },
        title: 'MCCompanion Docs',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/NetherDevMc/MCCompanionWebsite',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} MCCompanion. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.dracula,
        darkTheme: prismThemes.dracula,
      },
      metadata: [
        { name: "description", content: "MCCompanion lets you connect any Minecraft Bedrock server to PlayStation, Xbox, and Nintendo Switch via LAN — no port forwarding needed. Available on Windows, macOS, Android and iOS." },
        { name: "keywords", content: "MCCompanion, Minecraft Bedrock, console server, PlayStation Minecraft, Xbox Minecraft, Nintendo Switch Minecraft, LAN proxy, no port forwarding" },
        { name: "author", content: "Jens-Co" },
        { name: "theme-color", content: "#0a0a0f" },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://mccompanion.net" },
        { property: "og:site_name", content: "MCCompanion" },
        { property: "og:title", content: "MCCompanion — Connect Any Minecraft Bedrock Server to Console" },
        { property: "og:description", content: "One-tap connection to any Bedrock server on PlayStation, Xbox and Nintendo Switch. No port forwarding, zero config. Just play." },
        { property: "og:locale", content: "en_US" }
      ],
    }),
};

export default config;