let sites = ['google', 'bing', 'yahoo', 'baidu', 'ask', 'duckduckgo', 'stackoverflow', 'stackexchange', 'ecosia']; 	// sites to remove
let tlds = ['com', 'org']; // top level domains

let pattern = [];

for (let i = 0; i < sites.length; i++) { // form valid url patterns with sites and tlds
	const site = sites[i];
	for (let j = 0; j < tlds.length; j++) {
		const tld = tlds[j];
		pattern.push(`https://*.${sites[i]}.${tlds[j]}/*`);
	}
}

const closeDupes = () => {		// removes duplicate tabs
	chrome.tabs.query({}, tabs => {	// we get all tabs from the window			TODO: Apply to workspace only. Opera pls fix!
		for (let i = 0; i < tabs.length; i++) {
			const currentTab = tabs[i];
			for (let j = 0; j < tabs.length; j++) {
				let comparedTab = tabs[j];
				if (currentTab.id === comparedTab.id) break;	// there's no reason to compare to itself
				if (currentTab.url === comparedTab.url && currentTab.id != comparedTab.id) chrome.tabs.remove(comparedTab.id);
			}
		}
	});
}

const closeSearches = () => {
	chrome.tabs.query({url: pattern}, tabs => tabs.forEach(tab => chrome.tabs.remove(tab.id)));
}

const killTabs = () => {
    closeDupes();
    closeSearches();
}

// Adding the contextual menus
chrome.contextMenus.create({
	title: 'Close duplicates and searches',
	contexts: ['all'],
	onclick: killTabs
});

chrome.contextMenus.create({
	title: 'Close searches',
	contexts: ['all'],
	onclick: closeSearches
});

chrome.contextMenus.create({
	title: 'Close duplicates',
	contexts: ['all'],
	onclick: closeDupes
});

