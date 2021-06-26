const { title } = require("../.vuepress/config");

module.exports = [
    {
        title: 'Java基础',
        collapsed: true,
        children: [
            '',
            'basic/',
        ]
    },
    {
        title: 'JVM',
        children: [
        ]
    },
    {
        title: 'Spring相关',
        children: [
            'spring'
        ]
    }
]