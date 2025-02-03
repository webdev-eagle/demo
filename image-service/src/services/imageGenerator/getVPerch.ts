import VPerchImageGenerator from '../vPerchImageGenerator';

const getVPerch = (): string => {
    const vPerchProperties = new VPerchImageGenerator({ perchColor: 'P' });

    return `<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
\t viewBox="0 0 510.24 595.28" style="enable-background:new 0 0 510.24 595.28;" xml:space="preserve">

<style type="text/css">
${vPerchProperties.styles}
</style>

${vPerchProperties.back}
${vPerchProperties.front}
</svg>`;
};

export default getVPerch;
