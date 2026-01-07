/**
 * path - Module that exports some utility functions to work with paths.
 */


export function parent_folder(file: string) {
    /**
     * Returns the parent folder of a file, or path itself if it is a folder.
     */
    const parts = file.split('/');
    if (parts[parts.length-1].includes('.'))
        return ''.concat(...parts.slice(0, parts.length-1).map(p => `${p}/`));
    else
        return file;
}

export function relative_path(folder: string, main: string) {
    /**
     * Returns the path of "folder" relative to "main".
     * If "main" is a file, the parent folder is taken.
     */
    const f_parts = folder.replace(/\/+$/, '').split('/');
    const m_parts = parent_folder(main).replace(/\/+$/, '').split('/');
    let index = 0;
    while (f_parts[index] !== undefined && f_parts[index] == m_parts[index])
        index++;
    const up = '../'.repeat(m_parts.length-index);
    let result = up.concat(...f_parts.slice(index).map(p => `${p}/`));
    if (f_parts[f_parts.length-1].includes('.')) 
        result = result.slice(0, result.length-1);
    return result.startsWith('.') ? result : `./${result}`;
}
