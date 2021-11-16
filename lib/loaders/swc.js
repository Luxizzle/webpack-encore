/*
 * This file is part of the Symfony Webpack Encore package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const WebpackConfig = require('../WebpackConfig'); //eslint-disable-line no-unused-vars
const loaderFeatures = require('../features');
const applyOptionsCallback = require('../utils/apply-options-callback');

module.exports = {
    /**
     * @param {WebpackConfig} webpackConfig
     * @return {Array} of loaders to use for Babel
     */
    getLoaders(webpackConfig) {
        let swcConfig = {
            jsc: {
                parser: {
                    syntax: "ecmascript",
                    jsx: true,
                }
            }
        };

        if (webpackConfig.useBabelTypeScriptPreset) {
            swcConfig.jsc.parser.syntax = 'typescript'
            delete swcConfig.jsc.parser.jsx;
            swcConfig.jsc.parser.tsx = true
        }

        // TODO: configure swc based on .swcrc

        // // configure babel (unless the user is specifying .babelrc)
        // // todo - add a sanity check for their babelrc contents
        // if (!webpackConfig.doesBabelRcFileExist()) {
        //     let presetEnvOptions = {
        //         // modules don't need to be transformed - webpack will parse
        //         // the modules for us. This is a performance improvement
        //         // https://babeljs.io/docs/en/babel-preset-env#modules
        //         modules: false,
        //         targets: {},
        //         useBuiltIns: webpackConfig.babelOptions.useBuiltIns,
        //         corejs: webpackConfig.babelOptions.corejs,
        //     };

        //     presetEnvOptions = applyOptionsCallback(
        //         webpackConfig.babelPresetEnvOptionsCallback,
        //         presetEnvOptions
        //     );

        //     Object.assign(swcConfig, {
        //         presets: [
        //             ['@babel/preset-env', presetEnvOptions]
        //         ],
        //         plugins: ['@babel/plugin-syntax-dynamic-import']
        //     });

        //     if (webpackConfig.useBabelTypeScriptPreset) {
        //         loaderFeatures.ensurePackagesExistAndAreCorrectVersion('typescript-babel');

        //         swcConfig.presets.push(['@babel/preset-typescript', webpackConfig.babelTypeScriptPresetOptions]);
        //         swcConfig.plugins.push('@babel/plugin-proposal-class-properties');
        //     }

        //     if (webpackConfig.useReact) {
        //         loaderFeatures.ensurePackagesExistAndAreCorrectVersion('react');

        //         swcConfig.presets.push('@babel/react');
        //     }

        //     if (webpackConfig.usePreact) {
        //         loaderFeatures.ensurePackagesExistAndAreCorrectVersion('preact');

        //         if (webpackConfig.preactOptions.preactCompat) {
        //             // If preact-compat is enabled tell babel to
        //             // transform JSX into React.createElement calls.
        //             swcConfig.plugins.push(['@babel/plugin-transform-react-jsx']);
        //         } else {
        //             // If preact-compat is disabled tell babel to
        //             // transform JSX into Preact h() calls.
        //             swcConfig.plugins.push([
        //                 '@babel/plugin-transform-react-jsx',
        //                 { 'pragma': 'h' }
        //             ]);
        //         }
        //     }

        //     if (webpackConfig.useVueLoader && webpackConfig.vueOptions.useJsx) {
        //         loaderFeatures.ensurePackagesExistAndAreCorrectVersion('vue-jsx');
        //         swcConfig.presets.push('@vue/babel-preset-jsx');
        //     }

        //     swcConfig = applyOptionsCallback(webpackConfig.babelConfigurationCallback, swcConfig);
        // }

        return [
            {
                loader: require.resolve('swc-loader'),
                options: swcConfig
            }
        ];
    },

    /**
     * @param {WebpackConfig} webpackConfig
     * @return {RegExp} to use for eslint-loader `test` rule
     */
    getTest(webpackConfig) {
        const extensions = [
            'jsx?', // match .js and .jsx
        ];

        if (webpackConfig.useBabelTypeScriptPreset) {
            extensions.push('tsx?'); // match .ts and .tsx
        }

        return new RegExp(`\\.(${extensions.join('|')})$`);
    }
};
