import type { ReactNode } from 'react';
import { isPlaceholder, val, type Maybe } from '@c-event/core';
import { ui } from '@c-event/content';

/**
 * Rendert einen Wert, der ein Platzhalter sein kann. Im Demo-Modus (html[data-ph="on"])
 * bekommt er einen gestrichelten Rahmen mit Hinweis, live ist er unsichtbar markiert.
 */
export function Ph<T>({
  v,
  children,
  as: Tag = 'span',
  className,
}: {
  v: Maybe<T>;
  children: (value: T) => ReactNode;
  as?: 'span' | 'div' | 'li';
  className?: string;
}) {
  const value = val(v);
  if (!isPlaceholder(v)) return className ? <Tag className={className}>{children(value)}</Tag> : <>{children(value)}</>;
  return (
    <Tag className={`ph ${className ?? ''}`} data-ph-note={v.note} title={`${ui.placeholder}: ${v.note}`}>
      {children(value)}
    </Tag>
  );
}

/** Kurzform für reinen Text. */
export function PhText({ v, className }: { v: Maybe<string>; className?: string }) {
  return <Ph v={v} className={className}>{(t) => t}</Ph>;
}
