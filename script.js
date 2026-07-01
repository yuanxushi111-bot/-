gsap.registerPlugin(ScrollTrigger)

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

const loader = document.querySelector('#loader')
const loaderBar = document.querySelector('#loaderBar')
const loaderPercent = document.querySelector('#loaderPercent')
const loaderStatus = document.querySelector('#loaderStatus')
const characterCard = document.querySelector('#characterCard')
const heroTitle = document.querySelector('#heroTitle')
const heroCopy = document.querySelector('#heroCopy')
const techBg = document.querySelector('#techBg')
const scrollBar = document.querySelector('#scrollBar')
const scrollPercent = document.querySelector('#scrollPercent')
const gears = gsap.utils.toArray('.gear')
const moduleCards = document.querySelectorAll('.module-card')
const detailTitle = document.querySelector('#detailTitle')
const detailText = document.querySelector('#detailText')
const detailClose = document.querySelector('#detailClose')
const aiIntroCopy = document.querySelector('#aiIntroCopy')

const loaderSteps = [
  'Initializing modules...',
  'Loading profile data...',
  'Preparing interface...',
  'Resolving identity carrier...',
  'System ready...',
]

const moduleDetails = {
  'AI篇': '这里会扩展 AI 工具链、智能体实践、模型应用案例和自动化工作流。',
  技术文档: '这里会扩展技术文档、项目复盘、开发拆解和工程化记录。',
  生活篇: '这里会扩展生活观察、审美积累、摄影记录和个人成长笔记。',
  职场篇: '这里会扩展职业经历、协作案例、简历信息和作品展示。',
}

function resetScrollPosition() {
  const originalScrollBehavior = document.documentElement.style.scrollBehavior

  document.documentElement.style.scrollBehavior = 'auto'
  window.scrollTo(0, 0)
  document.documentElement.style.scrollBehavior = originalScrollBehavior
  scrollBar.style.width = '0%'
  scrollPercent.textContent = '0%'
}

function runLoader() {
  const duration = 3200
  const start = performance.now()

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1)
    const percent = Math.round(progress * 100)
    const step = Math.min(Math.floor(progress * loaderSteps.length), loaderSteps.length - 1)

    loaderBar.style.width = `${percent}%`
    loaderPercent.textContent = `${percent}%`
    loaderStatus.textContent = loaderSteps[step]

    if (progress < 1) {
      requestAnimationFrame(frame)
      return
    }

    setTimeout(() => {
      resetScrollPosition()
      loader.classList.add('is-hidden')
      document.body.style.overflow = 'auto'
      ScrollTrigger.refresh(true)
    }, 450)
  }

  requestAnimationFrame(frame)
}

function initHeroAnimation() {
  gsap.set(characterCard, {
    rotationY: 180,
    scale: 0.9,
    opacity: 1,
    transformPerspective: 1300,
    transformStyle: 'preserve-3d',
    filter: 'brightness(0.72) blur(4px)',
  })

  gsap.set(heroTitle, { opacity: 0, x: -42 })
  gsap.set(heroCopy, { opacity: 0, y: 24 })

  gears.forEach((gear, index) => {
    gsap.to(gear, {
      rotation: index % 2 === 0 ? 360 : -360,
      duration: 18 + index * 5,
      ease: 'none',
      repeat: -1,
      transformOrigin: '50% 50%',
    })
  })

  gsap.timeline({
    scrollTrigger: {
      trigger: '#heroScroll',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const percent = Math.round(self.progress * 100)
        scrollBar.style.width = `${percent}%`
        scrollPercent.textContent = `${percent}%`

        const gearSpeed = 1 - self.progress
        gears.forEach((gear, index) => {
          gsap.set(gear, {
            y: (index - 1.5) * 16 * gearSpeed,
            opacity: 0.55 + self.progress * 0.35,
          })
        })
      },
    },
  })
    .to(characterCard, { rotationY: 0, opacity: 1, scale: 1, filter: 'brightness(1.08) blur(0px)', ease: 'none' }, 0)
    .to(techBg, { filter: 'brightness(1.08) saturate(1.18)', ease: 'none' }, 0)
    .to(heroTitle, { opacity: 1, x: 0, ease: 'none' }, 0.08)
    .to(heroCopy, { opacity: 1, y: 0, ease: 'none' }, 0.7)
}

function initAiIntroAnimation() {
  gsap.set(aiIntroCopy, { opacity: 0, y: 36 })

  gsap.timeline({
    scrollTrigger: {
      trigger: '#aiIntro',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
    },
  })
    .to(aiIntroCopy, { opacity: 1, y: 0, ease: 'none' }, 0.28)
}

function bindModules() {
  moduleCards.forEach((card) => {
    card.addEventListener('click', () => {
      const moduleName = card.dataset.module

      if (moduleName === 'AI篇') {
        document.querySelector('#aiIntro').scrollIntoView({ behavior: 'smooth' })
        return
      }

      detailTitle.textContent = moduleName
      detailText.textContent = moduleDetails[moduleName]
      document.querySelector('#detail').scrollIntoView({ behavior: 'smooth' })
    })
  })

  detailClose.addEventListener('click', () => {
    document.querySelector('#modules').scrollIntoView({ behavior: 'smooth' })
  })
}

document.body.style.overflow = 'hidden'
resetScrollPosition()
runLoader()
initHeroAnimation()
initAiIntroAnimation()
bindModules()


