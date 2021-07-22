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
        ['script', {
            src: 'https://www.googletagmanager.com/gtag/js?id=G-175K59GC1N',
            async: true,
        }],
        ['script',{},`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', 'G-175K59GC1N');
        `]
    ],
    /**
     * theme configuration
     */
    themeConfig: {
        sidebar: 'auto',
        // sidebarDepth: 2,
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
                        text: '浏览器',
                        link: '/frontend/browser/'
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
                text: '开发工具',
                items: [
                    {
                        text: 'VSCode',
                        link: '/vscode/',
                    }
                ]  
            },
            // {
            //     text: '运维',
            // },
            {
                text: '关于',
                link: '/about/'
            },
            {
                text: 'Github',
                link: 'https://github.com/shengzhou1216/docs'
            },
        ],
        // sidebar: {
        //     '/java/basic/': [
        //         {
        //             title: 'Java基础',
        //             children: [
        //                 '2.data-type-and-operators',
        //                 '3.programing-control-statement',
        //                 '4.classes-objects-methods',
        //                 '5.more-datatype-operators',
		// 	            '6.closer-look-at-methods-and-classes',
        //                 '7.inheritance',
        //                 '8.packages-interfacec',
        //                 '9.异常处理'
        //             ]
        //         }
        //     ],
        //     '/java/spring/': [
        //         {
        //             title: 'Spring',
        //             children: [
        //                 // 'variable'
        //             ]
        //         }
        //     ]
        // },
    },
    /**
     * plugin configuration
     */
    plugins: [
        '@vuepress/back-to-top',
        ['vuepress-plugin-code-copy', true],
        [
            '@vuepress/google-analytics',
            {
                'ga': 'G-175K59GC1N'
            }
        ],
        '@vuepress/nprogress',
        '@vuepress/active-header-links',
        ['@vssue/vuepress-plugin-vssue', {
            // set `platform` rather than `api`
            platform: 'github',
            // all other options of Vssue are allowed
            owner: 'shengzhou1216',
            repo: 'docs',
            clientId: '63e9b536cb1d46e27d9e',
            clientSecret: '84de9a61b603066af0b742c7d757e47a42ec4f40',
            }
        ]
    ],
    /**
    * markdown configuration
    */
    markdown: {
        extendMarkdown: md => {
            md.use(require("markdown-it-disable-url-encode"));
        },
        anchror: {
            permalink: true, permalinkBefore: true, permalinkSymbol: '#'
        },
        toc: {
            includeLevel: [2, 3, 4, 5]
        }
    },
    /**
     * theme configuration
     */
    extraWatchFiles: ["**/*.md", "**/*.vue"],
}
