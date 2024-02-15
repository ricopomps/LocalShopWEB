import styles from "../styles/Grid.module.css";

export interface NodeTree {
  x: number;
  y: number;
  parent: NodeTree | null;
  height?: number;
}

export interface TreeProps {
  data: NodeTree[];
}

export default function TreeHigh({ data }: TreeProps) {
  const rootNode = data.find((node) => node.parent === null);
  const nodesWithHeight = data.map((node) => ({
    ...node,
    height: getHeight(node),
  }));
  console.log("nodesWithHeight", nodesWithHeight);
  if (!rootNode) return null;

  return (
    <div className={styles.tree}>
      <TreeNode node={rootNode} nodes={data} hight={0} />
    </div>
  );
}

interface TreeNodeProps {
  node: NodeTree;
  nodes: NodeTree[];
  hight: number;
}

function getHeight(node: NodeTree) {
  let height = 0;
  while (true) {
    if (!node.parent) return height;
    node = node.parent;
    height++;
  }
}

function getByHight(nodes: NodeTree[], high: number) {
  return nodes.filter((node) => getHeight(node) === high);
}
function TreeNode({ node, nodes, hight }: TreeNodeProps) {
  const children = nodes.filter(
    (nod) => nod.parent?.y === node.y && nod.parent.x === node.x
  );
  console.log("children", children);
  if (!children || children.length === 0) return null;
  return (
    <div className={`${styles.node} ${styles.gridCell}`}>
      <div className={styles.nodeLabel}>{`${node.x} - ${node.y}`}</div>
      <div className={styles.children}>
        {children.map((child) => (
          <TreeNode
            key={`${child.x}-${child.y}`}
            node={child}
            nodes={nodes}
            hight={hight + 1}
          />
        ))}
      </div>
    </div>
  );
}
