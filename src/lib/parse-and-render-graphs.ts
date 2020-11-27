import * as d3 from 'd3'
import * as dagreD3 from 'dagre-d3'
import * as uuid from 'uuid'
import { FlowNetwork } from 'js-graph-algorithms'

export interface RenderFlowNetworkOptions {
    hideIsolatedVertices?: boolean
}

export function renderFlowNetwork(
    network: FlowNetwork,
    container: HTMLDivElement,
    options: RenderFlowNetworkOptions = {}
) {
    const g = new dagreD3.graphlib.Graph({
        compound: true,
    }).setGraph({
        nodesep: 100,
        ranksep: 50,
        rankdir: 'LR',
        marginx: 20,
        marginy: 20,
    })

    for (let i = 0; i < network.V; i++) {
        const edges = network.adj(i)
        if (options.hideIsolatedVertices && edges.length === 0) {
            continue
        }

        g.setNode(String(i), {
            label: network.node(i).label || String(i),
            shape: 'circle',
            arrowhead: 0,
        })

        for (const edge of edges) {
            const e = edge as any
            g.setEdge(String(e.v), String(e.w), {
                label: edge.label,
                curve: d3.curveBasis,
            })
        }
    }

    container.innerHTML = ''
    const shadowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    try {
        container.appendChild(shadowSvg)
        shadowSvg.id = `graph-${uuid.v4()}`
        shadowSvg.style.backgroundColor = 'white'
        const svg = d3.select(`svg#${shadowSvg.id}`)
        svg.attr('width', 800)
        svg.attr('height', 600)
        const inner = svg.append('g')

        const render = new dagreD3.render()
        const sel = d3.select(`svg#${shadowSvg.id} g`)
        render(sel as any, g)

        // centre
        const xCenterOffset = (Number(svg.attr('width')) - g.graph().width) / 2
        inner.attr('transform', 'translate(' + xCenterOffset + ', 20)')
        svg.attr('height', g.graph().height + 40)
    } catch (err) {
        console.error(err)
    }
}

/**
 * Parse graphs and render them to HTML markup.
 * Very expensive operation as it uses the D3 & DOM to draw.
 *
 * @param source
 */
export function parseAndRenderGraphs(source: string) {
    return source.replace(/\@\{([\s\S]*?)\}/gm, (_match, p1: string) => {
        const lines = p1
            .trim()
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line)
        const g = new dagreD3.graphlib.Graph({
            compound: true,
        }).setGraph({
            nodesep: 100,
            ranksep: 50,
            rankdir: 'LR',
            marginx: 20,
            marginy: 20,
        })
        // add nodes and edges
        for (const line of lines) {
            const tokens = line.split(/\s/).map((str) => {
                // DEAR LORD!!!
                const encoderDiv = document.createElement('div')
                // In goes the HTML-escaped string
                encoderDiv.innerHTML = str
                // This gets the original unescaped string
                return encoderDiv.textContent!
            })
            const kind = tokens[0]
            switch (kind) {
                case 'n': {
                    const id = tokens[1]
                    const label = tokens.length >= 3 ? tokens[2] : id
                    g.setNode(id, {
                        label,
                        shape: 'circle',
                        arrowhead: 0,
                    })
                    break
                }
                case '>':
                case '-': {
                    const from = tokens[1]
                    const to = tokens[2]
                    const label = tokens.length >= 4 ? tokens[3] : ' '
                    g.setEdge(from, to, {
                        label,
                        curve: d3.curveBasis,
                    })
                    break
                }
                case 'c': {
                    // cluster
                    const id = tokens[1]
                    const label = tokens.length >= 3 ? tokens[2] : id
                    g.setNode(id, {
                        label,
                        clusterLabelPos: 'top',
                    })
                    break
                }
                case '@': {
                    // assign node to cluster
                    const nodeId = tokens[1]
                    const clusterId = tokens[2]
                    g.setParent(nodeId, clusterId)
                }
            }
        }

        const shadowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        try {
            document.body.appendChild(shadowSvg)
            shadowSvg.id = `graph-${uuid.v4()}`
            shadowSvg.style.backgroundColor = 'white'
            const svg = d3.select(`svg#${shadowSvg.id}`)
            svg.attr('width', 800)
            svg.attr('height', 600)
            const inner = svg.append('g')

            const render = new dagreD3.render()
            const sel = d3.select(`svg#${shadowSvg.id} g`)
            render(sel as any, g)

            // centre
            const xCenterOffset = (Number(svg.attr('width')) - g.graph().width) / 2
            inner.attr('transform', 'translate(' + xCenterOffset + ', 20)')
            svg.attr('height', g.graph().height + 40)
        } catch (err) {
            console.error(err)
        } finally {
            shadowSvg.remove()
        }

        return shadowSvg.outerHTML
    })
}
