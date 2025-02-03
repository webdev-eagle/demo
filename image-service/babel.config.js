module.exports = (api) => {
    api.cache(true);

    return {
        plugins: ['@babel/plugin-transform-modules-commonjs'],
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: { node: true },
                },
            ],
        ],
    };
};
