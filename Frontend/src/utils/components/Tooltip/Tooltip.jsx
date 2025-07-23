import './Tooltip.scss'
const Tooltip = ({ item, hoveredItem }) => (
  <div 
    className={`tooltip ${hoveredItem === item.id ? 'visible' : ''}`}
    role="tooltip"
  >
    {item.label}
    <div className="tooltip-arrow" />
  </div>
);

export default Tooltip;