/* eslint-disable no-restricted-globals */

globalThis.onmessage = function (e) {
  const { code, tests } = e.data
  const testResults = []
  const logs = []

  const mockConsole = {
    log: (...args) => logs.push(args.map(String).join(' ')),
  }

  const it = (name, fn) => {
    try {
      fn()
      testResults.push(`✅ PASSED: ${name}`)
    } catch (err) {
      testResults.push(`❌ FAILED: ${name}\n   Reason: ${err.message}`)
      throw err
    }
  }

  const expect = (actual) => ({
    toBe: (expected) => {
      if (actual !== expected) throw new Error(`Expected [${expected}] but got [${actual}]`)
    },
    toEqual: (expected) => {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`)
      }
    },
  })

  const describe = (name, fn) => {
    testResults.push(`\n📂 SUITE: ${name.toUpperCase()}`)
    fn()
  }

  try {
    const cleanCode = code
      .replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '')
      .replace(/export\s+function/g, 'function') 
      .replace(/export\s+const/g, 'const') 
      .replace(/export\s+default\s+/g, '')

    const runner = new Function(
      'console',
      'describe',
      'it',
      'test',
      'expect',
      `
      ${cleanCode}
      try {
        ${tests.replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '')} 
      } catch (e) {
        // Silently catch to prevent worker crash
      }
    `,
    )

    runner(mockConsole, describe, it, it, expect)

    const finalOutput = [
      ...testResults,
      logs.length > 0 ? `\n--- Console Logs ---\n${logs.join('\n')}` : '',
    ].join('\n')

    globalThis.postMessage({
      success: !testResults.some((r) => r.includes('❌')),
      output: finalOutput,
    })
  } catch (err) {
    globalThis.postMessage({
      success: false,
      error: `Syntax Error: ${err.message}`,
      output: testResults.join('\n'),
    })
  }
}
