import { log } from '$shared/services/log';

import ItemImageGenerator from '../ItemImageGenerator';

const wrapper = ({
    isLarge = false,
    contents = '',
    styles = '',
}: {
    isLarge?: boolean;
    contents?: string;
    styles?: string;
}) => `<?xml version="1.0" encoding="utf-8"?>
<svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="${isLarge ? '0 0 510.24 595.28' : '0 0 368.5 368.5'}"
    xml:space="preserve"
    fill="none"
>
<style type="text/css">
${styles}
</style>
${contents}
</svg>
`;

const generateItem = (name: string): string => {
    const itemImageGenerator = new ItemImageGenerator(name);

    try {
        return wrapper({
            isLarge: itemImageGenerator.isLargeItem(),
            contents: itemImageGenerator.getContents(),
            styles: itemImageGenerator.getStyles(),
        });
    } catch (e) {
        log('[ERROR][ITEM_IMAGE_GENERATION]', e);

        return wrapper({});
    }
};

export default generateItem;
