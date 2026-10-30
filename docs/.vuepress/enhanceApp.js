// VuePress 1.x enhanceApp — Mermaid 图表渲染 + 大纲锚点精确定位（仅浏览器端）
// Mermaid 走 CDN：webpack 4 无法打包 ESM-only 的 mermaid 包
export default ({ Vue, router }) => {
  // SSR 阶段（生成静态 HTML）跳过
  if (typeof window === 'undefined') return

  /* ---------------------------------------------------------------
   * 锚点滚动定位
   *
   * vuepress-plugin-smooth-scroll 的默认实现：点击瞬间算出标题的文档坐标，
   * 交给浏览器做平滑动画，动画期间不再重算。正文图片没有宽高、加载后才占位，
   * 于是滚动结束时标题已被推走；固定导航栏的高度也从未从目标位置里扣除。
   * 这里改为逐帧插值，每帧重新读取标题当前位置，并扣除导航栏高度。
   * ------------------------------------------------------------- */
  const NAV_GAP = 12 // 标题与导航栏之间保留的呼吸距离
  let currentTarget = null // 当前锚点目标，供图片/Mermaid 渲染后校正
  let animating = false

  // vuepress-plugin-smooth-scroll 给 html 加了 scroll-behavior:smooth。
  // 逐帧插值期间必须临时关掉，否则每次 scrollTo 都会被浏览器再平滑一次，
  // 动画被无限拉长。瞬时对齐（realign）同理。
  function jumpTo (y) {
    const html = document.documentElement
    const prev = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    window.scrollTo(0, y)
    html.style.scrollBehavior = prev
  }

  function navHeight () {
    const el = document.querySelector('.navbar')
    return el ? el.getBoundingClientRect().height : 0
  }

  function goalFor (el) {
    const top = el.getBoundingClientRect().top + window.pageYOffset
    return Math.max(0, top - navHeight() - NAV_GAP)
  }

  function releaseTarget () {
    currentTarget = null
  }

  // 图片、Mermaid 异步渲染完成后若位置已变，静默对齐（不重播动画）
  function realign () {
    if (animating) return // 动画进行中由逐帧插值负责
    if (!currentTarget || !document.contains(currentTarget)) return
    const goal = goalFor(currentTarget)
    if (Math.abs(window.pageYOffset - goal) > 2) jumpTo(goal)
  }
  window.__recoAnchorRealign = realign
  // 图片 load 不冒泡到 window，用捕获阶段统一兜住
  window.addEventListener('load', realign, true)

  function smoothScrollTo (el) {
    currentTarget = el
    animating = true
    const startY = window.pageYOffset
    const startTime = performance.now()
    const duration = 420
    let aborted = false

    function cleanup () {
      animating = false
      window.removeEventListener('wheel', abort)
      window.removeEventListener('touchstart', abort)
    }
    function abort () {
      aborted = true
      cleanup()
      releaseTarget()
    }
    window.addEventListener('wheel', abort, { passive: true })
    window.addEventListener('touchstart', abort, { passive: true })

    function frame (now) {
      if (aborted) return
      const p = Math.min((now - startTime) / duration, 1)
      // easeInOutQuad
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
      const goal = goalFor(el) // 每帧重算，吸收滚动期间的版面变化
      jumpTo(Math.max(0, startY + (goal - startY) * ease))
      if (p < 1) {
        requestAnimationFrame(frame)
      } else {
        cleanup()
        realign()
      }
    }
    requestAnimationFrame(frame)
  }

  function resolveTarget (hash) {
    let id = hash
    try {
      id = decodeURIComponent(hash)
    } catch (e) {
      // 非法编码，按原样处理
    }
    if (id.charAt(0) === '#') id = id.slice(1)
    const byId = document.getElementById(id)
    if (byId) return byId
    try {
      return document.querySelector(hash)
    } catch (e) {
      return null
    }
  }

  // 跨页跳转时目标元素可能尚未挂载，逐帧重试
  function scrollWhenReady (hash, tries) {
    const el = resolveTarget(hash)
    if (el) {
      smoothScrollTo(el)
      return
    }
    if (tries < 40) requestAnimationFrame(() => scrollWhenReady(hash, tries + 1))
  }

  function scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      window.scrollTo({ top: savedPosition.y || 0, behavior: 'smooth' })
      return false
    }
    if (to.hash) {
      if (Vue.$vuepress && Vue.$vuepress.$get('disableScrollBehavior')) return false
      // 等 DOM 更新后再定位
      requestAnimationFrame(() => scrollWhenReady(to.hash, 0))
      return false
    }
    releaseTarget()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return false
  }

  // 覆盖顺序不受控：vuepress-plugin-smooth-scroll 的 enhanceApp 可能晚于本文件执行，
  // 把这里的实现顶掉。所以先赋一次，再在路由就绪（所有 enhanceApp 均已跑完）后复核归属。
  router.options.scrollBehavior = scrollBehavior
  router.onReady(() => {
    if (router.options.scrollBehavior !== scrollBehavior) {
      router.options.scrollBehavior = scrollBehavior
    }
    // 直接带 hash 打开页面时，浏览器原生跳转不会扣掉导航栏高度，这里补一次精确对齐
    if (window.location.hash) {
      requestAnimationFrame(() => scrollWhenReady(window.location.hash, 0))
    }
  })

  /* ---------------------------------------------------------------
   * Mermaid（行为与改动前一致，仅在渲染完成后补一次位置校正）
   * ------------------------------------------------------------- */
  function loadMermaid () {
    if (window.mermaid) return Promise.resolve(window.mermaid)
    return new Promise((resolve) => {
      const s = document.createElement('script')
      s.src = 'https://cdn.jsdelivr.net/npm/mermaid@8/dist/mermaid.min.js'
      s.onload = () => {
        window.mermaid.initialize({ startOnLoad: false, theme: 'default' })
        resolve(window.mermaid)
      }
      document.head.appendChild(s)
    })
  }

  const ready = loadMermaid()

  router.afterEach(() => {
    setTimeout(() => {
      const els = document.querySelectorAll('.mermaid:not(.rendered)')
      if (!els.length) return
      ready.then(mermaid => {
        els.forEach((el, i) => {
          mermaid.render('m_' + i, el.textContent, (svg) => {
            el.innerHTML = svg
            el.classList.add('rendered')
            // 图表从纯文本变成数百 px 的 SVG，会撑高正文
            realign()
          })
        })
      })
    }, 200)
  })
}
