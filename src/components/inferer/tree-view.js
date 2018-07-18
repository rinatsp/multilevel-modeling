import React, { PureComponent } from 'react';

class TreeNode extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expanded: props.expanded,
            countOfVisibleChildren: 100
        };

        this.handleExpandClick = (e) => {
            e.stopPropagation();
            this.setState({
                expanded: !this.state.expanded
            }, () => {
                if (this.state.expanded) {
                    const { onExpand, node } = this.props;
                    if (onExpand) {
                        onExpand(node);
                    }
                }
            });
        };
    }
    hasChildren() {
        const { node, nodes } = this.props;
        if (node.hasChildren !== undefined) {
            return node.hasChildren;
        }
        return nodes.filter((n) => {
            return n.parent === node.id;
        }).length > 0;
    }
    getChildren() {
        const { node, nodes } = this.props;

        return nodes.filter((n) => {
            return n.parent === node.id;
        });
    }
    render() {
        const { node, renderNode, expandOnItemClick } = this.props;
        const { expanded, countOfVisibleChildren } = this.state;
        const hasChildren = this.hasChildren();
        const children = this.getChildren();
        let className = "tree-view__node";
        if (expanded) {
            className += " tree-view__node--expanded";
        }
        if (hasChildren) {
            className += " tree-view__node--has-children";
        }
        return (
            <div className={className} onClick={expandOnItemClick ? this.handleExpandClick : () => {}}>
                {
                    hasChildren &&
                        <i className="fa fa-caret-right tree-view__expander" onClick={this.handleExpandClick} />
                }
                <div className="tree-view__node__item">
                    {renderNode(node)}
                </div>
                {
                    hasChildren && expanded &&
                        <div className="tree-view__node-children">
                            {
                                children.length > 0 ?
                                    children.slice(0, countOfVisibleChildren).map((n) => {
                                        return (
                                            <div className="tree-view__child-container" key={n.id}>
                                                <TreeNode {...this.props} node={n} />
                                            </div>
                                        );
                                    }) :
                                    <div className="tree-view__child-container" key="0">
                                        <TreeNode {...this.props} node={{ isLoading: true }} nodes={[]} />
                                    </div>
                            }
                        </div>
                }
            </div>
        );
    }
}

class TreeView extends PureComponent {
    constructor(props) {
        super(props);
        this.handleExpand = (node) => {
            this.props.onExpand && this.props.onExpand(node);
        };
    }
    getRootNodes() {
        const { nodes } = this.props;
        return nodes.filter((n) => {
            return !n.parent || !(_.find(nodes, (p) => {
                return p.id === n.parent;
            }));
        });
    }
    render() {
        const { renderNode, expanded, nodes, expandOnItemClick } = this.props;
        return (
            <div className="tree-view">
                {
                    this.getRootNodes().map((n) => {
                        return (
                            <TreeNode
                                key={n.id}
                                renderNode={renderNode}
                                node={n}
                                nodes={nodes}
                                expanded={expanded}
                                onExpand={this.handleExpand}
                                expandOnItemClick={expandOnItemClick}
                            />
                        );
                    })
                }
            </div>
        );
    }
}

export class TreeNodeContent extends PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        const { selected, children, onClick } = this.props;
        return (
            <div className={`tree-view__node-content ${selected ? "tree-view__node-content--selected" : ""}`} onClick={onClick}>
                {children}
            </div>
        );
    }
}

export default TreeView;
