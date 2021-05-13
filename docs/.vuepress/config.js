module.exports = {
  "title": "程序猿时光",
  "description": "记录，编码，仅此而已",
  "dest": "dist",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  "themeConfig": {
    //  "keyPage": {
    //   "keys": ['1024'],
    //   "color": '#42b983', // 登录页动画球的颜色
    //   "lineColor": '#42b983' // 登录页动画线的颜色
    // },
    "nav": [
      {
        "text": "首页",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "万物互联",
        "icon": "one-wulianwang",
        "items": [
          { "text": "ThingsBoard", "link": "/views/iot/tb/", "icon": "one-iot" }
        ]
      },
      {
        "text": "研发平台",
        "icon": 'one-platform',
        "items": [
          { "text": "产品", "link": "/views/platform/pm/", "icon": "one-pm" },
          { "text": "研发", "link": "/views/platform/R&D/", "icon": "one-jiagou" },
          { "text": "开发", "link": "/views/platform/dev/", "icon": "one-dev" },
          { "text": "测试", "link": "/views/platform/test/", "icon": "one-test" },
          { "text": "运维", "link": "/views/platform/ops/", "icon": "one-ops" }
        ]
      },
      {
        "text": "时间轴",
        "link": "/timeline/",
        "icon": "reco-date"
      },
      {
        "text": "联系我",
        "icon": "reco-message",
        "items": [
          {
            "text": "GitHub",
            "link": "https://github.com/junwangit",
            "icon": "reco-github"
          }
        ]
      }
    ],
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "分类"
      },
      // "tag": {
      //   "location": 3,
      //   "text": "标签"
      // }
    },
    "friendLink": [
      {
        "title": "程序猿时光",
        "desc": "记录，编码，仅此而已",
        "email": "junwangzhu@gmail.com",
        "link": "https://junwangit.com"
      }
    ],
    "vssueConfig": {
      "platform": "github",
      "owner": 'junwangit',
      "repo": 'pages',
      "clientId": 'Iv1.c97a6ad47d35c8e3',
      "clientSecret": '1bf9ce5b52cd158e3d6b62ff163826e8b53939cb'
    },
    "logo": "/logo.png",
    "search": true,
    "searchMaxSuggestions": 10,
    "sidebar": "auto",
    "lastUpdated": "Last Updated",
    "author": "hanfeng",
    "authorAvatar": "/avatar.jpg",
    "record": "闽ICP备19005406号-1",
    "recordLink": 'https://beian.miit.gov.cn/',
    "startYear": "2020"
  },
  "markdown": {
    "lineNumbers": true
  },
  "plugins": [
	[
	  "@vuepress/google-analytics",
	  {
	    "ga": "UA-26539957-4" // UA-00000000-0
	  }
	],
	["@vuepress-reco/vuepress-plugin-rss",
        {
          "site_url": "https://junwangit.com", // required
          "copyright": "junwangit 2020", // optional
          // filter some post
          //"filter": (frontmatter) => { return true },
          // How much articles
          //"count": 10
        }
    ],
    [
      "sitemap",
      { 
       	"hostname": "https://junwangit.com"
      }
    ]
  ]
}