const { path } = require('@vuepress/utils')
const java = require('../java')
module.exports = {
    /**
     * github pages configuration
     */
    base: '/docs/',
    /**
     * site configuration
     */
    lang: 'en-US',
    title: 'Hzml Code-Book',
    description: 'Hzml Code-Book',
    /**
     * theme configuration
     */
    themeConfig: {
        searchPlaceholder: 'Search...',
        lastUpdated: '最后一次更新于',
        logo: 'logo.webp',
        searchMaxSuggestions: 10,
        /**
         * navbar configuration
         */
        nav: [
            {
                text: 'GoLang相关',
                items: [
                    {
                        text: 'GoLang基础',
                        link: '/golang/basic/'
                    }
                ]

            },
            {
                text: 'Java相关',
                items: [
                    {
                        text: 'Java基础',
                        link: '/java/basic/'
                    },
                    {
                        text: 'JVM',
                        link: '/java/jvm/'
                    },
                    {
                        text: 'Spring相关',
                        link: '/java/spring/'
                    }
                ]
            },
            {
                text: 'JavaScript相关',
                items: [
                    {
                        text: 'es6',
                        link: '/js/es6/'
                    },
                    {
                        text: 'typescript',
                        link: '/js/typescript/'
                    },
                ]
            },
            {
                text: '前端开发',
                items: [
                    {
                        text: '前端基础',
                        link: '/frontend/basic/'
                    },
                    {
                        text: 'Vue',
                        link: '/frontend/vue/'
                    },
                    {
                        text: 'React',
                        link: '/frontend/react/'
                    }
                ]

            },
            {
                text: 'Docker',
                link: '/docker/'
            },
            {
                text: 'Linux',
                link: '/linux/'
            },
            {
                text: 'Blockchain',
                link: '/blockchain/'
            },
            {
                text: '密码学',
                link: '/cryptograph/'
            },
            {
                text: 'CS',
                items: [
                    {
                        text: '计算机组成原理',
                        link: '/cs/computer-architecture/',
                    },
                    {
                        text: '操作系统',
                        link: '/cs/operating-system/',
                    },
                    {
                        text: '计算机网络',
                        link: '/cs/computer-network/'
                    },
                    {
                        text: '算法',
                        link: ''
                    }
                ]
            },
            {
                text: '关于',
                link: '/about/'
            },
            {
                text: 'Github',
                link: 'https://github.com/shengzhou1216/docs'
            },
        ],
        sidebar: {
            '/java/basic/': [
                {
                    title: 'Java基础',
                    children: [
                        '2.data-type-and-operators',
                        '3.programing-control-statement',
                        '4.classes-objects-methods',
                        '5.more-datatype-operators',
                    ]
                }
            ],
            '/java/spring/': [
                {
                    title: 'Spring',
                    children: [
                        // 'variable'
                    ]
                }
            ]
        },
    },
    /**
     * plugin configuration
     */
    plugins: [
    ],
    /**
    * markdown configuration
    */
    markdown: {
        extendMarkdown: md => {
            md.use(require("markdown-it-disable-url-encode"));
        }
    },
    /**
     * theme configuration
     */
    extraWatchFiles: ["**/*.md", "**/*.vue"],
}