export const RemoveSvg = ({
  handleElementDeletion,
}: {
  handleElementDeletion: () => void;
}) => {
  return (
    <div
      className="canvas-item-list-actions-container canvas-element-list-action-remove clickable"
      onClick={() => handleElementDeletion()}
    >
      <svg
        width="800px"
        height="800px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 6L18 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
