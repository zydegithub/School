// 菜单 顶栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  { path: '/navigation', title: '校园导航', icon: 'paper-plane' },
  { path: '/3dshool', title: '室内展示', icon: 'sign-in' },
  {
    title: '奇妙校园',
    icon: 'university',
    children: [
      { path: '/demo/page1', title: '淘金手', icon: 'dollar' },
      { path: '/demo/page2', title: '点亮IDEA', icon: 'lightbulb-o' },
      { path: '/demo/page3', title: '兴趣部落', icon: 'cubes' }
    ]
  }
]
