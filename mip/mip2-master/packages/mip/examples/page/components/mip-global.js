/**
 * @file mip-global
 * @author sfe
 */

/* global MIP */

MIP.registerVueCustomElement('mip-global', {
  template: `
    <span>mip-global</span>
  `,
  firstInviewCallback () {
    console.log(window.MIP.MIP_ROOT_PAGE)
    if (!window.MIP.MIP_ROOT_PAGE) {
      window.MIP.viewer.page.notifyRootPage({
        type: 'register-global-component',
        data: {
          name: 'mip-global',
          html: '<mip-global><mip-global>',
          src: 'http://localhost:8080/examples/page/components/mip-global.js'
        }
      })
    }
  }
})
