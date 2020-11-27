import * as d3 from 'd3'
import * as dagreD3 from 'dagre-d3'
import * as uuid from 'uuid'
import { FlowNetwork, FlowEdge, FordFulkerson } from 'js-graph-algorithms'

export interface Cluster {
    name: string
    label: string
}

export interface Vertex {
    parent?: Cluster
    name: string
    label: string
    value: number
}

export interface Edge {
    from: Vertex
    to: Vertex
    capacity: number
}

export interface CirculationOptions {
    hideIsolatedVertices?: boolean
}

export class Graph {
    private clusters: Cluster[] = []
    private nodes: Vertex[] = []
    private edges: Edge[] = []

    constructor(private options: CirculationOptions = {}) {}

    public getNode(n: number) {
        return this.nodes[n]
    }

    public get V() {
        return this.nodes.length
    }

    public getNodesInCluster(cluster: Cluster) {
        return this.nodes.filter((node) => node.parent && node.parent === cluster)
    }

    public getCluster(n: number) {
        return this.clusters[n]
    }

    public get nClusters() {
        return this.clusters.length
    }

    public addCluster(cluster: Cluster) {
        this.clusters.push(cluster)
        return cluster
    }

    public addNode(node: Vertex) {
        this.nodes.push(node)
        return node
    }

    public addEdge(edge: Edge) {
        this.edges.push(edge)
        return edge
    }

    public maxFlow() {
        const network = new FlowNetwork(this.nodes.length)
        for (const edge of this.edges) {
            const from = this.nodes.findIndex((node) => node.name === edge.from.name)
            const to = this.nodes.findIndex((node) => node.name === edge.to.name)
            network.addEdge(new FlowEdge(from, to, edge.capacity))
        }
        const fordFulkerson = new FordFulkerson(network, 0, network.V - 1)
        return fordFulkerson.value
    }

    public renderToContainer(container: HTMLElement) {
        // build dagre graph
        const g = new dagreD3.graphlib.Graph({
            compound: true,
        }).setGraph({
            nodesep: 100,
            ranksep: 50,
            rankdir: 'LR',
            marginx: 20,
            marginy: 20,
        })
        const activeNodeSet = new Set<Vertex>()
        for (const edge of this.edges) {
            activeNodeSet.add(edge.from)
            activeNodeSet.add(edge.to)
            let label = String(edge.capacity)
            if (edge.capacity >= Number.MAX_VALUE) {
                label = '&infin;'
            }
            g.setEdge(edge.from.name, edge.to.name, {
                labelType: 'html',
                label: label,
                curve: d3.curveBasis,
            })
        }
        this.nodes.forEach((node, i) => {
            if (this.options.hideIsolatedVertices && !activeNodeSet.has(node)) {
                return
            }

            g.setNode(node.name, {
                labelType: 'html',
                labelStyle: 'text-align: center;',
                label: `
                        #${i}<br>
                        ${node.label}<br>
                        (<strong>${node.value}</strong> secs)
                    `,
                shape: 'circle',
                arrowhead: 0,
            })
            if (node.parent) {
                g.setParent(node.name, node.parent.name)
            }
        })
        this.clusters.forEach((cluster) => {
            g.setNode(cluster.name, {
                label: cluster.label,
                clusterLabelPos: 'top',
            })
        })

        container.innerHTML = ''
        const shadowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        try {
            container.appendChild(shadowSvg)
            shadowSvg.id = `graph-${uuid.v4()}`
            shadowSvg.style.backgroundColor = 'white'
            const svg = d3.select(`svg#${shadowSvg.id}`)
            svg.attr('width', '100%')
            svg.attr('height', '100%')
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
}
