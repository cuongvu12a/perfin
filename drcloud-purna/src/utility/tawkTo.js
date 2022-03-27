export const tawkTo = () => {
  const env = process.env.REACT_APP_ENV

  if (!window) {
    throw new Error('DOM is unavailable')
  }

  window.Tawk_API = window.Tawk_API || {}
  window.Tawk_LoadStart = new Date()

  window.Tawk_API.onLoad = () => {
    window.Tawk_API.setAttributes({
      enviroment: env
    })
  }

  const tawk = document.getElementById('tawkId')
  if (tawk) {
    // Prevent TawkTo to create root script if it already exists
    return window.Tawk_API
  }

  const script = document.createElement('script')
  script.id = 'tawkId'
  script.async = true
  script.src = `https://embed.tawk.to/61cad61280b2296cfdd40ef1/1ftfaskr6`
  script.charset = 'UTF-8'
  script.setAttribute('crossorigin', '*')

  const first_script_tag = document.getElementsByTagName('script')[0]
  if (!first_script_tag || !first_script_tag.parentNode) {
    throw new Error('DOM is unavailable')
  }

  first_script_tag.parentNode.insertBefore(script, first_script_tag)
}
