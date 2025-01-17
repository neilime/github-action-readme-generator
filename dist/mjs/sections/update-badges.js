/**
 * This TypeScript code imports necessary modules and defines a function named 'updateBadges' which takes a sectionToken (ReadmeSection) and an instance of the 'Inputs' class as its parameters.
 * The function is responsible for updating the badges section in the README.md file based on the provided inputs.
 * It utilizes the 'LogTask' class for logging purposes.
 */
import LogTask from '../logtask/index.js';
/**
 * Generate GitHub badges.
 * @returns {IBadge[]} - The array of GitHub badges.
 */
function githubBadges(owner, repo) {
    const repoUrl = `https://github.com/${owner}/${repo}`;
    return [
        {
            img: `https://img.shields.io/github/v/release/${owner}/${repo}?display_name=tag&sort=semver&logo=github&style=flat-square`,
            alt: 'Release by tag',
            url: `${repoUrl}/releases/latest`,
        },
        {
            img: `https://img.shields.io/github/release-date/${owner}/${repo}?display_name=tag&sort=semver&logo=github&style=flat-square`,
            alt: 'Release by date',
            url: `${repoUrl}/releases/latest`,
        },
        {
            img: `https://img.shields.io/github/last-commit/${owner}/${repo}?logo=github&style=flat-square`,
            alt: 'Commit',
        },
        {
            img: `https://img.shields.io/github/issues/${owner}/${repo}?logo=github&style=flat-square`,
            alt: 'Open Issues',
            url: `${repoUrl}/issues`,
        },
        {
            img: `https://img.shields.io/github/downloads/${owner}/${repo}/total?logo=github&style=flat-square`,
            alt: 'Downloads',
        },
    ];
}
/**
 * Generates a badge HTML markup.
 * @param {IBadge} item - The badge object.
 * @returns {string} - The HTML markup for the badge.
 */
function generateBadge(item, log) {
    const badgeTemplate = `<img src="${item.img}" alt="${encodeURIComponent(item.alt) || ''}" />`;
    log.info(`Generating badge ${item.alt}`);
    if (item.url) {
        return `<a href="${encodeURIComponent(item.url)}">${badgeTemplate}</a>`;
    }
    return badgeTemplate;
}
/**
 * Generates all badges HTML markup.
 * @param {IBadge} badges - The array of badge objects
 * @param log - A LogTask instance
 * @returns {string[]} - The array of HTML markup for all badges.
 */
function generateBadges(badges, log) {
    const badgeArray = [];
    for (const b of badges) {
        badgeArray.push(generateBadge(b, log));
    }
    log.debug(`Total badges: ${badgeArray.length}`);
    return badgeArray;
}
export default function updateBadges(sectionToken, inputs) {
    const log = new LogTask(sectionToken);
    const config = inputs.config.get();
    const enableVersioning = config ? config.versioning?.badge : false;
    log.info(`Versioning badge: ${enableVersioning}`);
    log.start();
    let content = '';
    // Add GitHub badges
    if (enableVersioning) {
        const badges = githubBadges(inputs.owner, inputs.repo);
        content = generateBadges(badges, log).join('');
        inputs.readmeEditor.updateSection(sectionToken, content);
    }
    log.success();
    const ret = {};
    ret[sectionToken] = content;
    return ret;
}
//# sourceMappingURL=update-badges.js.map