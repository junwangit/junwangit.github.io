module.exports = {
  "title": "程序猿时光",
  "description": "企业级研发平台最佳实践",
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
    "nav": [
      {
        "text": "首页",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "研发平台",
        "icon": 'one-platform',
        "items": [
          { "text": "产品", "link": "/platform/pm/", "icon": "one-pm" },
          { "text": "研发", "link": "/platform/R&D/", "icon": "one-jiagou" },
          { "text": "开发", "link": "/platform/dev/", "icon": "one-dev" },
          { "text": "测试", "link": "/platform/test/", "icon": "one-test" },
          { "text": "运维", "link": "/platform/ops/", "icon": "one-ops" }
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
    // "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "分类"
      },
      "tag": {
        "location": 3,
        "text": "标签"
      }
    },
    "friendLink": [
      {
        "title": "程序猿时光",
        "desc": "企业级研发平台最佳实践",
        "email": "junwangzhu@gmail.com",
        "link": "https://junwangit.com"
      }
    ],
    "vssueConfig": {
      "platform": "github",
      "owner": 'junwangit',
      "repo": 'junwangit.github.io',
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
    "startYear": "2019"
  },
  "markdown": {
    "lineNumbers": true
  }
}