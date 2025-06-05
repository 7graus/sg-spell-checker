// Import the CSS as a string
import compiledCss from './shadow.css?inline'

export const styles = `
  ${compiledCss}

  :host {
    display: block;
    width: 100%;
  }

  #app-mount {
    width: 100%;
    height: 100%;
  }

`; 