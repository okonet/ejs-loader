const requireFromString = require('require-from-string');
const ejsLoader = require('../index.js');

describe('ejsLoader', () => {
  it('returns template with applied parameters', () => {
    const template = '<div>Hello <%= world %>!</div>';
    const params = { world: 'World' };
    const compiled = requireFromString(ejsLoader(template));

    expect(compiled(params)).toBe('<div>Hello World!</div>');
  });

  describe('ejsLoader with "ESModule" feature', () => {
    const compileTemplate = (template, mockedLoaderContext = {}) => {
      const mergedMockedLoaderContext = {
        cacheable: null,
        ...mockedLoaderContext
      };
    
      return ejsLoader.call(mergedMockedLoaderContext, template);
    }
    
    const convertTemplateStringToFunction = (templateString) => {
      const removeExportDefaultString = templateString.match(/export default (.*)/s)[1];
      return new Function(`return ${removeExportDefaultString}`)();
    }
    
    it('returns template with applied parameters', () => {
      const template = '<div>Hello <%= args.world %>!</div>';
      const params = { 
        world: 'World'
      };
      const compilerOptions = {
        query: {
          variable: 'args',
          esModule: true
        }
      };
      const compiled = convertTemplateStringToFunction(compileTemplate(template, compilerOptions));
      expect(compiled(params)).toBe('<div>Hello World!</div>');
    });

    it('throws error when options variable or query variable are undefined', () => {
      const template = '<div>Hello <%= args.world %>!</div>';
      const compilerOptions = {
        query: {
          esModule: true
        }
      };
      
      expect(() => {
        compileTemplate(template, compilerOptions)
      }).toThrowError();
    });
  })
});
