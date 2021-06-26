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
    head: [
        ['link', { rel: 'icon', href: '/logo.png' }]
    ],
    /**
     * theme configuration
     */
    themeConfig: {
        searchPlaceholder: 'Search...',
        lastUpdated: '最后一次更新于',
        logo: 'https://vuejs.org/images/logo.png',
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
                text: '后端开发',
                items: [
                    {
                        text: 'Java基础',
                        link: '/java/basic/'
                    },
                    {
                        text: 'Spring',
                        link: '/java/spring/'
                    }
                ]

            },
            {
                text: '关于',
                link: '/about/'
            },
        ],
        sidebar: {
            '/java/basic/': [
                {
                    title: 'Java基础',
                    children: [
                        'variable'
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
    ]
    /**
     * theme configuration
     */
}