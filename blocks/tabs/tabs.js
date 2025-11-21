export default function decorate(block) {
  // Build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  // Build tab panels
  const tabpanels = document.createElement('div');
  tabpanels.className = 'tabs-panels';

  // Process each row
  [...block.children].forEach((row, index) => {
    // First cell is the tab label
    const tabLabel = row.children[0];
    // Second cell is the tab content
    const tabContent = row.children[1];

    const tabId = `tab-${index}`;
    const panelId = `panel-${index}`;

    // Create tab button
    const tab = document.createElement('button');
    tab.className = 'tabs-tab';
    tab.id = tabId;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tab.setAttribute('aria-controls', panelId);
    tab.textContent = tabLabel.textContent.trim();
    tablist.append(tab);

    // Create tab panel
    const panel = document.createElement('div');
    panel.className = 'tabs-panel';
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.hidden = index !== 0;
    panel.innerHTML = tabContent.innerHTML;
    tabpanels.append(panel);

    // Add click handler
    tab.addEventListener('click', () => {
      // Update tabs
      [...tablist.children].forEach((t) => {
        t.setAttribute('aria-selected', 'false');
        t.classList.remove('active');
      });
      tab.setAttribute('aria-selected', 'true');
      tab.classList.add('active');

      // Update panels
      [...tabpanels.children].forEach((p) => {
        p.hidden = true;
      });
      panel.hidden = false;
    });

    // Set initial active state
    if (index === 0) {
      tab.classList.add('active');
    }
  });

  // Replace block content
  block.textContent = '';
  block.append(tablist, tabpanels);
}
