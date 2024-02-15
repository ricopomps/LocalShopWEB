import styles from "../styles/Grid.module.css";

export interface NodeTree {
  x: number;
  y: number;
  parent: NodeTree | null;
}

export interface TreeProps {
  data: NodeTree[];
}

export default function Tree({ data }: TreeProps) {
  const rootNode = data.find((node) => node.parent === null);
  if (!rootNode) return null;

  return (
    <div className={styles.tree}>
      <TreeNode node={rootNode} nodes={data} />
    </div>
  );
}

interface TreeNodeProps {
  node: NodeTree;
  nodes: NodeTree[];
}

function TreeNode({ node, nodes }: TreeNodeProps) {
  const children = nodes.filter(
    (nod) => nod.parent?.x === node.x && nod.parent.y === node.y
  );
  console.log("child, ", children);
  return (
    <div className={`${styles.node} ${styles.gridCell}`}>
      <div className={styles.nodeLabel}>{`${node.x} - ${node.y}`}</div>
      <div className={styles.children}>
        {children.map((child) => (
          <TreeNode key={`${child.x}-${child.y}`} node={child} nodes={nodes} />
        ))}
      </div>
    </div>
  );
}
