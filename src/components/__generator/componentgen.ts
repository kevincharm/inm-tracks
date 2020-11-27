import * as mustache from 'mustache'
import * as fs from 'fs'
import * as path from 'path'

if (process.argv.length < 3) {
    console.error(`
        No argument provided!

        Usage:
            yarn gen:component <component name>
    `)
    process.exit(1)
}

// Extract component name from argument
const componentName = process.argv[2]

// Template substitutions
const subst = {
    componentName,
}

interface Template {
    /** Filename of input template in ./template dir */
    inFilename: string
    /** Filename of output */
    outFilename: string
}

const templates: Template[] = [
    {
        inFilename: 'Component.tsx.mustache',
        outFilename: '{{ componentName }}.tsx',
    },
    {
        inFilename: 'Component.styled.tsx.mustache',
        outFilename: '{{ componentName }}.styled.tsx',
    },
    {
        inFilename: 'Component.stories.tsx.mustache',
        outFilename: '{{ componentName }}.stories.tsx',
    },
    {
        inFilename: 'index.ts.mustache',
        outFilename: 'index.ts',
    },
]

// Create directory for component
const componentDir = path.resolve(__dirname, '..', componentName)
fs.mkdirSync(componentDir)

for (const template of templates) {
    // render template
    const input = fs.readFileSync(path.resolve(__dirname, 'template', template.inFilename), 'utf-8')
    const output = mustache.render(input, subst)

    // output rendered template
    const outPath = path.resolve(componentDir, mustache.render(template.outFilename, subst))
    fs.writeFileSync(outPath, output, {
        encoding: 'utf-8',
    })
}

console.log(`✅ New component created in ${componentDir}`)
