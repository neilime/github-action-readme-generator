import { getCurrentVersionString } from '../helpers.js';
import LogTask from '../logtask/index.js';
import { wrapDescription } from '../prettier.js';
export default async function updateUsage(sectionToken, inputs) {
    const log = new LogTask(sectionToken);
    log.start();
    const actionName = `${inputs.owner}/${inputs.repo}`;
    log.info(`Action name: ${actionName}`);
    const versionString = getCurrentVersionString(inputs);
    log.info(`Version string: ${versionString}`);
    const actionReference = `${actionName}@${versionString}`;
    const indent = '    # ';
    // Build the new README
    const content = [];
    // Build the new usage section
    content.push('```yaml', `- uses: ${actionReference}`, '  with:');
    const inp = inputs.action.inputs;
    let firstInput = true;
    const descriptionPromises = {};
    if (inp) {
        for (const key of Object.keys(inp)) {
            const input = inp[key];
            if (input !== undefined) {
                descriptionPromises[key] = wrapDescription(`Description: ${input.description}`, [], indent);
            }
        }
        const descriptions = {};
        const kvArray = await Promise.all(Object.keys(descriptionPromises).map(async (key) => {
            return { key, value: await descriptionPromises[key] };
        }));
        for (const e of kvArray) {
            descriptions[e.key] = e.value;
            log.debug(`${e.key}: ${descriptions[e.key].join('\n')}`);
        }
        for (const key of Object.keys(inp)) {
            const input = inp[key];
            if (input !== undefined) {
                // Line break between inputs
                if (!firstInput) {
                    content.push('');
                }
                // Constrain the width of the description, and append it
                content.push(...descriptions[key]);
                if (input.default !== undefined) {
                    // Append blank line if description had paragraphs
                    // if (input.description?.trimEnd().match(/\n *\r?\n/)) {
                    //   content.push('    #');
                    // }
                    // Default
                    content.push(`${indent}Default: ${input.default}`);
                }
                // Input name
                content.push(`    ${key}: ''`);
                firstInput = false;
            }
        }
    }
    content.push('```\n');
    inputs.readmeEditor.updateSection(sectionToken, content);
    log.success();
    const ret = {};
    ret[sectionToken] = content.join('\n');
    return ret;
}
//# sourceMappingURL=update-usage.js.map