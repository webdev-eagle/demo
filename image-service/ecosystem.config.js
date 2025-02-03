module.exports = [
    {
        name: 'IMAGE_SERVICE',
        script: './bundle.js',
        instances: +process.env.INSTANCES || 2,
        autorestart: true,
        exec_mode: 'cluster',
        watch: false,
        env: {
            NODE_ENV: process.env.NODE_ENV || 'production',
        },
    },
];
