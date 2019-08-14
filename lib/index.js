/**
 * @fileoverview Ignore ERB
 * @author       Ryan Recht, Motohiro Yafune
 * @copyright    2016 Ryan Recht.
 *               2019 Motohiro Yafune.
 * All rights reserved.
 * See LICENSE file in root directory for full license.
 */

'use strict'

const preprocess = function (text, filename) {
  text = text.replace(/(['"]?)([ ]*)<%(=?)([\s\S]*?)%>([ ]*)(['"]?)/g, (
    _match, q1, s1, eq, content, s2, q2
  ) => {
    let lines = content.split('\n')

    if (lines.length == 1) {
      content = 'Ignored ERB'
    } else {
      lines = lines.map((line, i) => {
        return line.replace(
          /^.*?(\\?)\s*$/,
          (_m, p1) => {
            return p1 ? '-- \\' : '--'
          }
        )
      })

      lines[0] = 'Ignored ERB ' + lines[0]
      content = lines.join('\n')
    }

    if (!q1 || !q2 || q1 !== q2 || eq !== '=') {
      content = '/* ' + content + ' */'
    }

    return q1 + s1 + content + s2 + q2
  })

  return [text]
}

const postprocess = function (messages, filename) {
  return messages[0]
}

module.exports.processors = {
  '.erb': { preprocess, postprocess }
}
