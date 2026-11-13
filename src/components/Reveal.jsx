import { useReveal } from '../hooks/useReveal';

/**
 * Wraps content in an element that fades up once it scrolls into view.
 * `as` picks the tag (div by default); other props pass through.
 */
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const [ref, shown] = useReveal();
  const cls = ['fx', shown && 'in', className].filter(Boolean).join(' ');
  return (
    <Tag ref={ref} className={cls} {...rest}>
      {children}
    </Tag>
  );
}
