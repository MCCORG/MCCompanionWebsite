/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'overview',
      label: 'Overview'
    },
    {
      type: 'category',
      label: 'How to use',
      collapsible: true,
      collapsed: false,
      items: [
        { type: 'doc', id: 'howto/friend-howto', label: 'Friends Mode' },
        { type: 'doc', id: 'howto/java-howto', label: 'Java Mode' },
        { type: 'doc', id: 'howto/nintendo-howto', label: 'Nintendo Switch' },
        { type: 'doc', id: 'howto/playstation-xbox-howto', label: 'PlayStation & Xbox' },
      ],
    },
    {
      type: 'category',
      label: 'Common issues',
      collapsible: true,
      collapsed: false,
      items: [
        { type: 'doc', id: 'issues/dns-issue', label: 'Nintendo DNS Not Working' },
        { type: 'doc', id: 'issues/does-not-appear-issue', label: 'NetherLink Not Appearing' },
        { type: 'doc', id: 'issues/friend-issue', label: 'Friends Mode Not Working' },
        { type: 'doc', id: 'issues/mcf-issue', label: 'Multiplayer Connection Failed' },
      ],
    },
  ],
};

export default sidebars;