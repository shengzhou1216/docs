const { path } = require('@vuepress/utils')

module.exports = {
    /**
     * github pages configuration
     */
    base: '/site/',
    /**
     * site configuration
     */
    lang: 'en-US',
    title: 'Hzml Code-Book',
    description: '',

    /**
     * theme configuration
     */
    themeConfig: {
        logo: 'https://vuejs.org/images/logo.png',
        /**
         * navbar configuration
         */
        navbar: [
            {
                text: 'GoLang相关',
                children: [
                    {
                        text: 'GoLang基础',
                        link: '/golang/basic'
                    }
                ]

            },
            {
                text: 'Java相关',
                children: [
                    {
                        text: 'Java基础',
                        link: '/java/basic'
                    },
                    {
                        text: 'Spring',
                        link: '/java/spring'
                    }
                ]

            },
            {
                text: '前端开发',
                children: [
                    {
                        text: '前端基础',
                        link: '/frontend/basic'
                    },
                    {
                        text: 'Vue',
                        link: '/frontend/vue'
                    },
                    {
                        text: 'React',
                        link: '/frontend/react'
                    }
                ]

            },
            {
                text: '后端开发',
                children: [
                    {
                        text: 'Java基础',
                        link: '/java/basic'
                    },
                    {
                        text: 'Spring',
                        link: '/java/spring'
                    }
                ]

            },
            {
                text: '关于',
                link: '/about/'
            },
        ],
    },
    /**
     * plugin configuration
     */
    plugins: [
        [
            '@vuepress/plugin-search',
            // {
            //     locales: {
            //         '/': {
            //             placeholder: 'Search',
            //         },
            //         '/zh/': {
            //             placeholder: '搜索',
            //         },
            //     },
            // },
        ]
    ]
    /**
     * theme configuration
     */
}